'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, Twitter, ExternalLink, AlertCircle } from 'lucide-react'
import { useAccount } from 'wagmi'
import { WalletButton } from './WalletButton'
import SocialShare from './SocialShare'
import EmailNotifications, { useEmailNotifications } from './EmailNotifications'

interface Campaign {
  id: string
  title: string
  description: string
  imageUrl: string
  rules?: string
  endTime?: Date
  eventDate?: Date
  location?: string
  artist?: string
}

interface CampaignDetailProps {
  campaign: Campaign
  onBackAction: () => void
  onSubmitAction: (data: { name: string; email: string; walletAddress: string; tweetUrl: string }) => void
}

export default function CampaignDetail({ campaign, onBackAction, onSubmitAction }: CampaignDetailProps) {
  const { address, isConnected } = useAccount()
  const [showCompactView, setShowCompactView] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    walletAddress: address || '',
    tweetUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { notifications, sendParticipantConfirmation } = useEmailNotifications()

  // Update wallet address when connection changes
  useEffect(() => {
    if (address && isConnected) {
      setFormData(prev => ({ ...prev, walletAddress: address }))
    }
  }, [address, isConnected])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.walletAddress || !formData.tweetUrl) {
      return
    }
    
    if (!formData.tweetUrl.includes('twitter.com') && !formData.tweetUrl.includes('x.com')) {
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmitAction(formData)
      
      // Send confirmation email to participant
      sendParticipantConfirmation(formData.email, campaign.title)
      
      setFormData({ name: '', email: '', walletAddress: '', tweetUrl: '' })
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateTweetText = () => {
    const tags = campaign.rules?.match(/@[\w]+/g) || ['@basezambia', '@basesoutheraf', '@base', '@jessepollak']
    const text = `Excited to participate in the ${campaign.title} giveaway! ${tags.join(' ')}`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  }

  const requiredTags = campaign.rules?.match(/@[\w]+/g) || ['@basezambia', '@basesoutheraf', '@base', '@jessepollak']

  const getConcertInfo = () => {
    // First check if campaign has event details from database
    if (campaign.eventDate && campaign.location && campaign.artist) {
      const eventDate = new Date(campaign.eventDate)
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Get specific details based on campaign
      if (campaign.title === 'TRAVIS') {
        return {
          title: "TRAVIS CONCERT INFORMATION",
          date: formattedDate,
          venue: campaign.location,
          description: "Travis Scott's Circus Maximus World Tour will land in South Africa on 11 October 2025 at FNB Stadium in Johannesburg, bringing his high-energy production, visuals, and chart-topping hits to fans as part of a global stadium run. This monumental concert represents Travis Scott's highly anticipated return to South African soil, promising an unforgettable night of music featuring hits from his acclaimed albums including 'Astroworld', 'Rodeo', and 'Utopia'. The show will feature his signature stage design, pyrotechnics, and immersive visual effects that have made his live performances legendary worldwide. Fans can expect to hear chart-toppers like 'SICKO MODE', 'Goosebumps', 'Antidote', and tracks from his latest releases.",
          sources: ["Wikipedia", "Art Moves Culture", "help.ticketmaster.co.za"]
        }
      } else if (campaign.title === 'YE') {
        return {
          title: "YE CONCERT INFORMATION",
          date: formattedDate,
          venue: campaign.location,
          description: "Ye (formerly Kanye West) is slated for a one-night concert in South Africa on 13 December 2025 at Ellis Park Stadium in Johannesburg — billed as his only African stop for the year and a landmark return to the country's live music scene. This highly anticipated event marks Ye's triumphant return to South Africa, promising an extraordinary musical experience featuring his extensive catalog of groundbreaking hits spanning over two decades. Fans can expect to hear iconic tracks from 'The College Dropout', 'Late Registration', 'Graduation', 'My Beautiful Dark Twisted Fantasy', 'Yeezus', 'The Life of Pablo', 'Donda', and his latest releases. Known for his innovative stage productions and thought-provoking performances, this concert represents a historic moment for South African hip-hop and music culture.",
          sources: ["sahiphopmag.co.za", "Joburg ETC", "capetownetc.com"]
        }
      }

      // Generic fallback for other campaigns with database data
      return {
        title: `${campaign.artist} CONCERT INFORMATION`,
        date: formattedDate,
        venue: campaign.location,
        description: `Join us for an incredible concert experience featuring ${campaign.artist}!`,
        sources: ["Official", "Verified"]
      }
    }

    // No event details available
    return null
  }

  const concertInfo = getConcertInfo()

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Brutalist background pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Brutalist back button */}
        <button
          onClick={onBackAction}
          className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20 border border-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 hover:bg-white hover:text-black transition-all duration-300 font-mono text-xs sm:text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
          BACK
        </button>

        {/* Top right buttons - social share and wallet connect */}
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20 flex gap-2">
          <SocialShare 
            campaign={campaign}
            url={`${window.location.origin}?campaign=${campaign.id}`}
          />
          {!isConnected && <WalletButton />}
        </div>

        {/* Poster Section */}
        {!showCompactView && (
          <div className="mt-16 sm:mt-18 md:mt-20 mb-8 sm:mb-12 md:mb-16">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] max-w-4xl mx-auto border-2 border-white overflow-hidden">
              <Image 
                src={campaign.imageUrl} 
                alt={campaign.title}
                fill
                className="object-cover mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-black/70" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-2 sm:mb-4">
                    {campaign.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg font-light opacity-80">
                    WIN A FREE {campaign.title} TICKET
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Concert Information Section */}
        {concertInfo && !showCompactView && (
          <div className="mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto">
            <div className="border border-white p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-4 sm:mb-6 tracking-tighter">{concertInfo.title}</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="border border-white px-2 py-1 sm:px-3 sm:py-1 font-mono text-xs sm:text-sm w-fit">DATE</div>
                  <div className="font-bold text-sm sm:text-base">{concertInfo.date}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="border border-white px-2 py-1 sm:px-3 sm:py-1 font-mono text-xs sm:text-sm w-fit">VENUE</div>
                  <div className="font-bold text-sm sm:text-base">{concertInfo.venue}</div>
                </div>
                
                {/* Event Description */}
                <div className="pt-3 sm:pt-4">
                  <div className="border border-white px-2 py-1 sm:px-3 sm:py-1 font-mono text-xs sm:text-sm w-fit mb-3">EVENT DETAILS</div>
                  <div className="text-sm sm:text-base leading-relaxed opacity-90 text-justify">
                    {concertInfo.description}
                  </div>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-white/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="text-xs font-mono opacity-60">SOURCES:</div>
                      <div className="flex flex-wrap gap-2">
                        {concertInfo.sources.map((source, index) => (
                          <span key={index} className="border border-white/30 px-2 py-1 text-xs font-mono opacity-70">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Submit Button - only show when wallet is connected */}
                    {isConnected && (
                      <button
                        onClick={() => setShowCompactView(true)}
                        className="border border-white px-4 py-2 sm:px-6 sm:py-2 font-mono text-xs hover:bg-white hover:text-black transition-all duration-300 w-fit"
                      >
                        SUBMIT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Protocol and Entry sections - only show when submit is clicked */}
        {isConnected && showCompactView && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mt-12 lg:mt-20">
            {/* Brutalist rules section */}
            <div className="space-y-8">
              <div className="border border-white p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 tracking-tighter">PROTOCOL</h2>
                <div className="space-y-4 sm:space-y-6 flex-1">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="border border-white px-2 sm:px-3 py-1 font-mono text-xs sm:text-sm">01</div>
                    <div>
                      <h3 className="font-bold mb-1 text-sm sm:text-base">CREATE TWEET</h3>
                      <p className="text-xs sm:text-sm opacity-70">Generate tweet with required tags</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="border border-white px-2 sm:px-3 py-1 font-mono text-xs sm:text-sm">02</div>
                    <div>
                      <h3 className="font-bold mb-1 text-sm sm:text-base">MANDATORY TAGS</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {requiredTags.map((tag) => (
                          <span key={tag} className="border border-red-500 px-2 py-1 text-xs font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="border border-white px-2 sm:px-3 py-1 font-mono text-xs sm:text-sm">03</div>
                    <div>
                      <h3 className="font-bold mb-1 text-sm sm:text-base">COPY URL</h3>
                      <p className="text-xs sm:text-sm opacity-70">Paste tweet URL in form</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="border border-white px-2 sm:px-3 py-1 font-mono text-xs sm:text-sm">04</div>
                    <div>
                      <h3 className="font-bold mb-1 text-sm sm:text-base">SUBMIT</h3>
                      <p className="text-xs sm:text-sm opacity-70">Complete entry form</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border border-yellow-500 p-2 sm:p-3">
                  <p className="text-xs font-mono text-yellow-500">
                    <AlertCircle className="h-3 w-3 inline mr-2" />
                    ALL TAGS REQUIRED FOR VALID ENTRY
                  </p>
                </div>

                <a
                  href={generateTweetText()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-white text-center py-2 sm:py-3 font-mono text-xs sm:text-sm hover:bg-white hover:text-black transition-all duration-300 mt-4"
                >
                  <Twitter className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
                  GENERATE TWEET
                </a>
              </div>
            </div>

            {/* Brutalist submission form */}
            <div className="space-y-8">
              <div className="border border-white p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 tracking-tighter">ENTRY</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-mono mb-2">NAME *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-white bg-transparent px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm focus:outline-none focus:bg-white focus:text-black transition-all duration-300"
                      placeholder="ENTER NAME"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-mono mb-2">EMAIL *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-white bg-transparent px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm focus:outline-none focus:bg-white focus:text-black transition-all duration-300"
                      placeholder="ENTER EMAIL"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-mono mb-2">WALLET *</label>
                    <input
                      type="text"
                      value={formData.walletAddress}
                      onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                      className="w-full border border-white bg-transparent px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm focus:outline-none focus:bg-white focus:text-black transition-all duration-300"
                      placeholder="0x..."
                      required
                      readOnly
                    />
                    <p className="text-xs font-mono opacity-60 mt-1">Auto-filled from connected wallet</p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-mono mb-2">TWEET URL *</label>
                    <input
                      type="url"
                      value={formData.tweetUrl}
                      onChange={(e) => handleInputChange('tweetUrl', e.target.value)}
                      className="w-full border border-white bg-transparent px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm focus:outline-none focus:bg-white focus:text-black transition-all duration-300"
                      placeholder="https://twitter.com/..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full border border-white py-2 sm:py-3 font-mono text-xs sm:text-sm hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ENTRY'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Spacing for back button */}
        {showCompactView && (
          <div className="mb-16"></div>
        )}
      </div>

      {/* Email Notifications */}
      {notifications.map((notification, index) => (
        <EmailNotifications key={index} {...notification} />
      ))}
    </div>
  )
}