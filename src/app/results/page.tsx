'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Winner {
  id: string
  name: string
  email: string
  walletAddress: string
  tweetUrl?: string
  entryCount: number
  selectionHash: string
  selectedAt: string
  campaignId: string
  campaignTitle: string
}

interface Campaign {
  id: string
  title: string
  isActive: boolean
  winnerSelected: boolean
  winner?: Winner
}

export default function ResultsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch campaigns
      const campaignsResponse = await fetch('/api/campaigns')
      if (!campaignsResponse.ok) {
        throw new Error(`Failed to fetch campaigns: ${campaignsResponse.status}`)
      }
      const campaignsData = await campaignsResponse.json()
      
      // For now, we'll show mock winners since the actual winner selection hasn't been implemented yet
      // In production, this would fetch actual winners from the database
      const campaignsWithWinners = campaignsData.campaigns.map((campaign: any) => ({
        ...campaign,
        winner: campaign.winnerSelected ? {
          id: 'mock-winner-id',
          name: 'John Doe',
          email: 'john@example.com',
          walletAddress: '0xbad...frt5e',
          entryCount: 1,
          selectionHash: '0x123...abc',
          selectedAt: new Date().toISOString(),
          campaignId: campaign.id,
          campaignTitle: campaign.title
        } : null
      }))
      
      setCampaigns(campaignsWithWinners)
    } catch (err) {
      console.error('Error fetching results:', err)
      setError(err instanceof Error ? err.message : 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatWalletAddress = (address: string) => {
    if (address.length < 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="font-mono text-sm">LOADING RESULTS...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4 font-mono">ERROR LOADING RESULTS</div>
          <div className="text-gray-400 mb-4 font-mono text-sm">{error}</div>
          <button 
            onClick={fetchResults}
            className="border border-white/30 px-4 py-2 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    )
  }

  const campaignsWithWinners = campaigns.filter(campaign => campaign.winnerSelected && campaign.winner)
  const campaignsWithoutWinners = campaigns.filter(campaign => !campaign.winnerSelected)

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
            <Link href="/leaderboard">
              <button className="border border-white/30 px-2 sm:px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300">
                ← BACK
              </button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="border border-white/30 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300">
                HOME
              </button>
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black font-mono tracking-tighter">
            RESULTS
          </h1>
          <p className="text-gray-400 font-mono text-sm mt-4">
            CAMPAIGN WINNERS & STATUS
          </p>
        </div>

        {/* Winners Section */}
        {campaignsWithWinners.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-black font-mono mb-6 text-center">
              🏆 WINNERS ANNOUNCED
            </h2>
            
            <div className="space-y-6">
              {campaignsWithWinners.map((campaign) => (
                <div key={campaign.id} className="border border-white/30 bg-white/5">
                  {/* Campaign Header */}
                  <div className="border-b border-white/30 bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black font-mono">
                        {campaign.title} CAMPAIGN
                      </h3>
                      <div className="text-green-400 font-mono text-xs font-bold">
                        WINNER SELECTED
                      </div>
                    </div>
                  </div>
                  
                  {/* Winner Details */}
                  {campaign.winner && (
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="text-center md:text-left">
                          <div className="text-gray-400 font-mono text-xs mb-1">WINNER</div>
                          <div className="font-mono text-lg font-bold">{campaign.winner.name}</div>
                        </div>
                        
                        <div className="text-center md:text-left">
                          <div className="text-gray-400 font-mono text-xs mb-1">WALLET</div>
                          <div className="font-mono text-sm">{formatWalletAddress(campaign.winner.walletAddress)}</div>
                        </div>
                        
                        <div className="text-center md:text-left">
                          <div className="text-gray-400 font-mono text-xs mb-1">CAMPAIGN</div>
                          <div className="font-mono text-sm font-bold">{campaign.title}</div>
                        </div>
                        
                        <div className="text-center md:text-left">
                          <div className="text-gray-400 font-mono text-xs mb-1">ENTRIES</div>
                          <div className="font-mono text-sm font-bold">{campaign.winner.entryCount}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-gray-400">
                          <div>
                            <span className="text-white">SELECTED:</span> {formatDate(campaign.winner.selectedAt)}
                          </div>
                          <div>
                            <span className="text-white">HASH:</span> {campaign.winner.selectionHash.slice(0, 16)}...
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Campaigns Section */}
        {campaignsWithoutWinners.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-black font-mono mb-6 text-center">
              ⏳ PENDING CAMPAIGNS
            </h2>
            
            <div className="space-y-4">
              {campaignsWithoutWinners.map((campaign) => (
                <div key={campaign.id} className="border border-white/30 bg-white/5">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black font-mono">
                        {campaign.title} CAMPAIGN
                      </h3>
                      <div className="text-gray-400 font-mono text-xs mt-1">
                        Status: {campaign.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                    <div className="text-yellow-400 font-mono text-xs font-bold">
                      NO WINNER YET
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="font-mono text-lg text-gray-400 mb-4">
              NO CAMPAIGNS FOUND
            </div>
            <Link href="/">
              <button className="border border-white/30 px-4 py-2 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300">
                GO TO CAMPAIGNS
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}