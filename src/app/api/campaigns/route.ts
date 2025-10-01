import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get only active campaigns for public access
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        id,
        title,
        description,
        imageUrl,
        rules,
        isActive,
        endTime,
        winnerSelected,
        createdAt,
        updatedAt,
        eventDate,
        location,
        artist,
        submissions(count)
      `)
      .eq('isActive', true)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Public campaigns fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      _count: {
        submissions: campaign.submissions?.[0]?.count || 0
      }
    }));

    return NextResponse.json({
      campaigns: transformedCampaigns,
      total: campaigns.length
    });

  } catch (error) {
    console.error('Public campaigns fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}