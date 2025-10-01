import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // In production, verify admin token here
    const authHeader = request.headers.get('authorization');
    // For demo purposes, we'll skip strict auth verification

    // Get campaigns with submission counts
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        submissions(count)
      `)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Campaigns fetch error:', error);
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
    console.error('Admin campaigns fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // In production, verify admin token here
    const authHeader = request.headers.get('authorization');
    // For demo purposes, we'll skip strict auth verification

    const body = await request.json();
    const { title, description, imageUrl, rules, isActive, endTime } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
        title,
        description,
        imageUrl,
        rules,
        isActive: isActive ?? true,
        endTime: endTime ? new Date(endTime).toISOString() : null,
      })
      .select(`
        *,
        submissions(count)
      `)
      .single();

    if (error) {
      console.error('Campaign creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create campaign' },
        { status: 500 }
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
      campaign: transformedCampaign,
      message: 'Campaign created successfully'
    });

  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}