import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const status = searchParams.get('status'); // 'pending', 'verified', 'all'

    let query = supabase
      .from('submissions')
      .select(`
        *,
        campaigns!inner(
          id,
          title
        )
      `);

    if (campaignId && campaignId !== 'all') {
      query = query.eq('campaignId', campaignId);
    }

    if (status === 'pending') {
      query = query.eq('isVerified', false);
    } else if (status === 'verified') {
      query = query.eq('isVerified', true);
    }

    const { data: submissions, error } = await query
      .order('isVerified', { ascending: true }) // Pending first
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Submissions fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedSubmissions = submissions.map(submission => ({
      ...submission,
      campaign: submission.campaigns
    }));

    return NextResponse.json(transformedSubmissions);

  } catch (error) {
    console.error('Admin submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}