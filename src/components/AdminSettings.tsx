'use client';

import { useState, useEffect } from 'react';

interface AdminSettingsProps {
  token: string;
}

interface SystemSettings {
  maxEntriesPerUser: number;
  verificationRequired: boolean;
  autoVerification: boolean;
  allowedDomains: string[];
  blockchainNetwork: string;
  maintenanceMode: boolean;
}

export default function AdminSettings({ token }: AdminSettingsProps) {
  const [settings, setSettings] = useState<SystemSettings>({
    maxEntriesPerUser: 10,
    verificationRequired: true,
    autoVerification: false,
    allowedDomains: [],
    blockchainNetwork: 'base',
    maintenanceMode: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll use default settings
      // In a real app, you'd fetch from an API
      setSettings({
        maxEntriesPerUser: 10,
        verificationRequired: true,
        autoVerification: false,
        allowedDomains: ['gmail.com', 'outlook.com', 'yahoo.com'],
        blockchainNetwork: 'base',
        maintenanceMode: false
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // For demo purposes, we'll just simulate saving
      // In a real app, you'd send to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDomain = () => {
    if (newDomain && !settings.allowedDomains.includes(newDomain)) {
      setSettings(prev => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, newDomain]
      }));
      setNewDomain('');
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setSettings(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter(d => d !== domain)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Entries Per User
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.maxEntriesPerUser}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maxEntriesPerUser: parseInt(e.target.value) || 1
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blockchain Network
            </label>
            <select
              value={settings.blockchainNetwork}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                blockchainNetwork: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="base">Base</option>
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="arbitrum">Arbitrum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verification Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="verificationRequired"
              checked={settings.verificationRequired}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                verificationRequired: e.target.checked
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="verificationRequired" className="ml-2 block text-sm text-gray-900">
              Require manual verification for all entries
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoVerification"
              checked={settings.autoVerification}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                autoVerification: e.target.checked
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoVerification" className="ml-2 block text-sm text-gray-900">
              Enable automatic verification for trusted domains
            </label>
          </div>
        </div>
      </div>

      {/* Email Domain Management */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Allowed Email Domains</h3>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter domain (e.g., gmail.com)"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddDomain}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings.allowedDomains.map((domain) => (
              <span
                key={domain}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {domain}
                <button
                  onClick={() => handleRemoveDomain(domain)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maintenanceMode: e.target.checked
              }))}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
              Enable maintenance mode (prevents new submissions)
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* System Information */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Version:</span>
            <span className="ml-2 text-gray-600">1.0.0</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Environment:</span>
            <span className="ml-2 text-gray-600">
              {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Database:</span>
            <span className="ml-2 text-green-600">Connected</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Real-time Updates:</span>
            <span className="ml-2 text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}