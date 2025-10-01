'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdminStatsData {
  overview: {
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    totalEntries: number;
    totalParticipants: number;
    verifiedEntries: number;
    pendingVerification: number;
  };
  campaignStats: Array<{
    id: string;
    title: string;
    entries: number;
    participants: number;
    verificationRate: number;
    isActive: boolean;
    winnerSelected: boolean;
    createdAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'submission' | 'verification' | 'winner_selection' | 'campaign_created';
    message: string;
    timestamp: string;
    campaignId?: string;
    campaignTitle?: string;
  }>;
  lastUpdated: string;
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchStats();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/stats?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Platform Statistics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.overview.totalCampaigns}</div>
          <div className="text-sm text-blue-800">Total Campaigns</div>
          <div className="text-xs text-blue-600 mt-1">
            {stats.overview.activeCampaigns} active
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.overview.totalEntries}</div>
          <div className="text-sm text-green-800">Total Entries</div>
          <div className="text-xs text-green-600 mt-1">
            {stats.overview.verifiedEntries} verified
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.overview.totalParticipants}</div>
          <div className="text-sm text-purple-800">Participants</div>
          <div className="text-xs text-purple-600 mt-1">
            Unique users
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.overview.pendingVerification}</div>
          <div className="text-sm text-orange-800">Pending</div>
          <div className="text-xs text-orange-600 mt-1">
            Need verification
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Campaign</th>
                <th className="text-left py-2">Status</th>
                <th className="text-right py-2">Entries</th>
                <th className="text-right py-2">Participants</th>
                <th className="text-right py-2">Verification Rate</th>
                <th className="text-left py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.campaignStats.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{campaign.title}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.winnerSelected 
                        ? 'bg-purple-100 text-purple-800' 
                        : campaign.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.winnerSelected ? 'Completed' : campaign.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium">{campaign.entries}</td>
                  <td className="py-3 text-right">{campaign.participants}</td>
                  <td className="py-3 text-right">
                    <span className={`font-medium ${
                      campaign.verificationRate >= 80 ? 'text-green-600' :
                      campaign.verificationRate >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {campaign.verificationRate}%
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'winner_selection' ? 'bg-purple-500' :
                activity.type === 'verification' ? 'bg-green-500' :
                activity.type === 'submission' ? 'bg-blue-500' :
                'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.message}</p>
                {activity.campaignTitle && (
                  <p className="text-xs text-gray-500">Campaign: {activity.campaignTitle}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(stats.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}