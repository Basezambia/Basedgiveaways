import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In production, verify admin token here
    const authHeader = request.headers.get('authorization');
    // For demo purposes, we'll skip strict auth verification

    // Verify campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, title, isActive')
      .eq('id', id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Get all submissions for this campaign
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select(`
        id,
        name,
        email,
        walletAddress,
        entryCount,
        isVerified,
        createdAt
      `)
      .eq('campaignId', id)
      .eq('isVerified', true) // Only verified participants can win
      .order('createdAt', { ascending: true });

    if (submissionsError) {
      console.error('Submissions fetch error:', submissionsError);
      return NextResponse.json(
        { error: 'Failed to fetch participants' },
        { status: 500 }
      );
    }

    // Transform submissions to participants format
    const participants = submissions.map(submission => ({
      id: submission.id,
      name: submission.name,
      email: submission.email,
      walletAddress: submission.walletAddress,
      entryCount: submission.entryCount || 1,
      isVerified: submission.isVerified,
      submittedAt: submission.createdAt
    }));

    // Calculate statistics
    const totalEntries = participants.reduce((sum, p) => sum + p.entryCount, 0);
    const stats = {
      totalParticipants: participants.length,
      totalEntries: totalEntries,
      averageEntries: participants.length > 0 ? totalEntries / participants.length : 0
    };

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        title: campaign.title,
        isActive: campaign.isActive
      },
      participants,
      stats,
      total: participants.length
    });

  } catch (error) {
    console.error('Participants fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}