import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request: Request) {
  try {
    // Add connection check for Vercel
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase configuration is not set')
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    // Handle warmup requests
    if (body.warmup) {
      return NextResponse.json({ success: true, message: 'Warmup successful' })
    }

    const { name, email, walletAddress, tweetUrl, campaignId } = body

    // Validate required fields
    if (!name || !email || !walletAddress || !campaignId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Enhanced wallet address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if campaign exists and is active
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (!campaign.isActive) {
      return NextResponse.json(
        { error: 'Campaign is no longer active' },
        { status: 400 }
      )
    }

    // Check for duplicate entries by email address (across all campaigns)
    const { data: emailSubmissions, error: emailError } = await supabase
      .from('submissions')
      .select('*')
      .eq('email', email)

    if (emailError) {
      console.error('Email duplicate check error:', emailError)
      return NextResponse.json(
        { error: 'Failed to validate submission' },
        { status: 500 }
      )
    }

    if (emailSubmissions && emailSubmissions.length >= 2) {
      return NextResponse.json(
        { 
          error: 'Duplicate email detected',
          message: 'This email address has already been used to sign up. You have already signed up!'
        },
        { status: 409 }
      )
    }

    // Check for duplicate entries by wallet address (across all campaigns)
    const { data: walletSubmissions, error: walletError } = await supabase
      .from('submissions')
      .select('*')
      .eq('walletAddress', walletAddress)

    if (walletError) {
      console.error('Wallet duplicate check error:', walletError)
      return NextResponse.json(
        { error: 'Failed to validate submission' },
        { status: 500 }
      )
    }

    if (walletSubmissions && walletSubmissions.length >= 2) {
      return NextResponse.json(
        { 
          error: 'Duplicate wallet detected',
          message: 'This wallet address has already been used to sign up. You have already signed up!'
        },
        { status: 409 }
      )
    }

    // Check for duplicate entry by wallet address in the same campaign
    const existingCampaignSubmission = walletSubmissions?.find(sub => sub.campaignId === campaignId)
    if (existingCampaignSubmission) {
      return NextResponse.json(
        { 
          error: 'Duplicate entry detected',
          message: 'This wallet address has already entered this campaign'
        },
        { status: 409 }
      )
    }

    // Create new submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        name,
        email,
        walletAddress,
        tweetUrl: tweetUrl || null,
        campaignId,
        entryCount: 1
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Submission creation error:', submissionError)
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully entered the giveaway!',
      submission: {
        id: submission.id,
        name: submission.name,
        entryCount: submission.entryCount,
        createdAt: submission.createdAt
      }
    })

  } catch (error) {
    console.error('Submission error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}