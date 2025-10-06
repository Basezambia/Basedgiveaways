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
  winners?: Winner[]
}

export default function ResultsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchResults()
  }, [])

  const toggleCampaignExpansion = (campaignId: string) => {
    setExpandedCampaigns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId)
      } else {
        newSet.add(campaignId)
      }
      return newSet
    })
  }

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
      
      // Set specific winners for Travis Scott campaign
      const travisScottWinners = [
        {
          id: 'winner-1',
          name: 'Pericles Komey',
          email: 'pericles@example.com',
          walletAddress: '0xBaA724E5579DAd9Cd2a35cD6b68C4ACeeCd61f5e',
          entryCount: 1,
          selectionHash: '0x7a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
          selectedAt: '2025-10-03T08:15:42.978607+00:00',
          campaignId: '',
          campaignTitle: ''
        },
        {
          id: 'winner-2',
          name: 'Sanelisiwe',
          email: 'sanelisiwe@example.com',
          walletAddress: '0xd8922a5265120Cd66e704a6cAD810e40F8019d01',
          entryCount: 1,
          selectionHash: '0x8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
          selectedAt: '2025-10-03T07:22:35.096101+00:00',
          campaignId: '',
          campaignTitle: ''
        }
      ]

      const campaignsWithWinners = campaignsData.campaigns.map((campaign: any) => {
        // Check if this is the Travis Scott campaign
        const isTravisScott = campaign.title.toLowerCase().includes('travis') || 
                             campaign.title.toLowerCase().includes('scott')
        
        if (isTravisScott) {
          // Set Travis Scott campaign as having winners
          return {
            ...campaign,
            winnerSelected: true,
            winners: travisScottWinners.map(winner => ({
              ...winner,
              campaignId: campaign.id,
              campaignTitle: campaign.title
            }))
          }
        }
        
        return {
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
        }
      })
      
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

  const campaignsWithWinners = campaigns.filter(campaign => 
    campaign.winnerSelected && (campaign.winner || (campaign.winners && campaign.winners.length > 0))
  )
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
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black font-mono tracking-tighter">
            RESULTS
          </h1>
          <p className="text-gray-400 font-mono text-xs mt-2">
            CAMPAIGN WINNERS & STATUS
          </p>
        </div>

        {/* Winners Section */}
        {campaignsWithWinners.length > 0 && (
          <div className="mb-8">
            
            <div className="space-y-4">
              {campaignsWithWinners.map((campaign) => {
                const isExpanded = expandedCampaigns.has(campaign.id)
                
                return (
                  <div key={campaign.id} className="border border-white/30 bg-white/5">
                    {/* Campaign Header - Clickable */}
                    <div 
                      className="border-b border-white/30 bg-white/10 p-3 cursor-pointer hover:bg-white/15 transition-colors duration-200"
                      onClick={() => toggleCampaignExpansion(campaign.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black font-mono">
                          {campaign.title} CAMPAIGN
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="text-green-400 font-mono text-xs font-bold">
                            WINNER SELECTED
                          </div>
                          <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Winner Details - Collapsible */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      {campaign.winners && campaign.winners.length > 0 ? (
                        // Multiple winners (Travis Scott campaign)
                        <div className="p-4">
                          <div className="text-center mb-4">
                            <div className="text-yellow-400 font-mono text-sm font-bold mb-1">
                              🎉 MULTIPLE WINNERS SELECTED! 🎉
                            </div>
                            <div className="text-gray-400 font-mono text-xs">
                              {campaign.winners.length} winners have been selected for this campaign
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {campaign.winners.map((winner, index) => (
                              <div key={winner.id} className="border border-white/20 bg-white/5 p-3">
                                <div className="text-center mb-3">
                                  <div className="text-yellow-400 font-mono text-xs font-bold">
                                    WINNER #{index + 1}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                                  <div className="text-center md:text-left">
                                    <div className="text-gray-400 font-mono text-xs mb-1">NAME</div>
                                    <div className="font-mono text-sm font-bold">{winner.name}</div>
                                  </div>
                                  
                                  <div className="text-center md:text-left">
                                    <div className="text-gray-400 font-mono text-xs mb-1">WALLET</div>
                                    <div className="font-mono text-xs">{formatWalletAddress(winner.walletAddress)}</div>
                                  </div>
                                  
                                  <div className="text-center md:text-left">
                                    <div className="text-gray-400 font-mono text-xs mb-1">ENTRIES</div>
                                    <div className="font-mono text-xs font-bold">{winner.entryCount}</div>
                                  </div>
                                  
                                  <div className="text-center md:text-left">
                                    <div className="text-gray-400 font-mono text-xs mb-1">CREATED</div>
                                    <div className="font-mono text-xs">{formatDate(winner.selectedAt)}</div>
                                  </div>
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-white/20">
                                  <div className="text-xs font-mono text-gray-400">
                                    <span className="text-white">SELECTION HASH:</span> {winner.selectionHash.slice(0, 16)}...
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : campaign.winner ? (
                        // Single winner (other campaigns)
                        <div className="p-4">
                          <div className="text-center mb-4">
                            <div className="text-yellow-400 font-mono text-sm font-bold mb-1">
                              🎉 WINNER SELECTED! 🎉
                            </div>
                            <div className="text-gray-400 font-mono text-xs">
                              1 winner has been selected for this campaign
                            </div>
                          </div>
                          
                          <div className="border border-white/20 bg-white/5 p-3">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                              <div className="text-center md:text-left">
                                <div className="text-gray-400 font-mono text-xs mb-1">NAME</div>
                                <div className="font-mono text-sm font-bold">{campaign.winner.name}</div>
                              </div>
                              
                              <div className="text-center md:text-left">
                                <div className="text-gray-400 font-mono text-xs mb-1">WALLET</div>
                                <div className="font-mono text-xs">{formatWalletAddress(campaign.winner.walletAddress)}</div>
                              </div>
                              
                              <div className="text-center md:text-left">
                                <div className="text-gray-400 font-mono text-xs mb-1">ENTRIES</div>
                                <div className="font-mono text-xs font-bold">{campaign.winner.entryCount}</div>
                              </div>
                              
                              <div className="text-center md:text-left">
                                <div className="text-gray-400 font-mono text-xs mb-1">CREATED</div>
                                <div className="font-mono text-xs">{formatDate(campaign.winner.selectedAt)}</div>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-white/20">
                              <div className="text-xs font-mono text-gray-400">
                                <span className="text-white">SELECTION HASH:</span> {campaign.winner.selectionHash.slice(0, 16)}...
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Pending Campaigns Section */}
        {campaignsWithoutWinners.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-black font-mono mb-4 text-center">
              ⏳ PENDING CAMPAIGNS
            </h2>
            
            <div className="space-y-3">
              {campaignsWithoutWinners.map((campaign) => (
                <div key={campaign.id} className="border border-white/30 bg-white/5">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black font-mono">
                        {campaign.title} CAMPAIGN
                      </h3>
                      <div className="text-gray-400 font-mono text-xs mt-1">
                        Status: {campaign.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                    <div className="text-orange-400 font-mono text-xs font-bold">
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