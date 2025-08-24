'use client';

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart, Home, Layers, LogOut, Settings, ShoppingCart, UploadCloud, User, Bell, Search, Target, DollarSign, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UploadComponent from "@/components/ui/UploadComponent";
import AnalysisDisplay from "@/components/ui/AnalysisDisplay";
import MarketDataWidget from "@/components/ui/MarketDataWidget";
import BudgetAlertsWidget from "@/components/ui/BudgetAlertsWidget";
import HistoricalTrendsWidget from "@/components/ui/HistoricalTrendsWidget";
import GoalTrackingWidget from "@/components/ui/GoalTrackingWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Component as LumaSpin } from "@/components/ui/luma-spin";

const data = [
  { name: 'Jan', ethereum: 2500, bnb: 4000 },
  { name: 'Feb', ethereum: 1800, bnb: 3200 },
  { name: 'Mar', ethereum: 9500, bnb: 2800 },
  { name: 'Apr', ethereum: 4200, bnb: 2600 },
  { name: 'May', ethereum: 4800, bnb: 2900 },
  { name: 'Jun', ethereum: 4000, bnb: 3200 },
  { name: 'Jul', ethereum: 4100, bnb: 3600 },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          // If profile doesn't exist, create one
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert([{ 
                id: user.id, 
                name: user.user_metadata?.full_name || 'User' 
              }])
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating user profile:', createError);
            } else {
              setUserProfile(newProfile);
            }
          }
        } else {
          setUserProfile(profile);
        }
      }
    };
    getUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-black via-30% to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <LumaSpin />
          </div>
          <div className="text-white text-lg font-medium">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

      return (
      <div className="min-h-screen bg-gradient-to-br from-blue-800 via-black via-30% to-blue-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black/30 p-6 flex flex-col justify-between border-r border-white/20 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <img src="/logo.png" alt="Srin Logo" className="w-10 h-10 rounded-full object-contain" />
            <span className="text-xl font-medium text-white">Srin</span>
          </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'dashboard' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setCurrentView('assets')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'assets' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span>Assets</span>
            </button>
            <button 
              onClick={() => setCurrentView('staking')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'staking' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Staking</span>
            </button>
            <button 
              onClick={() => setCurrentView('upload')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'upload' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <UploadCloud className="w-5 h-5" />
              <span>Upload</span>
            </button>
            <button 
              onClick={() => setCurrentView('analysis')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'analysis' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <BarChart className="w-5 h-5" />
              <span>Analysis</span>
            </button>
            <button 
              onClick={() => setCurrentView('market')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'market' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span>Market</span>
            </button>
            <button 
              onClick={() => setCurrentView('alerts')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'alerts' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Alerts</span>
            </button>
            <button 
              onClick={() => setCurrentView('trends')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'trends' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Trends</span>
            </button>
            <button 
              onClick={() => setCurrentView('goals')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'goals' 
                  ? 'bg-white/10 text-white backdrop-blur-md' 
                  : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              <Target className="w-5 h-5" />
              <span>Goals</span>
            </button>
          </nav>
        </div>
        <div>
          <a href="#" className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/5">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-white mt-2">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {currentView === 'dashboard' && (
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-medium text-white">Dashboard</h1>
                <p className="text-gray-400">Welcome back, {user.email}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input type="text" placeholder="Search..." className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:border-blue-500" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button className="p-2 rounded-lg bg-black/50 border border-white/10 hover:bg-white/10">
                  <Bell className="w-5 h-5 text-white" />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <InfoCard title="Status" value={userProfile.name} />
                <InfoCard title="Monthly Salary" value={`₹${userProfile.salary || '0'}`} />
                <InfoCard title="Spending Limit" value="₹25,000" />
                <InfoCard title="Spent This Month" value="₹18,500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <InfoCard title="Total Savings" value="₹1,25,000" />
                <InfoCard title="Investment Goal" value="₹5,00,000" />
                <InfoCard title="Stocks Portfolio" value="₹2,50,000" />
            </div>

            {/* Goals and Spending Limits Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
                    <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            Financial Goals
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">House Down Payment</span>
                                <span className="text-white font-semibold">₹15,00,000</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3 shadow-inner backdrop-blur-sm border border-gray-600/30">
                                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 h-3 rounded-full shadow-lg shadow-blue-500/60 relative overflow-hidden transition-all duration-700 ease-out" style={{ width: '35%' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-300/40 to-blue-400/0 blur-sm"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Emergency Fund</span>
                                <span className="text-white font-semibold">₹3,00,000</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3 shadow-inner backdrop-blur-sm border border-gray-600/30">
                                <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 h-3 rounded-full shadow-lg shadow-green-500/60 relative overflow-hidden transition-all duration-700 ease-out" style={{ width: '80%' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/40 to-green-400/0 blur-sm"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Retirement Fund</span>
                                <span className="text-white font-semibold">₹50,00,000</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3 shadow-inner backdrop-blur-sm border border-gray-600/30">
                                <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400 h-3 rounded-full shadow-lg shadow-purple-500/60 relative overflow-hidden transition-all duration-700 ease-out" style={{ width: '15%' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-300/40 to-purple-400/0 blur-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
                </div>

                <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
                    <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            Spending Limits
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Groceries</span>
                                <span className="text-white font-semibold">₹8,000 / ₹10,000</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3 shadow-inner backdrop-blur-sm border border-gray-600/30">
                                <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 h-3 rounded-full shadow-lg shadow-green-500/60 relative overflow-hidden transition-all duration-700 ease-out" style={{ width: '80%' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/40 to-green-400/0 blur-sm"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Entertainment</span>
                                <span className="text-white font-semibold">₹4,500 / ₹5,000</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3 shadow-inner backdrop-blur-sm border border-gray-600/30">
                                <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-400 h-3 rounded-full shadow-lg shadow-yellow-500/60 relative overflow-hidden transition-all duration-700 ease-out" style={{ width: '90%' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-300/40 to-yellow-400/0 blur-sm"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Shopping</span>
                                <span className="text-white font-semibold">₹6,000 / ₹8,000</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3 shadow-inner backdrop-blur-sm border border-gray-600/30">
                                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 h-3 rounded-full shadow-lg shadow-blue-500/60 relative overflow-hidden transition-all duration-700 ease-out" style={{ width: '75%' }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-300/40 to-blue-400/0 blur-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <StatCard title="Ethereum (ETH)" value="13.62%" change="+4.25%" />
              <StatCard title="BNB Chain" value="12.72%" change="+5.67%" />
              <StatCard title="Polygon (Matic)" value="6.29%" change="-1.89%" />
            </div>

                                                                    <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
              <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
              <h2 className="text-xl font-medium text-white mb-4 relative z-10">Your Active Stakings</h2>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="ethereumGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="bnbGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="#888" axisLine={false} tickLine={false} />
                        <YAxis stroke="#888" axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(0,0,0,0.9)', 
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }} 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="ethereum" 
                            stroke="#00ff88" 
                            strokeWidth={3} 
                            fill="url(#ethereumGradient)"
                            dot={false}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="bnb" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            fill="url(#bnbGradient)"
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
              <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
            </div>

            {/* Quick Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-white mb-4">Market Overview</h2>
                <MarketDataWidget />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-white mb-4">Recent Alerts</h2>
                <BudgetAlertsWidget />
              </div>
            </div>
          </>
        )}

        {currentView === 'upload' && (
          <UploadComponent />
        )}

        {currentView === 'analysis' && (
          <AnalysisDisplay />
        )}

        {currentView === 'assets' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-medium text-white mb-2">Assets</h1>
              <p className="text-gray-400">Manage your investment portfolio</p>
            </div>
            <Card className="bg-black/30 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-white">Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Asset management features will be available soon.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'staking' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-medium text-white mb-2">Staking</h1>
              <p className="text-gray-400">Manage your staking positions</p>
            </div>
            <Card className="bg-black/30 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl text-white">Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Staking features will be available soon.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'market' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-medium text-white mb-2">Market Data</h1>
              <p className="text-gray-400">Real-time stock prices and market overview</p>
            </div>
            <MarketDataWidget />
          </div>
        )}

        {currentView === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-medium text-white mb-2">Budget Alerts</h1>
              <p className="text-gray-400">Monitor your spending limits and get notifications</p>
            </div>
            <BudgetAlertsWidget />
          </div>
        )}

        {currentView === 'trends' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-medium text-white mb-2">Spending Trends</h1>
              <p className="text-gray-400">Historical analysis and insights into your spending patterns</p>
            </div>
            <HistoricalTrendsWidget />
          </div>
        )}

        {currentView === 'goals' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-medium text-white mb-2">Financial Goals</h1>
              <p className="text-gray-400">Track your progress towards financial objectives</p>
            </div>
            <GoalTrackingWidget />
          </div>
        )}
      </main>
    </div>
  );
}

const StatCard = ({ title, value, change }: { title: string, value: string, change: string }) => (
  <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
    <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
    <div className="relative z-10">
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <p className="text-5xl font-medium text-white mb-2">{value}</p>
      <p className={`text-sm ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
    </div>
    <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
  </div>
);

const InfoCard = ({ title, value }: { title: string, value: string }) => (
    <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        <div className="relative z-10">
            <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
            <p className="text-4xl font-medium text-white">{value}</p>
        </div>
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
    </div>
); 