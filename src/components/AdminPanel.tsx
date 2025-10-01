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

interface AdminPanelProps {
  onBackAction?: () => void;
}

const AdminPanel = ({ onBackAction }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState('campaigns');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>>([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token with backend
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
        } else {
          localStorage.removeItem('adminToken');
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
      });
    }
  }, []);

  const handleLogin = (user: AdminUser, token: string) => {
    setIsAuthenticated(true);
    setAdminUser(user);
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    setAdminToken('');
    localStorage.removeItem('adminToken');
  };

  const handleNotification = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  if (!isAuthenticated) {
    return <AdminAuth onLoginAction={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {onBackAction && (
                <button
                  onClick={onBackAction}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
              )}
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Welcome, {adminUser?.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'campaigns', label: 'Campaigns' },
              { id: 'stats', label: 'Statistics' },
              { id: 'verification', label: 'Verification' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Latest:</span>
              <span className={`text-xs ${
                notifications[0].type === 'error' ? 'text-red-400' :
                notifications[0].type === 'warning' ? 'text-yellow-400' :
                notifications[0].type === 'success' ? 'text-green-400' :
                'text-blue-400'
              }`}>
                {notifications[0].message}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'campaigns' && <CampaignManagement 
              onNotificationAction={handleNotification} 
            />}
        {activeTab === 'stats' && <AdminStats />}
        {activeTab === 'verification' && <VerificationPanel token={adminToken} />}
        {activeTab === 'settings' && <AdminSettings token={adminToken} />}
      </div>
    </div>
  );
};

export default AdminPanel;