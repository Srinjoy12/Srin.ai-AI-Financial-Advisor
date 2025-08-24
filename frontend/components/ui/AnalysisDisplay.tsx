'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Target, 
  DollarSign, 
  Shield, 
  BarChart3,
  Calendar,
  PiggyBank,
  Building2,
  Coins
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisData {
  transactionAnalysis: any;
  budgetAnalysis: any;
  investmentAnalysis: any;
}

export default function AnalysisDisplay() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to view analysis.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/analysis', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalysis(result.data);
      } else {
        setError(result.message || 'Failed to fetch analysis.');
      }
    } catch (error) {
      setError('An error occurred while fetching analysis.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading your financial analysis...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-red-500/10 border border-red-500/20">
          <CardContent className="pt-6">
            <p className="text-red-400 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-medium text-white mb-2">Financial Analysis</h1>
          <p className="text-gray-400">Your personalized AI-powered financial insights</p>
        </div>
        
        <Card className="bg-blue-500/10 border border-blue-500/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold mb-2">No Analysis Available</h3>
                <p className="text-gray-400 mb-4">
                  Upload your financial documents to get personalized AI analysis and insights.
                </p>
                <p className="text-sm text-blue-400">
                  Go to the Upload section to get started with your financial analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const spendingData = analysis.transactionAnalysis?.spendingCategories ? 
    Object.entries(analysis.transactionAnalysis.spendingCategories).map(([key, value]: [string, any]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value.amount,
      percentage: value.percentage
    })) : [];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6b7280'];

  return (
    <div className="space-y-6">
      <div>
                  <h1 className="text-3xl font-medium text-white mb-2">Financial Analysis</h1>
        <p className="text-gray-400">Your personalized AI-powered financial insights</p>
      </div>

      {/* Transaction Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Income</p>
                <p className="text-4xl font-medium text-green-400">₹{analysis.transactionAnalysis?.totalIncome?.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Expenses</p>
                <p className="text-4xl font-medium text-red-400">₹{analysis.transactionAnalysis?.totalExpenses?.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Net Savings</p>
                <p className="text-4xl font-medium text-blue-400">₹{analysis.transactionAnalysis?.netSavings?.toLocaleString()}</p>
              </div>
              <PiggyBank className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              Spending Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => `₹${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Recommendations */}
        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Budget Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.budgetAnalysis?.recommendedBudget && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Needs (50%)</span>
                  <span className="text-green-400 font-semibold">₹{analysis.budgetAnalysis.recommendedBudget.needs.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Wants (30%)</span>
                  <span className="text-blue-400 font-semibold">₹{analysis.budgetAnalysis.recommendedBudget.wants.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Savings (20%)</span>
                  <span className="text-purple-400 font-semibold">₹{analysis.budgetAnalysis.recommendedBudget.savings.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Investment Recommendations */}
      <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-yellow-400" />
            Investment Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Risk Assessment */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Risk Profile
              </h3>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-400 font-medium">{analysis.investmentAnalysis?.riskAssessment?.riskProfile}</p>
                <p className="text-gray-400 text-sm">Risk Score: {analysis.investmentAnalysis?.riskAssessment?.riskScore}</p>
              </div>
            </div>

            {/* Portfolio Diversification */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-400" />
                Portfolio Allocation
              </h3>
              <div className="space-y-2">
                {analysis.investmentAnalysis?.portfolioDiversification && 
                  Object.entries(analysis.investmentAnalysis.portfolioDiversification).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-white font-semibold">{value}%</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Stock Recommendations */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Top Stock Picks
              </h3>
              <div className="space-y-2">
                {analysis.investmentAnalysis?.stockRecommendations?.slice(0, 3).map((stock: any, index: number) => (
                  <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                    <p className="text-green-400 font-medium text-sm">{stock.symbol}</p>
                    <p className="text-gray-400 text-xs">{stock.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      {analysis.budgetAnalysis?.savingsGoals && (
        <Card className="bg-black/30 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Savings Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.budgetAnalysis.savingsGoals.map((goal: any, index: number) => (
                <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold">{goal.goal}</h4>
                  <p className="text-white text-2xl font-medium">₹{goal.targetAmount.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Monthly: ₹{goal.monthlyContribution.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">{goal.timeline}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 