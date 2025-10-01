'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export function WalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    // Try Coinbase Wallet first, then fallback to injected
    connect({ connector: coinbaseWallet() })
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected && address) {
    return (
      <button
        onClick={handleDisconnect}
        className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-mono font-bold text-black bg-white border border-white hover:bg-black hover:text-white transition-all duration-300"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {chain?.id === base.id && (
            <span className="px-2 py-1 text-xs bg-black text-white font-mono">
              BASE
            </span>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-mono font-bold text-black bg-white border border-white hover:bg-black hover:text-white transition-all duration-300"
    >
      CONNECT WALLET
    </button>
  )
}