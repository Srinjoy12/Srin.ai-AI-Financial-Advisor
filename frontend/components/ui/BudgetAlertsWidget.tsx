'use client';

import { useEffect, useState } from 'react';
import { budgetAlertsService, type BudgetAlert } from '@/lib/budgetAlerts';
import { supabase } from '@/lib/supabaseClient';
import { AlertTriangle, CheckCircle, XCircle, Bell, BellOff } from 'lucide-react';

export default function BudgetAlertsWidget() {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setLoading(true);
      
      // Check for new alerts first
      await budgetAlertsService.checkBudgetAlerts(user.id);
      
      // Fetch user alerts
      const userAlerts = await budgetAlertsService.getUserAlerts(user.id, 5);
      setAlerts(userAlerts);
      
      // Get unread count
      const count = await budgetAlertsService.getUnreadAlertsCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching budget alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Check for alerts every 30 minutes
    const interval = setInterval(fetchAlerts, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (alertId: string) => {
    try {
      await budgetAlertsService.markAlertAsRead(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const getAlertIcon = (alertType: BudgetAlert['alertType']) => {
    switch (alertType) {
      case 'exceeded':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertBorderColor = (alertType: BudgetAlert['alertType']) => {
    switch (alertType) {
      case 'exceeded':
        return 'border-red-500/30';
      case 'danger':
        return 'border-orange-500/30';
      case 'warning':
        return 'border-yellow-500/30';
      default:
        return 'border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Budget Alerts
            </h3>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>
        <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative bg-blue-500/5 hover:bg-blue-500/0 p-6 rounded-lg border border-blue-500/20 backdrop-blur-md transition-all duration-300 group">
      <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
            {unreadCount > 0 ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            Budget Alerts
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">All good! No budget alerts.</div>
            <div className="text-xs text-gray-500 mt-1">Your spending is within limits.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertBorderColor(alert.alertType)} bg-black/20 ${
                  !alert.isRead ? 'bg-opacity-40' : 'bg-opacity-20'
                } transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.alertType)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium mb-1">
                      {alert.category.charAt(0).toUpperCase() + alert.category.slice(1)}
                    </div>
                    <div className="text-xs text-gray-300 leading-relaxed">
                      {alert.message}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </div>
                      {!alert.isRead && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700/30">
            <button
              onClick={fetchAlerts}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Refresh alerts
            </button>
          </div>
        )}
      </div>
      
      <span className="absolute opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px bottom-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-blue-600 to-transparent" />
    </div>
  );
} 