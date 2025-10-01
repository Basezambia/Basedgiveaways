import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Verify campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select(`
        id,
        title,
        isActive,
        endTime,
        winnerSelected,
        createdAt
      `)
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Get comprehensive statistics
    const [
      totalSubmissions,
      verifiedSubmissions,
      unverifiedSubmissions,
      recentEntries,
      topParticipants
    ] = await Promise.all([
      // Total entries and participants (all submissions)
      supabase
        .from('submissions')
        .select('id, entryCount')
        .eq('campaignId', campaignId),

      // Verified entries and participants
      supabase
        .from('submissions')
        .select('id, entryCount')
        .eq('campaignId', campaignId)
        .eq('isVerified', true),

      // Unverified submissions count
      supabase
        .from('submissions')
        .select('id', { count: 'exact' })
        .eq('campaignId', campaignId)
        .eq('isVerified', false),

      // Recent entries (last 10)
      supabase
        .from('submissions')
        .select(`
          id,
          name,
          walletAddress,
          entryCount,
          isVerified,
          createdAt
        `)
        .eq('campaignId', campaignId)
        .order('createdAt', { ascending: false })
        .limit(10),

      // Top participants by entry count
      supabase
        .from('submissions')
        .select(`
          id,
          name,
          walletAddress,
          entryCount,
          createdAt
        `)
        .eq('campaignId', campaignId)
        .eq('isVerified', true)
        .order('entryCount', { ascending: false })
        .order('createdAt', { ascending: true })
        .limit(10)
    ]);

    // Calculate aggregated statistics
    const totalStats = {
      count: totalSubmissions.data?.length || 0,
      sumEntryCount: totalSubmissions.data?.reduce((sum, sub) => sum + (sub.entryCount || 0), 0) || 0
    };

    const verifiedStats = {
      count: verifiedSubmissions.data?.length || 0,
      sumEntryCount: verifiedSubmissions.data?.reduce((sum, sub) => sum + (sub.entryCount || 0), 0) || 0
    };

    const unverifiedCount = unverifiedSubmissions.count || 0;

    // Calculate time-based statistics
    const now = new Date();
    const campaignStart = new Date(campaign.createdAt);
    const campaignEnd = campaign.endTime ? new Date(campaign.endTime) : null;
    
    const isActive = campaign.isActive && (!campaignEnd || now < campaignEnd);
    const timeRemaining = campaignEnd ? Math.max(0, campaignEnd.getTime() - now.getTime()) : null;
    const campaignDuration = campaignEnd ? campaignEnd.getTime() - campaignStart.getTime() : null;
    const progressPercentage = campaignDuration && campaignEnd ? 
      Math.min(100, ((now.getTime() - campaignStart.getTime()) / campaignDuration) * 100) : null;

    // Calculate entry rate (entries per hour)
    const hoursSinceStart = (now.getTime() - campaignStart.getTime()) / (1000 * 60 * 60);
    const entryRate = hoursSinceStart > 0 ? totalStats.sumEntryCount / hoursSinceStart : 0;

    const statistics = {
      campaign: {
        id: campaign.id,
        title: campaign.title,
        isActive,
        winnerSelected: campaign.winnerSelected,
        timeRemaining,
        progressPercentage,
        entryRate: Math.round(entryRate * 100) / 100
      },
      totals: {
        entries: totalStats.sumEntryCount,
        participants: totalStats.count,
        verifiedEntries: verifiedStats.sumEntryCount,
        verifiedParticipants: verifiedStats.count,
        pendingVerification: unverifiedCount
      },
      verification: {
        verificationRate: totalStats.count ? 
          Math.round((verifiedStats.count / totalStats.count) * 100) : 0,
        averageEntriesPerParticipant: verifiedStats.count ? 
          Math.round((verifiedStats.sumEntryCount / verifiedStats.count) * 100) / 100 : 0
      },
      recentActivity: recentEntries.data?.map(entry => ({
        id: entry.id,
        name: entry.name,
        walletAddress: `${entry.walletAddress.slice(0, 6)}...${entry.walletAddress.slice(-4)}`,
        entryCount: entry.entryCount,
        isVerified: entry.isVerified,
        createdAt: entry.createdAt
      })) || [],

      lastUpdated: now.toISOString()
    };

    return NextResponse.json(statistics);

  } catch (error) {
    console.error('Statistics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}