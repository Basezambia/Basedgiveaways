import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Add connection check for Vercel
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase configuration is not set')
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query with Supabase - filter out test entries and get submissions with campaign data
    let query = supabase
      .from('submissions')
      .select(`
        *,
        campaigns!inner(
          title,
          isActive
        )
      `)
      .eq('campaigns.isActive', true)
      .not('name', 'ilike', '%test%')
      .not('email', 'ilike', '%test%')
      .not('email', 'ilike', '%example%')
      .not('walletAddress', 'ilike', '%0x1234%')
      .not('walletAddress', 'ilike', '%0xtest%')
      .order('entryCount', { ascending: false })
      .order('createdAt', { ascending: true })
      .limit(limit)

    // Filter by campaign if specified
    if (campaignId) {
      query = query.eq('campaignId', campaignId)
    }

    const { data: submissions, error: submissionsError } = await query

    if (submissionsError) {
      console.error('Submissions query error:', submissionsError)
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      )
    }

    // Calculate rankings and add position
    const leaderboard = submissions.map((submission, index) => ({
      position: index + 1,
      id: submission.id,
      name: submission.name,
      walletAddress: submission.walletAddress,
      entryCount: submission.entryCount,
      isVerified: submission.isVerified,
      submissionDate: submission.createdAt,
      campaignTitle: submission.campaigns.title,
      campaignId: submission.campaignId,
      // Mask email for privacy (show only first 3 chars + domain)
      maskedEmail: submission.email.replace(/(.{3}).*(@.*)/, '$1***$2')
    }));

    // Get total participants count
    let totalParticipantsQuery = supabase
      .from('submissions')
      .select('id', { count: 'exact' })

    if (campaignId) {
      totalParticipantsQuery = totalParticipantsQuery.eq('campaignId', campaignId)
    }

    const { count: totalParticipants, error: countError } = await totalParticipantsQuery

    if (countError) {
      console.error('Count query error:', countError)
      return NextResponse.json(
        { error: 'Failed to fetch participant count' },
        { status: 500 }
      )
    }

    // Get campaign statistics
    const totalEntries = submissions.reduce((sum, sub) => sum + sub.entryCount, 0);
    const participantCount = totalParticipants || 0;
    
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