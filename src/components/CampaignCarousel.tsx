'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Campaign {
  id: string
  title: string
  description: string
  imageUrl: string
  endTime?: Date
  eventDate?: Date
  location?: string
  artist?: string
}

interface VisibleCampaign extends Campaign {
  position: number
  isCenter: boolean
}

interface CampaignCarouselProps {
  campaigns: Campaign[]
  onCampaignSelectAction: (campaign: Campaign) => void
}

export default function CampaignCarousel({ campaigns, onCampaignSelectAction }: CampaignCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextCampaign = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % campaigns.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  const prevCampaign = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  const handleCampaignClick = (campaign: Campaign, position: number) => {
    // If clicking a non-center campaign, bring it to center
    if (position !== 0) {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrentIndex(campaigns.findIndex(c => c.id === campaign.id))
      setTimeout(() => setIsTransitioning(false), 700)
    }
    // Don't open campaign details - only ENTER button should do that
  }

  const handleEnterClick = (campaign: Campaign, e: React.MouseEvent) => {
    e.stopPropagation()
    onCampaignSelectAction(campaign)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    stopAutoScroll()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextCampaign()
    } else if (touchEnd - touchStart > 50) {
      prevCampaign()
    }
    startAutoScroll()
  }

  const startAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
    autoScrollRef.current = setInterval(() => {
      if (isAutoScrolling && !isTransitioning) {
        nextCampaign()
      }
    }, 5000)
  }

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
  }

  useEffect(() => {
    startAutoScroll()
    return () => stopAutoScroll()
  }, [isAutoScrolling, isTransitioning])

  const getVisibleCampaigns = (): VisibleCampaign[] => {
    const visible: VisibleCampaign[] = []
    const total = campaigns.length
    
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + total) % total
      visible.push({
        ...campaigns[index],
        position: i,
        isCenter: i === 0
      })
    }
    
    return visible
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 font-mono text-sm">NO CAMPAIGNS</p>
      </div>
    )
  }

  const visibleCampaigns = getVisibleCampaigns()

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto px-4"
      onMouseEnter={() => setIsAutoScrolling(false)}
      onMouseLeave={() => setIsAutoScrolling(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Brutalist carousel with floating cards */}
      <div className="relative h-64 sm:h-80 md:h-96 flex items-center justify-center overflow-hidden">
        {visibleCampaigns.map((campaign, index) => {
          const scale = campaign.isCenter ? 1 : 0.75
          const opacity = campaign.isCenter ? 1 : 0.5
          const zIndex = campaign.isCenter ? 20 : 10
          const rotateY = campaign.position * 12
          
          return (
            <div
              key={`${campaign.id}-${campaign.position}`}
              className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                campaign.isCenter 
                  ? 'hover:scale-105' 
                  : 'hover:scale-80'
              }`}
              style={{
                opacity: opacity,
                zIndex: zIndex,
                filter: campaign.isCenter ? 'none' : 'blur(1px)',
                transform: campaign.position === -1 
                  ? `translateX(calc(-280px - 2vw)) scale(${scale}) perspective(1200px) rotateY(${rotateY}deg)`
                  : campaign.position === 1 
                  ? `translateX(calc(280px + 2vw)) scale(${scale}) perspective(1200px) rotateY(${rotateY}deg)`
                  : `scale(${scale}) perspective(1200px) rotateY(${rotateY}deg)`
              }}
              onClick={() => handleCampaignClick(campaign, campaign.position)}
            >
              <div className="relative w-64 h-48 sm:w-80 sm:h-60 md:w-96 md:h-72 lg:w-[440px] lg:h-80 border-2 border-white rounded-none overflow-hidden bg-black transition-all duration-300 hover:border-gray-400">
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  fill
                  className="object-cover mix-blend-luminosity"
                  priority={campaign.isCenter}
                />
                <div className="absolute inset-0 bg-black/60" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 text-white">
                  <h2 className={`font-black mb-2 transition-all duration-300 ${
                    campaign.isCenter ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter' : 'text-base sm:text-lg md:text-xl'
                  }`}>
                    {campaign.title}
                  </h2>
                  {campaign.isCenter && (
                    <div className="space-y-3 sm:space-y-4">
                      <p className="text-sm sm:text-base opacity-80 font-light">
                        {campaign.description}
                      </p>
                      {campaign.eventDate && campaign.location && (
                        <div className="text-xs sm:text-sm opacity-70 font-mono space-y-1">
                          <div>📅 {new Date(campaign.eventDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</div>
                          <div>📍 {campaign.location}</div>
                          {campaign.artist && <div>🎤 {campaign.artist}</div>}
                        </div>
                      )}
                      <button 
                        onClick={(e) => handleEnterClick(campaign, e)}
                        className="border border-white px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-2 text-xs font-mono hover:bg-white hover:text-black transition-all duration-300"
                      >
                        ENTER
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Brutalist progress bar */}
      <div className="mt-6 sm:mt-8 md:mt-12 flex justify-center">
        <div className="w-32 sm:w-48 md:w-64 h-1 bg-white/20 border border-white/30">
          <div 
            className="h-full bg-white transition-all duration-700 ease-out"
            style={{ 
              width: `${100 / campaigns.length}%`,
              left: `${(currentIndex / campaigns.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Brutalist dots */}
      <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-4">
        {campaigns.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isTransitioning) return
              setIsTransitioning(true)
              setCurrentIndex(index)
              setTimeout(() => setIsTransitioning(false), 700)
            }}
            className={`w-2 h-2 border border-white transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-transparent hover:bg-white/50'
            }`}
            disabled={isTransitioning}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
          />
        ))}
      </div>
    </div>
  )
}