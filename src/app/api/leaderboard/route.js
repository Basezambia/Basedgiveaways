import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Add connection check for Vercel
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query with Prisma - filter out test entries
    const whereCondition = {
      campaign: {
        isActive: true
      },
      // Filter out test entries
      AND: [
        {
          NOT: {
            OR: [
              { name: { contains: 'test' } },
              { name: { contains: 'Test' } },
              { email: { contains: 'test' } },
              { email: { contains: 'example' } },
              { walletAddress: { contains: '0x1234' } },
              { walletAddress: { contains: '0xtest' } }
            ]
          }
        }
      ]
    };

    // Filter by campaign if specified
    if (campaignId) {
      whereCondition.campaignId = campaignId;
    }

    const submissions = await prisma.submission.findMany({
      where: whereCondition,
      include: {
        campaign: {
          select: {
            title: true,
            isActive: true
          }
        }
      },
      orderBy: [
        { entryCount: 'desc' },
        { createdAt: 'asc' }
      ],
      take: limit
    });

    // Calculate rankings and add position
    const leaderboard = submissions.map((submission, index) => ({
      position: index + 1,
      id: submission.id,
      name: submission.name,
      walletAddress: submission.walletAddress,
      entryCount: submission.entryCount,
      isVerified: submission.isVerified,
      submissionDate: submission.createdAt,
      campaignTitle: submission.campaign.title,
      campaignId: submission.campaignId,
      // Mask email for privacy (show only first 3 chars + domain)
      maskedEmail: submission.email.replace(/(.{3}).*(@.*)/, '$1***$2')
    }));

    // Get total participants count
    const totalParticipants = await prisma.submission.count({
      where: campaignId ? { campaignId: campaignId } : {}
    });

    // Get campaign statistics
    const totalEntries = submissions.reduce((sum, sub) => sum + sub.entryCount, 0);
    const participantCount = totalParticipants;
    
    const stats = {
      totalParticipants: participantCount,
      totalEntries: totalEntries,
      verifiedParticipants: submissions.filter(sub => sub.isVerified).length,
      averageEntries: participantCount > 0 ? totalEntries / participantCount : 0
    };

    return NextResponse.json({
      success: true,
      leaderboard,
      stats,
      meta: {
        total: leaderboard.length,
        limit: limit,
        campaignFilter: campaignId || null
      }
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}