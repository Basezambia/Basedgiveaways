import { NextRequest, NextResponse } from 'next/server';
import { generateSecureToken } from '@/lib/crypto';
import { minikitConfig } from '../../../../../minikit.config';

// Allowed admin wallet address from minikit config
const ALLOWED_ADMIN_ADDRESS = minikitConfig.baseBuilder.allowedAddresses[0];

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, message } = await request.json();

    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { error: 'Wallet address, signature, and message are required' },
        { status: 400 }
      );
    }

    // Check if wallet address is the allowed admin address
    if (walletAddress.toLowerCase() !== ALLOWED_ADMIN_ADDRESS.toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized wallet address' },
        { status: 401 }
      );
    }

    // In a production environment, you would verify the signature here
    // For now, we'll trust that the wallet connection is valid
    // TODO: Implement proper signature verification using ethers or viem

    // Generate session token
    const token = generateSecureToken(64);
    
    const sessionData = {
      walletAddress: walletAddress.toLowerCase(),
      role: 'super_admin',
      issuedAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    // In production, you'd want to use proper JWT or store sessions in Redis/database
    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    return NextResponse.json({
      success: true,
      user: {
        id: `admin-${walletAddress.slice(-8)}`,
        username: `Admin (${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)})`,
        role: 'super_admin',
        walletAddress: walletAddress.toLowerCase()
      },
      token: sessionToken
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}