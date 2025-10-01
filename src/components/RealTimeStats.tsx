'use client'

import { useState, useEffect } from 'react'
import { Users, Trophy, Clock, TrendingUp } from 'lucide-react'

interface StatsData {
  totalSubmissions: number
  verifiedSubmissions: number
  totalParticipants: number
  campaignStatus: 'active' | 'ended'
  timeRemaining?: string
}

interface RealTimeStatsProps {
  campaignId: string
}

export default function RealTimeStats({ campaignId }: RealTimeStatsProps) {
  const [stats, setStats] = useState<StatsData>({
    totalSubmissions: 0,
    verifiedSubmissions: 0,
    totalParticipants: 0,
    campaignStatus: 'active'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    
    // Poll for updates every 15 seconds
    const pollInterval = setInterval(fetchStats, 15000)

    return () => {
      clearInterval(pollInterval)
    }
  }, [campaignId])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/stats?campaignId=${campaignId}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="mr-2 h-5 w-5" />
        Real-Time Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-blue-600">{stats.totalSubmissions}</div>
          <div className="text-sm text-gray-500">Total Submissions</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Trophy className="mx-auto h-8 w-8 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-green-600">{stats.verifiedSubmissions}</div>
          <div className="text-sm text-gray-500">Verified</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Users className="mx-auto h-8 w-8 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-purple-600">{stats.totalParticipants}</div>
          <div className="text-sm text-gray-500">Participants</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <Clock className="mx-auto h-8 w-8 text-orange-600 mb-2" />
          <div className={`text-2xl font-bold ${stats.campaignStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
            {stats.campaignStatus === 'active' ? 'LIVE' : 'ENDED'}
          </div>
          <div className="text-sm text-gray-500">Status</div>
        </div>
      </div>

      {stats.timeRemaining && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Time Remaining:</span>
            <span className="text-lg font-bold text-orange-600">{stats.timeRemaining}</span>
          </div>
        </div>
      )}
    </div>
  )
}