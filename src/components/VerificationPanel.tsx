'use client';

import { useState, useEffect } from 'react';

interface Submission {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  entryCount: number;
  isVerified: boolean;
  createdAt: string;
  campaign: {
    id: string;
    title: string;
  };
}

interface VerificationPanelProps {
  token: string;
}

export default function VerificationPanel({ token }: VerificationPanelProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [campaigns, setCampaigns] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    fetchSubmissions();
    fetchCampaigns();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchSubmissions();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchSubmissions();
    fetchCampaigns();
  }, [selectedCampaign]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const url = selectedCampaign === 'all' 
        ? '/api/admin/submissions'
        : `/api/admin/submissions?campaignId=${selectedCampaign}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const handleVerify = async (submissionId: string, verify: boolean) => {
    try {
      setVerifying(submissionId);
      
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          submissionId,
          isVerified: verify
        })
      });

      if (response.ok) {
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === submissionId 
              ? { ...sub, isVerified: verify }
              : sub
          )
        );
      }
    } catch (error) {
      console.error('Failed to verify submission:', error);
    } finally {
      setVerifying(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const pendingSubmissions = submissions.filter(sub => !sub.isVerified);
  const verifiedSubmissions = submissions.filter(sub => sub.isVerified);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Pending: {pendingSubmissions.length}</span>
          <span>Verified: {verifiedSubmissions.length}</span>
          <span>Total: {submissions.length}</span>
        </div>
      </div>

      {/* Pending Submissions */}
      {pendingSubmissions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Verification ({pendingSubmissions.length})
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-yellow-200">
                  {pendingSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-yellow-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.email}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {submission.walletAddress.slice(0, 8)}...{submission.walletAddress.slice(-6)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.campaign.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.entryCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleVerify(submission.id, true)}
                          disabled={verifying === submission.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {verifying === submission.id ? 'Verifying...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleVerify(submission.id, false)}
                          disabled={verifying === submission.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Verified Submissions */}
      {verifiedSubmissions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Verified Submissions ({verifiedSubmissions.length})
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {verifiedSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.email}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {submission.walletAddress.slice(0, 8)}...{submission.walletAddress.slice(-6)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.campaign.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.entryCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {submissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No submissions found for the selected campaign.
        </div>
      )}
    </div>
  );
}