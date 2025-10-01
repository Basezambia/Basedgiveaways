'use client'

import { ReactNode, useEffect } from 'react'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { base } from 'wagmi/chains'

interface MiniKitProviderProps {
  children: ReactNode
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
  const { setFrameReady } = useMiniKit()

  useEffect(() => {
    // Signal that the frame is ready for interaction
    setFrameReady()
  }, [setFrameReady])

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'base',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  )
}