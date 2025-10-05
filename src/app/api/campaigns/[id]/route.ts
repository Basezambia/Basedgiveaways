import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get campaign with full details including event information
    const { data: campaign, error } = await supabase
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
      .eq('id', id)
      .single();

    if (error || !campaign) {
      console.error('Campaign fetch error:', error);
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedCampaign = {
      ...campaign,
      _count: {
        submissions: campaign.submissions?.[0]?.count || 0
      }
    };

    return NextResponse.json({
      campaign: transformedCampaign
    });

  } catch (error) {
    console.error('Campaign fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}