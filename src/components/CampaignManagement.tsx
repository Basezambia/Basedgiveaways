'use client';

import { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rules: string;
  isActive: boolean;
  endTime: string | null;
  winnerSelected: boolean;
  winnerHash: string | null;
  createdAt: string;
  updatedAt: string;
  eventDate?: string | null;
  location?: string | null;
  artist?: string | null;
  _count: {
    submissions: number;
  };
}

interface CampaignManagementProps {
  onNotificationAction: (type: 'info' | 'success' | 'warning' | 'error', message: string) => void;
}

export default function CampaignManagement({ onNotificationAction }: CampaignManagementProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [blockHash, setBlockHash] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      } else {
        onNotificationAction('error', 'Failed to fetch campaigns');
      }
    } catch (error) {
      onNotificationAction('error', 'Network error while fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  const toggleCampaignStatus = async (campaignId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        await fetchCampaigns();
        onNotificationAction('success', `Campaign ${!isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        onNotificationAction('error', 'Failed to update campaign status');
      }
    } catch (error) {
      onNotificationAction('error', 'Network error while updating campaign');
    }
  };

  const selectWinner = async () => {
    if (!selectedCampaign || !blockHash.trim()) {
      onNotificationAction('error', 'Please provide a valid blockchain hash');
      return;
    }

    try {
      const response = await fetch('/api/winner/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          blockHash: blockHash.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
         await fetchCampaigns();
         onNotificationAction('success', `Winner selected: ${data.winner.name} (${data.winner.walletAddress})`);
         setShowWinnerModal(false);
         setSelectedCampaign(null);
         setBlockHash('');
       } else {
         onNotificationAction('error', data.error || 'Failed to select winner');
       }
     } catch (error) {
       onNotificationAction('error', 'Network error while selecting winner');
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
         await fetchCampaigns();
         onNotificationAction('success', 'Campaign deleted successfully');
       } else {
         onNotificationAction('error', 'Failed to delete campaign');
       }
     } catch (error) {
       onNotificationAction('error', 'Network error while deleting campaign');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Campaign Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-500 mb-4">Create your first campaign to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg truncate">{campaign.title}</h3>
                  <div className="flex items-center space-x-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.winnerSelected 
                        ? 'bg-purple-100 text-purple-800' 
                        : campaign.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.winnerSelected ? 'Completed' : campaign.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.description}</p>

                {/* Event Details */}
                {(campaign.eventDate || campaign.location || campaign.artist) && (
                  <div className="bg-gray-50 p-3 rounded-md mb-3 text-sm">
                    <div className="font-medium text-gray-700 mb-2">Event Details:</div>
                    <div className="space-y-1 text-gray-600">
                      {campaign.eventDate && (
                        <div>📅 {new Date(campaign.eventDate).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</div>
                      )}
                      {campaign.location && <div>📍 {campaign.location}</div>}
                      {campaign.artist && <div>🎤 {campaign.artist}</div>}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{campaign._count.submissions} entries</span>
                  <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleCampaignStatus(campaign.id, campaign.isActive)}
                    disabled={campaign.winnerSelected}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      campaign.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {campaign.isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  {!campaign.winnerSelected && campaign.isActive && (
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowWinnerModal(true);
                      }}
                      className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors"
                    >
                      Select Winner
                    </button>
                  )}

                  <button
                    onClick={() => deleteCampaign(campaign.id)}
                    className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Winner Selection Modal */}
      {showWinnerModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Select Winner for {selectedCampaign.title}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blockchain Hash (for cryptographic randomness)
              </label>
              <input
                type="text"
                value={blockHash}
                onChange={(e) => setBlockHash(e.target.value)}
                placeholder="Enter latest block hash from blockchain"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a recent block hash from Ethereum, Bitcoin, or any blockchain for provably fair selection
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowWinnerModal(false);
                  setSelectedCampaign(null);
                  setBlockHash('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={selectWinner}
                disabled={!blockHash.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select Winner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Campaign</h3>
            <p className="text-gray-500 mb-4">Campaign creation form coming soon...</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}