import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST(request: Request) {
  try {
    // Add connection check for Vercel
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
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
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
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

    // Check for duplicate entry by wallet address
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        walletAddress: walletAddress,
        campaignId: campaignId
      }
    })

    if (existingSubmission) {
      return NextResponse.json(
        { 
          error: 'Duplicate entry detected',
          message: 'This wallet address has already entered this campaign'
        },
        { status: 409 }
      )
    }

    // Create new submission
    const submission = await prisma.submission.create({
      data: {
        name,
        email,
        walletAddress,
        tweetUrl: tweetUrl || null,
        campaignId,
        entryCount: 1
      }
    })

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