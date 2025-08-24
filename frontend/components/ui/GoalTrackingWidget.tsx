'use client';

import { useEffect, useState } from 'react';
import { goalTrackingService, type FinancialGoal, type GoalProgress, type GoalInsight } from '@/lib/goalTracking';
import { supabase } from '@/lib/supabaseClient';
import { Target, TrendingUp, Calendar, DollarSign, Plus, CheckCircle } from 'lucide-react';

export default function GoalTrackingWidget() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [goalProgress, setGoalProgress] = useState<Record<string, GoalProgress>>({});
  const [insights, setInsights] = useState<GoalInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    overallProgress: 0
  });

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setLoading(true);
      
      // Fetch goals, insights, and summary
      const [goalsData, insightsData, summaryData] = await Promise.all([
        goalTrackingService.getUserGoals(user.id),
        goalTrackingService.getGoalInsights(user.id),
        goalTrackingService.getGoalSummary(user.id)
      ]);
      
      setGoals(goalsData);
      setInsights(insightsData);
      setSummary(summaryData);
      
      // Fetch progress for each goal
      const progressPromises = goalsData.map(async (goal) => {
        const progress = await goalTrackingService.getGoalProgress(goal.id);
        return { goalId: goal.id, progress };
      });
      
      const progressResults = await Promise.all(progressPromises);
      const progressMap: Record<string, GoalProgress> = {};
      
      progressResults.forEach(({ goalId, progress }) => {
        if (progress) {
          progressMap[goalId] = progress;
        }
      });
      
      setGoalProgress(progressMap);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const getCategoryIcon = (category: FinancialGoal['category']) => {
    switch (category) {
      case 'emergency_fund':
        return '🛡️';
      case 'house_down_payment':
        return '🏠';
      case 'retirement':
        return '👴';
      case 'vacation':
        return '✈️';
      case 'education':
        return '🎓';
      case 'debt_payoff':
        return '💳';
      case 'investment':
        return '📈';
      default:
        return '🎯';
    }
  };

  const getPriorityColor = (priority: FinancialGoal['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 border-red-500/30';
      case 'medium':
        return 'text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'text-green-400 border-green-500/30';
    }
  };

  const getInsightIcon = (type: GoalInsight['type']) => {
    switch (type) {
      case 'on_track':
        return '✅';
      case 'behind_schedule':
        return '⏰';
      case 'ahead_of_schedule':
        return '🚀';
      case 'adjustment_needed':
        return '⚙️';
    }
  };

  if (loading) {
    return (
      <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Financial Goals
            </h3>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Goals Summary */}
      <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" />
              <h3 className="text-gray-400 text-sm">Goals Overview</h3>
            </div>
            <div className="text-xs text-blue-400">
              {summary.overallProgress.toFixed(0)}% Complete
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-medium text-white">{summary.activeGoals}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-green-400">{summary.completedGoals}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-white">
                ₹{(summary.totalCurrentAmount / 100000).toFixed(1)}L
              </div>
              <div className="text-xs text-gray-400">Saved</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="w-full bg-gray-800/50 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, summary.overallProgress)}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 text-center">
            ₹{summary.totalCurrentAmount.toLocaleString()} of ₹{summary.totalTargetAmount.toLocaleString()}
          </div>
        </div>
        
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      </div>

      {/* Goal Insights */}
      {insights.length > 0 && (
        <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
          <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <h3 className="text-gray-400 text-sm">Goal Insights</h3>
            </div>

            <div className="space-y-3">
              {insights.slice(0, 3).map((insight, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    insight.impact === 'positive' ? 'border-green-500/30' : 
                    insight.impact === 'negative' ? 'border-red-500/30' : 'border-blue-500/30'
                  } bg-black/20`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getInsightIcon(insight.type)}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium mb-1">
                        {insight.title}
                      </div>
                      <div className="text-xs text-gray-300 mb-2">
                        {insight.message}
                      </div>
                      <div className="text-xs text-blue-400">
                        💡 {insight.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        </div>
      )}

      {/* Active Goals List */}
      <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <h3 className="text-gray-400 text-sm">Active Goals</h3>
            </div>
          </div>

          {goals.filter(g => g.status === 'active').length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-400 mb-2">No active goals yet</div>
              <div className="text-xs text-gray-500">Set your first financial goal to start tracking progress</div>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.filter(g => g.status === 'active').slice(0, 3).map((goal) => {
                const progress = goalProgress[goal.id];
                return (
                  <div key={goal.id} className="p-4 rounded-lg bg-black/20 border border-gray-600/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                        <div>
                          <div className="text-sm text-white font-medium">{goal.goalName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(goal.priority)}`}>
                              {goal.priority} priority
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      {progress && (
                        <div className="text-right">
                          <div className="text-sm text-white">
                            {progress.progressPercentage.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            {progress.onTrack ? '✅ On track' : '⏰ Behind'}
                          </div>
                        </div>
                      )}
                    </div>

                    {progress && (
                      <>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-800/50 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(100, progress.progressPercentage)}%` }}
                          />
                        </div>

                        {/* Goal Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-gray-400">Current / Target</div>
                            <div className="text-white">
                              ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Monthly Needed</div>
                            <div className="text-white">
                              ₹{progress.requiredMonthlyContribution.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Completed Goals */}
          {goals.filter(g => g.status === 'completed').length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-700/30">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Recently Completed</span>
              </div>
              <div className="space-y-2">
                {goals.filter(g => g.status === 'completed').slice(0, 2).map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                    <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white">{goal.goalName}</div>
                      <div className="text-xs text-green-400">
                        ₹{goal.targetAmount.toLocaleString()} achieved! 🎉
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      </div>
    </div>
  );
} 