'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LeaderboardEntry {
  position: number
  id: string
  name: string
  walletAddress: string
  entryCount: number
  isVerified: boolean
  submissionDate: string
  campaignTitle: string
  campaignId: string
  maskedEmail: string
}

interface LeaderboardStats {
  totalParticipants: number
  totalEntries: number
  verifiedParticipants: number
  averageEntries: number
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  stats: LeaderboardStats
  meta: {
    total: number
    page: number
    limit: number
  }
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/leaderboard')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="font-mono text-sm">LOADING...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4 font-mono">ERROR LOADING LEADERBOARD</div>
          <div className="text-gray-400 mb-4 font-mono text-sm">{error}</div>
          <button 
            onClick={fetchLeaderboard}
            className="border border-white/30 px-4 py-2 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Brutalist background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Terms & Conditions link - bottom left */}
      <div className="fixed bottom-4 left-4 z-20">
        <Link
          href="/terms"
          className="border border-white/30 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300"
        >
          T&Cs
        </Link>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="border border-white/30 px-2 sm:px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300">
                ← BACK
              </button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/results">
              <button className="border border-white/30 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300">
                RESULTS
              </button>
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black font-mono tracking-tighter">
            LEADERBOARD
          </h1>
        </div>

        {/* Leaderboard Table */}
        <div className="border border-white/30 max-w-4xl mx-auto">
          {/* Table Header */}
          <div className="border-b border-white/30 bg-white/5">
            <div className="grid grid-cols-4 gap-4 p-3 font-mono text-xs font-bold">
              <div className="text-center">RANK</div>
              <div className="text-center">PARTICIPANT</div>
              <div className="text-center">WALLET</div>
              <div className="text-center">ENTRIES</div>
            </div>
          </div>

          {/* Table Body */}
          <div className={data?.leaderboard && data.leaderboard.length > 5 ? "max-h-80 overflow-y-auto" : ""}>
            {data?.leaderboard && data.leaderboard.length > 0 ? (
              data.leaderboard.map((entry) => (
                <div
                  key={entry.id}
                  className={`grid grid-cols-4 gap-4 p-3 border-b border-white/10 hover:bg-white/5 transition-colors ${
                    entry.position <= 3 ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="font-mono text-sm font-bold text-center">
                    #{entry.position}
                  </div>
                  
                  <div className="text-center">
                    <div className="font-mono text-sm font-bold">{entry.name}</div>
                    {entry.isVerified && (
                      <div className="text-xs text-green-400 font-mono mt-1">VERIFIED</div>
                    )}
                  </div>
                  
                  <div className="font-mono text-xs text-gray-400 text-center">
                    {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                  </div>
                  
                  <div className="text-center">
                    <div className="font-mono text-base font-bold">
                      {entry.entryCount}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center font-mono text-sm text-gray-400">
                NO PARTICIPANTS YET
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}