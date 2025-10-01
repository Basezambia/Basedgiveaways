import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle webhook events from Farcaster/Base
    console.log('Webhook received:', body)
    
    // Process different event types
    switch (body.type) {
      case 'frame_added':
        // Handle when user adds the mini app to their list
        console.log('Frame added by user:', body.data.fid)
        break
      case 'frame_removed':
        // Handle when user removes the mini app
        console.log('Frame removed by user:', body.data.fid)
        break
      case 'notification_clicked':
        // Handle notification interactions
        console.log('Notification clicked:', body.data)
        break
      default:
        console.log('Unknown webhook event:', body.type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is active' })
}