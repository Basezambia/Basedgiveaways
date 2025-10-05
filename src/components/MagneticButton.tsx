'use client'

import React from 'react'
import { useMagneticCursor } from '@/hooks/useMagneticCursor'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  strength?: number
  distance?: number
  as?: 'button' | 'a'
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  href,
  strength = 0.2,
  distance = 80,
  as = 'button'
}) => {
  const magneticRef = useMagneticCursor<HTMLElement>({ strength, distance })

  if (as === 'a' && href) {
    return (
      <a
        ref={magneticRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={magneticRef as React.RefObject<HTMLButtonElement>}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  )
}