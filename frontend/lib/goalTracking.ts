// Goal Tracking Service
import { supabase } from './supabaseClient';

interface FinancialGoal {
  id: string;
  userId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'emergency_fund' | 'house_down_payment' | 'retirement' | 'vacation' | 'education' | 'debt_payoff' | 'investment' | 'other';
  priority: 'high' | 'medium' | 'low';
  monthlyContribution: number;
  autoContribute: boolean;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface GoalProgress {
  goalId: string;
  progressPercentage: number;
  remainingAmount: number;
  monthsRemaining: number;
  onTrack: boolean;
  projectedCompletionDate: string;
  requiredMonthlyContribution: number;
  contributionHistory: ContributionRecord[];
}

interface ContributionRecord {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  type: 'manual' | 'automatic' | 'bonus';
  note?: string;
}

interface GoalInsight {
  goalId: string;
  type: 'on_track' | 'behind_schedule' | 'ahead_of_schedule' | 'adjustment_needed';
  title: string;
  message: string;
  recommendation: string;
  impact: 'positive' | 'negative' | 'neutral';
}

class GoalTrackingService {
  async createGoal(goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialGoal | null> {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert([{
          user_id: goal.userId,
          goal_name: goal.goalName,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          target_date: goal.targetDate,
          category: goal.category,
          priority: goal.priority,
          monthly_contribution: goal.monthlyContribution,
          auto_contribute: goal.autoContribute,
          status: goal.status
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        return null;
      }

      return this.mapDbGoalToGoal(data);
    } catch (error) {
      console.error('Error creating financial goal:', error);
      return null;
    }
  }

  async getUserGoals(userId: string): Promise<FinancialGoal[]> {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user goals:', error);
        return [];
      }

      return (data || []).map(this.mapDbGoalToGoal);
    } catch (error) {
      console.error('Error getting user goals:', error);
      return [];
    }
  }

  async updateGoalProgress(goalId: string, amount: number, type: 'manual' | 'automatic' | 'bonus' = 'manual', note?: string): Promise<boolean> {
    try {
      // Get current goal
      const { data: goal, error: goalError } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('id', goalId)
        .single();

      if (goalError || !goal) {
        console.error('Error fetching goal for update:', goalError);
        return false;
      }

      const newCurrentAmount = goal.current_amount + amount;

      // Update goal current amount
      const { error: updateError } = await supabase
        .from('financial_goals')
        .update({ 
          current_amount: newCurrentAmount,
          updated_at: new Date().toISOString(),
          status: newCurrentAmount >= goal.target_amount ? 'completed' : goal.status
        })
        .eq('id', goalId);

      if (updateError) {
        console.error('Error updating goal progress:', updateError);
        return false;
      }

      // Record contribution
      const { error: contributionError } = await supabase
        .from('goal_contributions')
        .insert([{
          goal_id: goalId,
          amount: amount,
          contribution_date: new Date().toISOString(),
          type: type,
          note: note
        }]);

      if (contributionError) {
        console.error('Error recording contribution:', contributionError);
        // Don't return false here as the goal was updated successfully
      }

      return true;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      return false;
    }
  }

  async getGoalProgress(goalId: string): Promise<GoalProgress | null> {
    try {
      // Get goal details
      const { data: goal, error: goalError } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('id', goalId)
        .single();

      if (goalError || !goal) {
        console.error('Error fetching goal:', goalError);
        return null;
      }

      // Get contribution history
      const { data: contributions, error: contributionsError } = await supabase
        .from('goal_contributions')
        .select('*')
        .eq('goal_id', goalId)
        .order('contribution_date', { ascending: false });

      if (contributionsError) {
        console.error('Error fetching contributions:', contributionsError);
        return null;
      }

      const progressPercentage = (goal.current_amount / goal.target_amount) * 100;
      const remainingAmount = goal.target_amount - goal.current_amount;
      
      const targetDate = new Date(goal.target_date);
      const now = new Date();
      const monthsRemaining = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      
      const requiredMonthlyContribution = monthsRemaining > 0 ? remainingAmount / monthsRemaining : 0;
      
      // Check if on track
      const expectedProgress = monthsRemaining > 0 ? 
        ((new Date().getTime() - new Date(goal.created_at).getTime()) / (targetDate.getTime() - new Date(goal.created_at).getTime())) * 100 : 100;
      const onTrack = progressPercentage >= expectedProgress * 0.9; // 10% tolerance

      // Project completion date based on current contribution rate
      const recentContributions = (contributions || []).slice(0, 6); // Last 6 contributions
      const avgContribution = recentContributions.length > 0 ? 
        recentContributions.reduce((sum, c) => sum + c.amount, 0) / recentContributions.length : goal.monthly_contribution;
      
      const monthsToCompletion = avgContribution > 0 ? Math.ceil(remainingAmount / avgContribution) : 999;
      const projectedCompletionDate = new Date();
      projectedCompletionDate.setMonth(projectedCompletionDate.getMonth() + monthsToCompletion);

      return {
        goalId,
        progressPercentage: Math.min(100, progressPercentage),
        remainingAmount,
        monthsRemaining,
        onTrack,
        projectedCompletionDate: projectedCompletionDate.toISOString(),
        requiredMonthlyContribution,
        contributionHistory: (contributions || []).map(c => ({
          id: c.id,
          goalId: c.goal_id,
          amount: c.amount,
          date: c.contribution_date,
          type: c.type,
          note: c.note
        }))
      };
    } catch (error) {
      console.error('Error getting goal progress:', error);
      return null;
    }
  }

  async getGoalInsights(userId: string): Promise<GoalInsight[]> {
    try {
      const goals = await this.getUserGoals(userId);
      const insights: GoalInsight[] = [];

      for (const goal of goals) {
        if (goal.status !== 'active') continue;

        const progress = await this.getGoalProgress(goal.id);
        if (!progress) continue;

        // Generate insights based on progress
        if (progress.progressPercentage >= 100) {
          insights.push({
            goalId: goal.id,
            type: 'on_track',
            title: `🎉 Goal Completed: ${goal.goalName}`,
            message: `Congratulations! You've reached your target of ₹${goal.targetAmount.toLocaleString()}.`,
            recommendation: 'Consider setting a new financial goal or increasing your target for this goal.',
            impact: 'positive'
          });
        } else if (progress.onTrack) {
          if (progress.progressPercentage > 80) {
            insights.push({
              goalId: goal.id,
              type: 'on_track',
              title: `🚀 Almost There: ${goal.goalName}`,
              message: `You're ${progress.progressPercentage.toFixed(0)}% of the way to your goal! Only ₹${progress.remainingAmount.toLocaleString()} remaining.`,
              recommendation: 'Keep up the excellent progress! You\'re on track to meet your target.',
              impact: 'positive'
            });
          }
        } else {
          insights.push({
            goalId: goal.id,
            type: 'behind_schedule',
            title: `⚠️ Behind Schedule: ${goal.goalName}`,
            message: `You need to contribute ₹${progress.requiredMonthlyContribution.toLocaleString()} monthly to reach your goal on time.`,
            recommendation: `Consider increasing your monthly contribution or extending your target date.`,
            impact: 'negative'
          });
        }

        // Check for stagnant goals (no contributions in last 2 months)
        const recentContributions = progress.contributionHistory.filter(c => {
          const contributionDate = new Date(c.date);
          const twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
          return contributionDate >= twoMonthsAgo;
        });

        if (recentContributions.length === 0 && progress.progressPercentage < 100) {
          insights.push({
            goalId: goal.id,
            type: 'adjustment_needed',
            title: `💤 Inactive Goal: ${goal.goalName}`,
            message: 'No contributions made in the last 2 months.',
            recommendation: 'Consider making a contribution or adjusting your goal if priorities have changed.',
            impact: 'negative'
          });
        }
      }

      return insights.slice(0, 5); // Limit to top 5 insights
    } catch (error) {
      console.error('Error getting goal insights:', error);
      return [];
    }
  }

  async getGoalSummary(userId: string): Promise<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    overallProgress: number;
  }> {
    try {
      const goals = await this.getUserGoals(userId);
      
      const activeGoals = goals.filter(g => g.status === 'active');
      const completedGoals = goals.filter(g => g.status === 'completed');
      
      const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
      const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
      const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

      return {
        totalGoals: goals.length,
        activeGoals: activeGoals.length,
        completedGoals: completedGoals.length,
        totalTargetAmount,
        totalCurrentAmount,
        overallProgress
      };
    } catch (error) {
      console.error('Error getting goal summary:', error);
      return {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        overallProgress: 0
      };
    }
  }

  private mapDbGoalToGoal(dbGoal: any): FinancialGoal {
    return {
      id: dbGoal.id,
      userId: dbGoal.user_id,
      goalName: dbGoal.goal_name,
      targetAmount: dbGoal.target_amount,
      currentAmount: dbGoal.current_amount,
      targetDate: dbGoal.target_date,
      category: dbGoal.category,
      priority: dbGoal.priority,
      monthlyContribution: dbGoal.monthly_contribution,
      autoContribute: dbGoal.auto_contribute,
      status: dbGoal.status,
      createdAt: dbGoal.created_at,
      updatedAt: dbGoal.updated_at || dbGoal.created_at
    };
  }

  // Auto-contribute feature (can be called by a scheduled job)
  async processAutoContributions(userId: string): Promise<number> {
    try {
      const goals = await this.getUserGoals(userId);
      const autoContributeGoals = goals.filter(g => g.autoContribute && g.status === 'active');
      
      let totalContributed = 0;

      for (const goal of autoContributeGoals) {
        const success = await this.updateGoalProgress(goal.id, goal.monthlyContribution, 'automatic', 'Auto-contribution');
        if (success) {
          totalContributed += goal.monthlyContribution;
        }
      }

      return totalContributed;
    } catch (error) {
      console.error('Error processing auto contributions:', error);
      return 0;
    }
  }
}

export const goalTrackingService = new GoalTrackingService();
export type { FinancialGoal, GoalProgress, ContributionRecord, GoalInsight }; 