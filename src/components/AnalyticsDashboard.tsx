'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Users, Trophy, TrendingUp, Calendar, Eye } from 'lucide-react'

interface CampaignStats {
  id: string
  title: string
  totalEntries: number
  uniqueParticipants: number
  conversionRate: number
  startDate: Date
  endDate: Date
  status: 'active' | 'ended' | 'upcoming'
  views: number
}

interface AnalyticsDashboardProps {
  onBackAction: () => void
}

export default function AnalyticsDashboard({ onBackAction }: AnalyticsDashboardProps) {
  const [campaigns, setCampaigns] = useState<CampaignStats[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics?period=30d')
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      
      const data = await response.json()
      
      // Transform the API response to match our CampaignStats interface
      const transformedCampaigns: CampaignStats[] = data.campaigns.map((campaign: any) => ({
        id: campaign.id,
        title: campaign.title,
        totalEntries: campaign.totalEntries,
        uniqueParticipants: campaign.uniqueParticipants,
        conversionRate: Math.round(campaign.conversionRate * 100) / 100,
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
        status: campaign.status as 'active' | 'ended',
        views: campaign.views
      }))
      
      setCampaigns(transformedCampaigns)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      // Fallback to empty array on error
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  const totalStats = campaigns.reduce((acc, campaign) => ({
    totalEntries: acc.totalEntries + campaign.totalEntries,
    uniqueParticipants: acc.uniqueParticipants + campaign.uniqueParticipants,
    totalViews: acc.totalViews + campaign.views,
    avgConversion: acc.avgConversion + campaign.conversionRate
  }), { totalEntries: 0, uniqueParticipants: 0, totalViews: 0, avgConversion: 0 })

  totalStats.avgConversion = campaigns.length > 0 ? totalStats.avgConversion / campaigns.length : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white font-mono text-sm">LOADING ANALYTICS...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBackAction}
            className="border border-white/30 px-4 py-2 font-mono text-sm hover:bg-white hover:text-black transition-all duration-300 mb-4"
          >
            ← BACK
          </button>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
            ANALYTICS DASHBOARD
          </h1>
          <p className="text-gray-400 font-light mt-2">Campaign performance overview</p>
        </div>
        
        {/* Period selector */}
        <div className="flex border border-white/30">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 font-mono text-sm transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-white text-black'
                  : 'hover:bg-white/10'
              }`}
            >
              {period.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6" />
            <span className="text-2xl font-black">{totalStats.totalEntries.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-400 font-mono">TOTAL ENTRIES</p>
        </div>

        <div className="border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-6 h-6" />
            <span className="text-2xl font-black">{totalStats.uniqueParticipants.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-400 font-mono">UNIQUE PARTICIPANTS</p>
        </div>

        <div className="border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-6 h-6" />
            <span className="text-2xl font-black">{totalStats.totalViews.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-400 font-mono">TOTAL VIEWS</p>
        </div>

        <div className="border border-white/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6" />
            <span className="text-2xl font-black">{totalStats.avgConversion.toFixed(1)}%</span>
          </div>
          <p className="text-sm text-gray-400 font-mono">AVG CONVERSION</p>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="border border-white/30">
        <div className="p-6 border-b border-white/30">
          <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            CAMPAIGN PERFORMANCE
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left p-4 font-mono text-sm">CAMPAIGN</th>
                <th className="text-left p-4 font-mono text-sm">STATUS</th>
                <th className="text-left p-4 font-mono text-sm">ENTRIES</th>
                <th className="text-left p-4 font-mono text-sm">PARTICIPANTS</th>
                <th className="text-left p-4 font-mono text-sm">VIEWS</th>
                <th className="text-left p-4 font-mono text-sm">CONVERSION</th>
                <th className="text-left p-4 font-mono text-sm">PERIOD</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-black">{campaign.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-mono border ${
                      campaign.status === 'active' 
                        ? 'border-green-500 text-green-500' 
                        : campaign.status === 'ended'
                        ? 'border-red-500 text-red-500'
                        : 'border-yellow-500 text-yellow-500'
                    }`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{campaign.totalEntries.toLocaleString()}</td>
                  <td className="p-4 font-mono">{campaign.uniqueParticipants.toLocaleString()}</td>
                  <td className="p-4 font-mono">{campaign.views.toLocaleString()}</td>
                  <td className="p-4 font-mono">{campaign.conversionRate.toFixed(1)}%</td>
                  <td className="p-4 font-mono text-sm text-gray-400">
                    {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-8 border border-white/30 p-6">
        <h3 className="text-lg font-black tracking-tighter mb-4">ENGAGEMENT TRENDS</h3>
        <div className="h-64 flex items-center justify-center border border-white/10">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 font-mono text-sm">CHART VISUALIZATION</p>
            <p className="text-gray-500 font-mono text-xs mt-2">Coming soon with real-time data</p>
          </div>
        </div>
      </div>
    </div>
  )
}