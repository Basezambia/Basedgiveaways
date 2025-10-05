'use client'

import { useState, useEffect, useRef } from 'react'

interface Participant {
  id: string
  name: string
  walletAddress: string
  email: string
  entryCount: number
}

interface WinnerSelectionAnimationProps {
  participants: Participant[]
  onCompleteAction: (winner: Participant) => void
  isSelecting: boolean
  finalWinner?: Participant
}

export default function WinnerSelectionAnimation({
  participants,
  onCompleteAction,
  isSelecting,
  finalWinner
}: WinnerSelectionAnimationProps) {
  const [currentName, setCurrentName] = useState('')
  const [currentWallet, setCurrentWallet] = useState('')
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'spinning' | 'slowing' | 'revealing' | 'complete'>('idle')
  const [spinSpeed, setSpinSpeed] = useState(100)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isSelecting && participants.length > 0) {
      startAnimation()
    } else {
      stopAnimation()
    }

    return () => {
      stopAnimation()
    }
  }, [isSelecting, participants])

  const startAnimation = () => {
    if (participants.length === 0) return

    setAnimationPhase('spinning')
    setSpinSpeed(50) // Fast initial speed

    // Phase 1: Fast spinning (2 seconds)
    intervalRef.current = setInterval(() => {
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)]
      setCurrentName(randomParticipant.name)
      setCurrentWallet(formatWalletAddress(randomParticipant.walletAddress))
    }, spinSpeed)

    // Phase 2: Start slowing down after 2 seconds
    phaseTimeoutRef.current = setTimeout(() => {
      setAnimationPhase('slowing')
      slowDownAnimation()
    }, 2000)
  }

  const slowDownAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    let currentSpeed = 100
    const slowDownInterval = setInterval(() => {
      currentSpeed += 50 // Gradually increase interval time (slow down)
      
      if (currentSpeed > 800) {
        clearInterval(slowDownInterval)
        revealWinner()
        return
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)]
        setCurrentName(randomParticipant.name)
        setCurrentWallet(formatWalletAddress(randomParticipant.walletAddress))
      }, currentSpeed)
    }, 200)
  }

  const revealWinner = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setAnimationPhase('revealing')

    // Show the final winner
    if (finalWinner) {
      setCurrentName(finalWinner.name)
      setCurrentWallet(formatWalletAddress(finalWinner.walletAddress))
    }

    // Complete animation after reveal
    setTimeout(() => {
      setAnimationPhase('complete')
      if (finalWinner) {
        onCompleteAction(finalWinner)
      }
    }, 1000)
  }

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current)
      phaseTimeoutRef.current = null
    }
    setAnimationPhase('idle')
  }

  const formatWalletAddress = (address: string) => {
    if (address.length < 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getAnimationClasses = () => {
    switch (animationPhase) {
      case 'spinning':
        return 'animate-pulse scale-105'
      case 'slowing':
        return 'animate-bounce scale-110'
      case 'revealing':
        return 'animate-ping scale-125'
      case 'complete':
        return 'scale-110 bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
      default:
        return ''
    }
  }

  const getStatusText = () => {
    switch (animationPhase) {
      case 'spinning':
        return 'SELECTING WINNER...'
      case 'slowing':
        return 'NARROWING DOWN...'
      case 'revealing':
        return 'WINNER SELECTED!'
      case 'complete':
        return '🎉 CONGRATULATIONS! 🎉'
      default:
        return 'READY TO SELECT'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          animation: animationPhase === 'spinning' ? 'spin 2s linear infinite' : 'none'
        }} />
      </div>

      {/* Status Text */}
      <div className="mb-8 text-center">
        <div className={`font-mono text-sm font-bold transition-all duration-300 ${
          animationPhase === 'complete' ? 'text-yellow-400' : 'text-gray-400'
        }`}>
          {getStatusText()}
        </div>
      </div>

      {/* Winner Display */}
      <div className={`
        border-4 border-white/30 p-8 min-w-[400px] text-center transition-all duration-300
        ${getAnimationClasses()}
      `}>
        {/* Participant Name */}
        <div className="mb-4">
          <div className="text-gray-400 font-mono text-xs mb-2">PARTICIPANT</div>
          <div className={`
            font-mono text-2xl font-black transition-all duration-200
            ${animationPhase === 'spinning' ? 'blur-sm' : ''}
            ${animationPhase === 'complete' ? 'text-black' : 'text-white'}
          `}>
            {currentName || 'READY'}
          </div>
        </div>

        {/* Wallet Address */}
        <div className="mb-4">
          <div className="text-gray-400 font-mono text-xs mb-2">WALLET</div>
          <div className={`
            font-mono text-lg transition-all duration-200
            ${animationPhase === 'spinning' ? 'blur-sm' : ''}
            ${animationPhase === 'complete' ? 'text-black' : 'text-gray-300'}
          `}>
            {currentWallet || '0x...'}
          </div>
        </div>

        {/* Entry Count (shown only when complete) */}
        {animationPhase === 'complete' && finalWinner && (
          <div className="mt-4 pt-4 border-t border-black/20">
            <div className="text-black font-mono text-xs mb-1">ENTRIES</div>
            <div className="text-black font-mono text-lg font-bold">
              {finalWinner.entryCount}
            </div>
          </div>
        )}
      </div>

      {/* Blockchain Hash Display (when revealing) */}
      {(animationPhase === 'revealing' || animationPhase === 'complete') && (
        <div className="mt-6 text-center">
          <div className="text-gray-400 font-mono text-xs mb-2">CRYPTOGRAPHIC PROOF</div>
          <div className="font-mono text-xs text-green-400">
            0x{Math.random().toString(16).substr(2, 16)}...
          </div>
        </div>
      )}

      {/* Particle Effects */}
      {animationPhase === 'complete' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-8 w-full max-w-md">
        <div className="bg-white/20 h-2 rounded-full overflow-hidden">
          <div 
            className={`
              h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300
              ${animationPhase === 'spinning' ? 'w-1/3' : ''}
              ${animationPhase === 'slowing' ? 'w-2/3' : ''}
              ${animationPhase === 'revealing' ? 'w-5/6' : ''}
              ${animationPhase === 'complete' ? 'w-full bg-gradient-to-r from-yellow-400 to-orange-500' : ''}
            `}
          />
        </div>
        <div className="text-center mt-2 font-mono text-xs text-gray-400">
          {animationPhase === 'idle' && 'READY'}
          {animationPhase === 'spinning' && 'PROCESSING...'}
          {animationPhase === 'slowing' && 'FINALIZING...'}
          {animationPhase === 'revealing' && 'REVEALING...'}
          {animationPhase === 'complete' && 'COMPLETE!'}
        </div>
      </div>
    </div>
  )
}