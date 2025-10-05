'use client'

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const magneticRef = useMagneticCursor<HTMLButtonElement>({ strength: 0.2, distance: 80 })

  const handleConnect = () => {
    // Try Coinbase Wallet first, then fallback to injected
    connect({ connector: coinbaseWallet() })
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const connectMagneticRef = useMagneticCursor<HTMLButtonElement>({ strength: 0.2, distance: 80 })

  if (isConnected && address) {
    return (
      <button
        ref={magneticRef}
        onClick={handleDisconnect}
        className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-mono font-bold text-black bg-white border border-white hover:bg-black hover:text-white transition-all duration-300 animate-breathe"
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full"></div>
          <span>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {chainId === base.id && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-black text-white font-mono">
              BASE
            </span>
          )}
        </div>
      </button>
    )
  }

  return (
       <button
         ref={connectMagneticRef}
         onClick={handleConnect}
         className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-mono font-bold text-black bg-white border border-white hover:bg-black hover:text-white transition-all duration-300 animate-breathe"
       >
      CONNECT WALLET
    </button>
  )
}