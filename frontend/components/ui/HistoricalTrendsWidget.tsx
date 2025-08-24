'use client';

import { useEffect, useState } from 'react';
import { historicalTrendsService, type SpendingInsight, type TrendData } from '@/lib/historicalTrends';
import { supabase } from '@/lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3, Lightbulb } from 'lucide-react';

export default function HistoricalTrendsWidget() {
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [categoryTrends, setCategoryTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const fetchTrends = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setLoading(true);
      
      // Fetch insights and trends
      const [insightsData, trendsData] = await Promise.all([
        historicalTrendsService.getSpendingInsights(user.id),
        historicalTrendsService.getCategoryTrends(user.id, 6)
      ]);
      
      setInsights(insightsData);
      setCategoryTrends(trendsData);
      
      if (trendsData.length > 0 && !selectedCategory) {
        setSelectedCategory(trendsData[0].category);
      }
    } catch (error) {
      console.error('Error fetching historical trends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getInsightIcon = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return '🎉';
      case 'negative':
        return '⚠️';
      case 'neutral':
        return '📊';
    }
  };

  const getInsightBorderColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return 'border-green-500/30';
      case 'negative':
        return 'border-red-500/30';
      case 'neutral':
        return 'border-blue-500/30';
    }
  };

  const selectedTrendData = categoryTrends.find(t => t.category === selectedCategory);
  const chartData = selectedTrendData ? 
    selectedTrendData.months.map((month, index) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      amount: selectedTrendData.values[index]
    })) : [];

  if (loading) {
    return (
      <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Spending Trends
            </h3>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Spending Insights */}
      <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-gray-400" />
            <h3 className="text-gray-400 text-sm">Spending Insights</h3>
          </div>

          {insights.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-sm text-gray-400">No insights available yet.</div>
              <div className="text-xs text-gray-500 mt-1">Upload more transactions to see patterns.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${getInsightBorderColor(insight.impact)} bg-black/20`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getInsightIcon(insight.impact)}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium mb-1">
                        {insight.title}
                      </div>
                      <div className="text-xs text-gray-300 mb-2">
                        {insight.description}
                      </div>
                      <div className="text-xs text-blue-400">
                        💡 {insight.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      </div>

      {/* Category Trends Chart */}
      <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <h3 className="text-gray-400 text-sm">Category Trends (6 Months)</h3>
            </div>
            {categoryTrends.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-black/30 border border-gray-600/30 rounded px-2 py-1 text-xs text-white"
              >
                {categoryTrends.map((trend) => (
                  <option key={trend.category} value={trend.category}>
                    {trend.category.charAt(0).toUpperCase() + trend.category.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {categoryTrends.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-400">No trend data available</div>
              <div className="text-xs text-gray-500 mt-1">Upload transactions to see spending trends</div>
            </div>
          ) : (
            <>
              {/* Chart */}
              <div className="h-40 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey="month" 
                      stroke="#888" 
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#888" 
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Trend Summary */}
              {selectedTrendData && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-gray-400 mb-1">Trend</div>
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(selectedTrendData.trend)}
                      <span className="text-white capitalize">{selectedTrendData.trend}</span>
                      <span className="text-gray-400">
                        ({selectedTrendData.trendPercentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 mb-1">Monthly Avg</div>
                    <div className="text-white font-medium">
                      ₹{selectedTrendData.averageMonthly.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      </div>
    </div>
  );
} 