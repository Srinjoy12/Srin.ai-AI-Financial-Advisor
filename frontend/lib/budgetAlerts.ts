// Budget Alerts System
import { supabase } from './supabaseClient';

interface BudgetAlert {
  id: string;
  userId: string;
  category: string;
  currentSpending: number;
  budgetLimit: number;
  percentage: number;
  alertType: 'warning' | 'danger' | 'exceeded';
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface SpendingData {
  category: string;
  amount: number;
  date: string;
}

class BudgetAlertsService {
  // Alert thresholds
  private readonly WARNING_THRESHOLD = 75; // 75% of budget
  private readonly DANGER_THRESHOLD = 90;  // 90% of budget
  private readonly EXCEEDED_THRESHOLD = 100; // 100% of budget

  async checkBudgetAlerts(userId: string): Promise<BudgetAlert[]> {
    try {
      // Get user's current month spending
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('category, amount, transaction_date')
        .eq('user_id', userId)
        .eq('type', 'expense')
        .gte('transaction_date', `${currentMonth}-01`)
        .lt('transaction_date', `${currentMonth}-32`);

      if (transError) {
        console.error('Error fetching transactions:', transError);
        return [];
      }

      // Get user's budget limits from latest AI analysis
      const { data: analysis, error: analysisError } = await supabase
        .from('ai_analysis')
        .select('recommendations')
        .eq('user_id', userId)
        .eq('analysis_type', 'comprehensive_analysis')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (analysisError || !analysis) {
        console.error('Error fetching budget analysis:', analysisError);
        return [];
      }

      const budgetLimits = analysis.recommendations?.budgetAnalysis?.spendingLimits || {};
      
      // Calculate spending by category
      const spendingByCategory = this.calculateSpendingByCategory(transactions || []);
      
      // Generate alerts
      const alerts: BudgetAlert[] = [];
      
      for (const [category, limit] of Object.entries(budgetLimits)) {
        const currentSpending = spendingByCategory[category] || 0;
        const percentage = (currentSpending / (limit as number)) * 100;
        
        if (percentage >= this.WARNING_THRESHOLD) {
          const alert = this.createAlert(userId, category, currentSpending, limit as number, percentage);
          if (alert) {
            alerts.push(alert);
          }
        }
      }

      // Store alerts in database
      if (alerts.length > 0) {
        await this.storeAlerts(alerts);
      }

      return alerts;
    } catch (error) {
      console.error('Error checking budget alerts:', error);
      return [];
    }
  }

  private calculateSpendingByCategory(transactions: any[]): Record<string, number> {
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'others';
      const amount = Math.abs(transaction.amount || 0);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
  }

  private createAlert(
    userId: string, 
    category: string, 
    currentSpending: number, 
    budgetLimit: number, 
    percentage: number
  ): BudgetAlert | null {
    let alertType: 'warning' | 'danger' | 'exceeded';
    let message: string;

    if (percentage >= this.EXCEEDED_THRESHOLD) {
      alertType = 'exceeded';
      message = `🚨 Budget exceeded for ${category}! You've spent ₹${currentSpending.toLocaleString()} (${percentage.toFixed(0)}% of your ₹${budgetLimit.toLocaleString()} budget)`;
    } else if (percentage >= this.DANGER_THRESHOLD) {
      alertType = 'danger';
      message = `⚠️ Almost at budget limit for ${category}! You've spent ₹${currentSpending.toLocaleString()} (${percentage.toFixed(0)}% of your ₹${budgetLimit.toLocaleString()} budget)`;
    } else if (percentage >= this.WARNING_THRESHOLD) {
      alertType = 'warning';
      message = `💡 Budget warning for ${category}: You've spent ₹${currentSpending.toLocaleString()} (${percentage.toFixed(0)}% of your ₹${budgetLimit.toLocaleString()} budget)`;
    } else {
      return null; // No alert needed
    }

    return {
      id: `${userId}-${category}-${Date.now()}`,
      userId,
      category,
      currentSpending,
      budgetLimit,
      percentage,
      alertType,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
  }

  private async storeAlerts(alerts: BudgetAlert[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('budget_alerts')
        .upsert(alerts.map(alert => ({
          id: alert.id,
          user_id: alert.userId,
          category: alert.category,
          current_spending: alert.currentSpending,
          budget_limit: alert.budgetLimit,
          percentage: alert.percentage,
          alert_type: alert.alertType,
          message: alert.message,
          is_read: alert.isRead,
          created_at: alert.createdAt
        })), {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error storing budget alerts:', error);
      }
    } catch (error) {
      console.error('Error storing alerts:', error);
    }
  }

  async getUserAlerts(userId: string, limit: number = 10): Promise<BudgetAlert[]> {
    try {
      const { data, error } = await supabase
        .from('budget_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user alerts:', error);
        return [];
      }

      return (data || []).map(alert => ({
        id: alert.id,
        userId: alert.user_id,
        category: alert.category,
        currentSpending: alert.current_spending,
        budgetLimit: alert.budget_limit,
        percentage: alert.percentage,
        alertType: alert.alert_type,
        message: alert.message,
        isRead: alert.is_read,
        createdAt: alert.created_at
      }));
    } catch (error) {
      console.error('Error getting user alerts:', error);
      return [];
    }
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('budget_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) {
        console.error('Error marking alert as read:', error);
      }
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  }

  async getUnreadAlertsCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('budget_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread alerts count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error counting unread alerts:', error);
      return 0;
    }
  }

  // Real-time spending check (call this when new transactions are added)
  async checkSpendingAfterTransaction(userId: string, category: string, amount: number): Promise<BudgetAlert | null> {
    try {
      // Get current month spending for this category
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('category', category)
        .eq('type', 'expense')
        .gte('transaction_date', `${currentMonth}-01`)
        .lt('transaction_date', `${currentMonth}-32`);

      if (error) return null;

      const totalSpending = (transactions || []).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
      // Get budget limit for this category
      const { data: analysis } = await supabase
        .from('ai_analysis')
        .select('recommendations')
        .eq('user_id', userId)
        .eq('analysis_type', 'comprehensive_analysis')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const budgetLimit = analysis?.recommendations?.budgetAnalysis?.spendingLimits?.[category];
      if (!budgetLimit) return null;

      const percentage = (totalSpending / budgetLimit) * 100;
      
      if (percentage >= this.WARNING_THRESHOLD) {
        const alert = this.createAlert(userId, category, totalSpending, budgetLimit, percentage);
        if (alert) {
          await this.storeAlerts([alert]);
          return alert;
        }
      }

      return null;
    } catch (error) {
      console.error('Error checking spending after transaction:', error);
      return null;
    }
  }
}

export const budgetAlertsService = new BudgetAlertsService();
export type { BudgetAlert }; 