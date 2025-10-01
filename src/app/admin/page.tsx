'use client';

import { useState, useEffect } from 'react';
import AdminAuth from '@/components/AdminAuth';
import CampaignManagement from '@/components/CampaignManagement';
import AdminStats from '@/components/AdminStats';
import VerificationPanel from '@/components/VerificationPanel';
import AdminSettings from '@/components/AdminSettings';

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>>([]);

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminUser(data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('admin_token');
    }
  };

  const addNotification = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const handleLogin = (user: AdminUser, token: string) => {
    setAdminUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('admin_token', token);
    addNotification('success', `Welcome back, ${user.username}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('admin_token');
    setNotifications([]);
  };

  if (!isAuthenticated) {
    return <AdminAuth onLoginAction={handleLogin} />;
  }

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: '🎯' },
    { id: 'statistics', label: 'Statistics', icon: '📊' },
    { id: 'verification', label: 'Verification', icon: '✅' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>•</span>
                <span>Welcome, {adminUser?.username}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  🔔
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg border-l-4 ${
                notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                'bg-blue-50 border-blue-500 text-blue-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">{notification.message}</p>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-xs mt-1 opacity-75">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'campaigns' && (
            <CampaignManagement onNotificationAction={addNotification} />
          )}
          {activeTab === 'statistics' && (
            <AdminStats />
          )}
          {activeTab === 'verification' && (
            <VerificationPanel token={localStorage.getItem('admin_token') || ''} />
          )}
          {activeTab === 'settings' && (
            <AdminSettings token={localStorage.getItem('admin_token') || ''} />
          )}
        </div>
      </div>
    </div>
  );
}