'use client'

import { useState } from 'react'
import { Share2, Twitter, Facebook, Link, Copy, Check } from 'lucide-react'

interface SocialShareProps {
  campaign: {
    id: string
    title: string
    description: string
  }
  url?: string
}

export default function SocialShare({ campaign, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const shareUrl = url || `${window.location.origin}/?campaign=${campaign.id}`
  const shareText = `Check out this giveaway: ${campaign.title} - ${campaign.description}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border border-white/30 px-3 py-2 font-mono text-sm hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        SHARE
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share menu */}
          <div className="absolute top-full right-0 mt-2 bg-black border border-white/30 p-4 z-50 min-w-[200px]">
            <div className="space-y-3">
              <div className="text-xs font-mono text-gray-400 mb-3">SHARE CAMPAIGN</div>
              
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center gap-3 p-2 border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
                <span className="font-mono text-sm">TWITTER</span>
              </button>

              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center gap-3 p-2 border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
                <span className="font-mono text-sm">FACEBOOK</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-2 border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link className="w-4 h-4" />}
                <span className={`font-mono text-sm ${copied ? 'text-green-500' : ''}`}>
                  {copied ? 'COPIED!' : 'COPY LINK'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}