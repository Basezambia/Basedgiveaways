import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { campaignId, blockHash } = await request.json();

    if (!campaignId || !blockHash) {
      return NextResponse.json(
        { error: 'Campaign ID and block hash are required' },
        { status: 400 }
      );
    }

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.winnerSelected) {
      return NextResponse.json(
        { error: 'Winner already selected for this campaign' },
        { status: 400 }
      );
    }

    // Get verified submissions for the campaign
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .eq('campaignId', campaignId)
      .eq('isVerified', true)
      .order('createdAt', { ascending: true });

    if (submissionsError || !submissions || submissions.length === 0) {
      return NextResponse.json(
        { error: 'No verified submissions found' },
        { status: 400 }
      );
    }

    // Create deterministic selection using block hash
    const selectionSeed = `${campaignId}-${blockHash}`;
    const selectionHash = createHash('sha256').update(selectionSeed).digest('hex');
    const randomIndex = parseInt(selectionHash.substring(0, 8), 16) % submissions.length;
    
    const selectedSubmission = submissions[randomIndex];
    const winnerId = selectedSubmission.id;
    const winnerAddress = selectedSubmission.walletAddress;

    // Update campaign with winner
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({
        winnerSelected: true,
        winnerHash: selectionHash,
        updatedAt: new Date().toISOString()
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Campaign update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update campaign' },
        { status: 500 }
      );
    }

    // Get winner details
    const winner = submissions.find(s => s.id === winnerId);

    return NextResponse.json({
      success: true,
      winner: {
        id: winnerId,
        name: winner?.name,
        walletAddress: winnerAddress
      },
      selectionHash,
      campaign: {
        id: campaign.id,
        title: campaign.title
      }
    });

  } catch (error) {
    console.error('Winner selection error:', error);
    return NextResponse.json(
      { error: 'Failed to select winner' },
      { status: 500 }
    );
  }
}