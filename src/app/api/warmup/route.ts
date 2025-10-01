import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // This endpoint helps warm up the API routes by triggering compilation
    // It can be called during app initialization to prevent 404 errors
    return NextResponse.json({ 
      success: true, 
      message: 'API routes warmed up',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Warmup error:', error)
    return NextResponse.json(
      { success: false, error: 'Warmup failed' },
      { status: 500 }
    )
  }
}