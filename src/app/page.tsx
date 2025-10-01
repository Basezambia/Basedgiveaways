'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import CampaignCarousel from '@/components/CampaignCarousel'
import CampaignDetail from '@/components/CampaignDetail'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import AdminAuth from '@/components/AdminAuth'
import AdminPanel from '@/components/AdminPanel'
import { MiniKitProvider } from '@/components/MiniKitProvider'
import { WalletProvider } from '@/components/WalletProvider'
import { WalletButton } from '@/components/WalletButton'
import { minikitConfig } from '../../minikit.config'

interface Campaign {
  id: string
  title: string
  description: string
  imageUrl: string
  prizeAmount?: string
  endDate?: string
  isActive?: boolean
  winnerSelected?: boolean
  requirements?: string[]
  submissionCount?: number
  participantCount?: number
  rules?: string
  endTime?: Date
  eventDate?: Date
  location?: string
  artist?: string
}

type View = 'carousel' | 'detail' | 'analytics' | 'admin'

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [view, setView] = useState<View>('carousel')
  const [loading, setLoading] = useState(true)
  const { address, isConnected } = useAccount()

  // Check if connected wallet is admin
  const isAdmin = isConnected && address && 
    minikitConfig.baseBuilder.allowedAddresses.includes(address.toLowerCase() as typeof minikitConfig.baseBuilder.allowedAddresses[0])

  useEffect(() => {
    // Warm up API routes to prevent 404 errors on first requests
    const warmupAPI = async () => {
      try {
        await fetch('/api/warmup')
        // Trigger compilation of submit endpoint without actually submitting
        await fetch('/api/submit', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ warmup: true })
        }).catch(() => {}) // This will fail but trigger compilation
      } catch (error) {
        console.log('API warmup completed')
      }
    }
    
    warmupAPI()
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      if (response.ok) {
        const data = await response.json()
        // Transform the API response to match the expected Campaign interface
        const transformedCampaigns: Campaign[] = data.campaigns.map((campaign: any) => ({
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          imageUrl: campaign.imageUrl || '/campaign1.png', // fallback image
          rules: campaign.rules,
          endTime: campaign.endTime ? new Date(campaign.endTime) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          eventDate: campaign.eventDate ? new Date(campaign.eventDate) : new Date(),
          location: campaign.location || 'TBD',
          artist: campaign.artist || campaign.title
        }))
        setCampaigns(transformedCampaigns)
      } else {
        console.error('Failed to fetch campaigns:', response.status)
        // Fallback to empty array if API fails
        setCampaigns([])
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
      // Fallback to empty array if API fails
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setView('detail')
  }

  const handleBack = () => {
    setView('carousel')
    setSelectedCampaign(null)
  }

  const handleSubmit = async (data: { name: string; email: string; walletAddress: string; tweetUrl: string }) => {
    if (!selectedCampaign) return

    try {
      // Add a small delay to ensure API route is compiled
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          campaignId: selectedCampaign.id
        }),
      })

      if (response.ok) {
        // Show success message or redirect back to carousel
        alert('Submission successful! Thank you for participating.')
        setView('carousel')
        setSelectedCampaign(null)
      } else {
        const errorData = await response.json()
        console.error('Submission failed:', response.status, errorData)
        
        // Display specific error messages
        if (response.status === 409) {
          alert(errorData.message || 'You have already entered this campaign with this wallet address.')
        } else if (response.status === 400) {
          alert(errorData.error || 'Invalid submission data. Please check your entries.')
        } else if (response.status === 404) {
          alert('Campaign not found. Please try again.')
        } else {
          alert(errorData.error || 'Submission failed. Please try again.')
        }
        return
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Submission failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white font-mono text-sm">LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Brutalist background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {view === 'carousel' && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          {/* Wallet connection button - top right on desktop, above title on mobile */}
          <div className="hidden sm:flex absolute top-4 right-4 z-20 gap-2">
            <a
              href="/leaderboard"
              className="border border-white/30 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300"
            >
              LEADERBOARD
            </a>
            {isAdmin && (
              <button
                onClick={() => setView('admin')}
                className="border border-white/30 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300"
              >
                ADMIN
              </button>
            )}
            <WalletButton />
          </div>

          {/* Mobile wallet button - above title */}
          <div className="flex sm:hidden w-full justify-center mb-6 gap-2">
            <a
              href="/leaderboard"
              className="border border-white/30 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300"
            >
              LEADERBOARD
            </a>
            {isAdmin && (
              <button
                onClick={() => setView('admin')}
                className="border border-white/30 px-3 py-1 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300"
              >
                ADMIN
              </button>
            )}
            <WalletButton />
          </div>

          {/* Floating header - consistent spacing across all screen sizes */}
          <div className="mb-6 text-center animate-float px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-3">
              BASED
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-light text-gray-400 tracking-wide">
              GIVE AWAYS
            </p>
          </div>
          
          {/* Floating carousel with consistent spacing */}
          <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl transform hover:scale-[1.02] transition-transform duration-700 animate-float mb-6">
            <CampaignCarousel
              campaigns={campaigns}
              onCampaignSelectAction={handleCampaignSelect}
            />
          </div>

          {/* Brutalist footer - consistent positioning */}
          <div className="mt-auto mb-6 text-center">
            <div className="inline-block border border-white/20 px-6 py-2">
              <p className="text-xs font-mono text-gray-500">SCROLL TO EXPLORE</p>
            </div>
          </div>
        </div>
      )}

      {view === 'detail' && selectedCampaign && (
        <CampaignDetail
          campaign={selectedCampaign}
          onBackAction={handleBack}
          onSubmitAction={handleSubmit}
        />
      )}

      {view === 'analytics' && (
        <AnalyticsDashboard
          onBackAction={() => setView('carousel')}
        />
      )}

      {view === 'admin' && (
        <AdminPanel onBackAction={() => setView('carousel')} />
      )}
    </div>
  )
}