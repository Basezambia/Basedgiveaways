import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Decode the session token (in production, use proper JWT verification)
      const sessionData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (Date.now() > sessionData.expiresAt) {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        );
      }

      // Verify user still exists and is valid (in production, check database)
      if (!sessionData.userId || !sessionData.username) {
        return NextResponse.json(
          { error: 'Invalid token data' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        valid: true,
        user: {
          id: sessionData.userId,
          username: sessionData.username,
          role: sessionData.role
        }
      });

    } catch (decodeError) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}