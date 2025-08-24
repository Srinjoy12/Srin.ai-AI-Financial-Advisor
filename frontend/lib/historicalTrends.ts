// Historical Trends Analysis Service
import { supabase } from './supabaseClient';

interface MonthlySpending {
  month: string; // YYYY-MM format
  totalSpending: number;
  categorySpending: Record<string, number>;
  income: number;
  savings: number;
}

interface TrendData {
  category: string;
  months: string[];
  values: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  averageMonthly: number;
}

interface SpendingInsight {
  type: 'seasonal' | 'category_spike' | 'savings_improvement' | 'budget_deviation';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation: string;
}

class HistoricalTrendsService {
  async getMonthlySpendingTrends(userId: string, monthsBack: number = 6): Promise<MonthlySpending[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - monthsBack);

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, category, transaction_date, type')
        .eq('user_id', userId)
        .gte('transaction_date', startDate.toISOString().split('T')[0])
        .lte('transaction_date', endDate.toISOString().split('T')[0])
        .order('transaction_date', { ascending: true });

      if (error) {
        console.error('Error fetching historical transactions:', error);
        return [];
      }

      // Group transactions by month
      const monthlyData: Record<string, MonthlySpending> = {};
      
      (transactions || []).forEach(transaction => {
        const month = transaction.transaction_date.slice(0, 7); // YYYY-MM
        
        if (!monthlyData[month]) {
          monthlyData[month] = {
            month,
            totalSpending: 0,
            categorySpending: {},
            income: 0,
            savings: 0
          };
        }

        const amount = Math.abs(transaction.amount || 0);
        const category = transaction.category || 'others';

        if (transaction.type === 'expense') {
          monthlyData[month].totalSpending += amount;
          monthlyData[month].categorySpending[category] = 
            (monthlyData[month].categorySpending[category] || 0) + amount;
        } else if (transaction.type === 'income') {
          monthlyData[month].income += amount;
        }
      });

      // Calculate savings for each month
      Object.values(monthlyData).forEach(month => {
        month.savings = month.income - month.totalSpending;
      });

      return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    } catch (error) {
      console.error('Error getting monthly spending trends:', error);
      return [];
    }
  }

  async getCategoryTrends(userId: string, monthsBack: number = 6): Promise<TrendData[]> {
    const monthlyData = await this.getMonthlySpendingTrends(userId, monthsBack);
    
    if (monthlyData.length === 0) return [];

    // Get all unique categories
    const categories = new Set<string>();
    monthlyData.forEach(month => {
      Object.keys(month.categorySpending).forEach(category => categories.add(category));
    });

    const trends: TrendData[] = [];

    categories.forEach(category => {
      const months = monthlyData.map(m => m.month);
      const values = monthlyData.map(m => m.categorySpending[category] || 0);
      
      const trend = this.calculateTrend(values);
      const averageMonthly = values.reduce((sum, val) => sum + val, 0) / values.length;

      trends.push({
        category,
        months,
        values,
        trend: trend.direction,
        trendPercentage: trend.percentage,
        averageMonthly
      });
    });

    return trends.sort((a, b) => b.averageMonthly - a.averageMonthly);
  }

  private calculateTrend(values: number[]): { direction: 'increasing' | 'decreasing' | 'stable'; percentage: number } {
    if (values.length < 2) return { direction: 'stable', percentage: 0 };

    const firstHalf = values.slice(0, Math.ceil(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const percentageChange = firstAvg === 0 ? 0 : ((secondAvg - firstAvg) / firstAvg) * 100;

    if (Math.abs(percentageChange) < 5) {
      return { direction: 'stable', percentage: percentageChange };
    } else if (percentageChange > 0) {
      return { direction: 'increasing', percentage: percentageChange };
    } else {
      return { direction: 'decreasing', percentage: Math.abs(percentageChange) };
    }
  }

  async getSpendingInsights(userId: string): Promise<SpendingInsight[]> {
    const monthlyData = await this.getMonthlySpendingTrends(userId, 6);
    const categoryTrends = await this.getCategoryTrends(userId, 6);
    
    const insights: SpendingInsight[] = [];

    // 1. Seasonal spending patterns
    const seasonalInsight = this.analyzeSeasonalPatterns(monthlyData);
    if (seasonalInsight) insights.push(seasonalInsight);

    // 2. Category spike detection
    const categorySpikes = this.detectCategorySpikes(categoryTrends);
    insights.push(...categorySpikes);

    // 3. Savings improvement analysis
    const savingsInsight = this.analyzeSavingsImprovement(monthlyData);
    if (savingsInsight) insights.push(savingsInsight);

    // 4. Budget deviation patterns
    const budgetInsight = await this.analyzeBudgetDeviations(userId, monthlyData);
    if (budgetInsight) insights.push(budgetInsight);

    return insights;
  }

  private analyzeSeasonalPatterns(monthlyData: MonthlySpending[]): SpendingInsight | null {
    if (monthlyData.length < 3) return null;

    const avgSpending = monthlyData.reduce((sum, m) => sum + m.totalSpending, 0) / monthlyData.length;
    const highSpendingMonths = monthlyData.filter(m => m.totalSpending > avgSpending * 1.2);

    if (highSpendingMonths.length >= 2) {
      const months = highSpendingMonths.map(m => new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'long' }));
      
      return {
        type: 'seasonal',
        title: 'Seasonal Spending Pattern Detected',
        description: `Your spending tends to be higher in ${months.join(', ')}. Average increase: ${((highSpendingMonths.reduce((sum, m) => sum + m.totalSpending, 0) / highSpendingMonths.length / avgSpending - 1) * 100).toFixed(0)}%`,
        impact: 'neutral',
        recommendation: 'Consider setting aside extra budget for these months or plan major purchases during lower-spending periods.'
      };
    }

    return null;
  }

  private detectCategorySpikes(categoryTrends: TrendData[]): SpendingInsight[] {
    const insights: SpendingInsight[] = [];

    categoryTrends.forEach(trend => {
      if (trend.trend === 'increasing' && trend.trendPercentage > 25) {
        insights.push({
          type: 'category_spike',
          title: `${trend.category.charAt(0).toUpperCase() + trend.category.slice(1)} Spending Increase`,
          description: `Your ${trend.category} spending has increased by ${trend.trendPercentage.toFixed(0)}% over recent months.`,
          impact: 'negative',
          recommendation: `Review your ${trend.category} expenses and consider setting stricter limits or finding alternatives.`
        });
      } else if (trend.trend === 'decreasing' && trend.trendPercentage > 15) {
        insights.push({
          type: 'category_spike',
          title: `Great Progress on ${trend.category.charAt(0).toUpperCase() + trend.category.slice(1)}`,
          description: `You've reduced your ${trend.category} spending by ${trend.trendPercentage.toFixed(0)}% - excellent work!`,
          impact: 'positive',
          recommendation: `Keep up the good work! Consider applying similar strategies to other spending categories.`
        });
      }
    });

    return insights.slice(0, 3); // Limit to top 3 insights
  }

  private analyzeSavingsImprovement(monthlyData: MonthlySpending[]): SpendingInsight | null {
    if (monthlyData.length < 3) return null;

    const recentSavings = monthlyData.slice(-3).map(m => m.savings);
    const earlierSavings = monthlyData.slice(0, -3).map(m => m.savings);

    if (earlierSavings.length === 0) return null;

    const recentAvg = recentSavings.reduce((sum, s) => sum + s, 0) / recentSavings.length;
    const earlierAvg = earlierSavings.reduce((sum, s) => sum + s, 0) / earlierSavings.length;

    const improvement = recentAvg - earlierAvg;
    const improvementPercentage = earlierAvg === 0 ? 0 : (improvement / Math.abs(earlierAvg)) * 100;

    if (Math.abs(improvementPercentage) > 10) {
      return {
        type: 'savings_improvement',
        title: improvement > 0 ? 'Savings Improvement!' : 'Savings Decline Alert',
        description: `Your monthly savings have ${improvement > 0 ? 'increased' : 'decreased'} by ₹${Math.abs(improvement).toLocaleString()} (${Math.abs(improvementPercentage).toFixed(0)}%) recently.`,
        impact: improvement > 0 ? 'positive' : 'negative',
        recommendation: improvement > 0 
          ? 'Great progress! Consider investing these extra savings for long-term growth.'
          : 'Review your recent expenses and identify areas where you can cut back to improve your savings rate.'
      };
    }

    return null;
  }

  private async analyzeBudgetDeviations(userId: string, monthlyData: MonthlySpending[]): Promise<SpendingInsight | null> {
    try {
      // Get user's budget from AI analysis
      const { data: analysis } = await supabase
        .from('ai_analysis')
        .select('recommendations')
        .eq('user_id', userId)
        .eq('analysis_type', 'comprehensive_analysis')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const budgetLimits = analysis?.recommendations?.budgetAnalysis?.spendingLimits;
      if (!budgetLimits) return null;

      const totalBudget = Object.values(budgetLimits).reduce((sum: number, limit: any) => sum + limit, 0);
      const recentMonth = monthlyData[monthlyData.length - 1];
      
      if (!recentMonth) return null;

      const deviation = ((recentMonth.totalSpending - totalBudget) / totalBudget) * 100;

      if (Math.abs(deviation) > 15) {
        return {
          type: 'budget_deviation',
          title: deviation > 0 ? 'Budget Overspend Alert' : 'Under-Budget Success',
          description: `Last month you ${deviation > 0 ? 'exceeded' : 'stayed under'} your budget by ${Math.abs(deviation).toFixed(0)}% (₹${Math.abs(recentMonth.totalSpending - totalBudget).toLocaleString()}).`,
          impact: deviation > 0 ? 'negative' : 'positive',
          recommendation: deviation > 0
            ? 'Review your spending categories and adjust your budget or spending habits for next month.'
            : 'Excellent budget discipline! Consider allocating the surplus to savings or investments.'
        };
      }

      return null;
    } catch (error) {
      console.error('Error analyzing budget deviations:', error);
      return null;
    }
  }

  async getSpendingForecast(userId: string): Promise<{ category: string; predictedAmount: number; confidence: number }[]> {
    const trends = await this.getCategoryTrends(userId, 6);
    
    return trends.map(trend => {
      let predictedAmount = trend.averageMonthly;
      let confidence = 0.5; // Base confidence

      // Adjust prediction based on trend
      if (trend.trend === 'increasing') {
        predictedAmount *= (1 + trend.trendPercentage / 100);
        confidence = Math.min(0.9, 0.5 + (trend.trendPercentage / 100));
      } else if (trend.trend === 'decreasing') {
        predictedAmount *= (1 - trend.trendPercentage / 100);
        confidence = Math.min(0.9, 0.5 + (trend.trendPercentage / 100));
      } else {
        confidence = 0.8; // Stable trends are more predictable
      }

      return {
        category: trend.category,
        predictedAmount: Math.max(0, predictedAmount),
        confidence: Math.round(confidence * 100) / 100
      };
    }).sort((a, b) => b.predictedAmount - a.predictedAmount);
  }
}

export const historicalTrendsService = new HistoricalTrendsService();
export type { MonthlySpending, TrendData, SpendingInsight }; 