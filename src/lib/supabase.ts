import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export interface Campaign {
  id: string
  title: string
  description: string
  imageUrl: string
  rules: string
  isActive: boolean
  endTime: string | null
  winnerSelected: boolean
  winnerHash: string | null
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  name: string
  email: string
  walletAddress: string
  entryCount: number
  isVerified: boolean
  verificationHash: string | null
  createdAt: string
  updatedAt: string
  campaignId: string
  tweetUrl?: string | null
}

export interface Admin {
  id: string
  username: string
  email: string
  password: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}