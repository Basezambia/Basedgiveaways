import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyEntryHash } from '@/lib/crypto';

export async function POST(request: NextRequest) {
  try {
    const { submissionId, verificationCode } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Find the submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select(`
        *,
        campaigns!inner(
          id,
          title,
          isActive,
          endTime
        )
      `)
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    if (submission.isVerified) {
      return NextResponse.json(
        { error: 'Submission already verified' },
        { status: 400 }
      );
    }

    if (!submission.campaigns.isActive) {
      return NextResponse.json(
        { error: 'Campaign is not active' },
        { status: 400 }
      );
    }

    if (submission.campaigns.endTime && new Date() > new Date(submission.campaigns.endTime)) {
      return NextResponse.json(
        { error: 'Campaign has ended' },
        { status: 400 }
      );
    }

    // Verify the hash if verification code is provided
    if (verificationCode && submission.verificationHash) {
      const timestamp = new Date(submission.createdAt).getTime();
      const isValidHash = verifyEntryHash(
        submission.walletAddress,
        submission.email,
        submission.campaignId,
        timestamp,
        submission.verificationHash
      );

      if (!isValidHash) {
        return NextResponse.json(
          { error: 'Invalid verification hash' },
          { status: 400 }
        );
      }
    }

    // Update submission as verified
    const { data: updatedSubmission, error: updateError } = await supabase
      .from('submissions')
      .update({
        isVerified: true,
        updatedAt: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (updateError) {
      console.error('Update submission error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: updatedSubmission.id,
        name: updatedSubmission.name,
        walletAddress: updatedSubmission.walletAddress,
        entryCount: updatedSubmission.entryCount,
        isVerified: updatedSubmission.isVerified
      },
      campaign: {
        id: submission.campaigns.id,
        title: submission.campaigns.title
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify submission' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Get unverified submissions for the campaign
    const { data: unverifiedSubmissions, error } = await supabase
      .from('submissions')
      .select(`
        id,
        name,
        email,
        walletAddress,
        tweetUrl,
        entryCount,
        createdAt,
        verificationHash
      `)
      .eq('campaignId', campaignId)
      .eq('isVerified', false)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Get unverified submissions error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch unverified submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      submissions: unverifiedSubmissions,
      count: unverifiedSubmissions.length
    });

  } catch (error) {
    console.error('Get unverified submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unverified submissions' },
      { status: 500 }
    );
  }
}