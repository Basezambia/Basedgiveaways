import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';

    // Calculate date filter based on time range
    let dateFilter: string | undefined;
    const now = new Date();
    
    switch (timeRange) {
      case '24h':
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'all':
      default:
        dateFilter = undefined;
        break;
    }

    // Get overview statistics
    const [
      totalCampaignsResult,
      activeCampaignsResult,
      completedCampaignsResult,
      totalSubmissionsResult,
      verifiedSubmissionsResult,
      pendingSubmissionsResult
    ] = await Promise.all([
      supabase
        .from('campaigns')
        .select('id', { count: 'exact' })
        .then(result => dateFilter 
          ? supabase.from('campaigns').select('id', { count: 'exact' }).gte('createdAt', dateFilter)
          : result
        ),
      supabase
        .from('campaigns')
        .select('id', { count: 'exact' })
        .eq('isActive', true)
        .then(result => dateFilter 
          ? supabase.from('campaigns').select('id', { count: 'exact' }).eq('isActive', true).gte('createdAt', dateFilter)
          : result
        ),
      supabase
        .from('campaigns')
        .select('id', { count: 'exact' })
        .eq('winnerSelected', true)
        .then(result => dateFilter 
          ? supabase.from('campaigns').select('id', { count: 'exact' }).eq('winnerSelected', true).gte('createdAt', dateFilter)
          : result
        ),
      supabase
        .from('submissions')
        .select('id, entryCount')
        .then(result => dateFilter 
          ? supabase.from('submissions').select('id, entryCount').gte('createdAt', dateFilter)
          : result
        ),
      supabase
        .from('submissions')
        .select('id, entryCount')
        .eq('isVerified', true)
        .then(result => dateFilter 
          ? supabase.from('submissions').select('id, entryCount').eq('isVerified', true).gte('createdAt', dateFilter)
          : result
        ),
      supabase
        .from('submissions')
        .select('id', { count: 'exact' })
        .eq('isVerified', false)
        .then(result => dateFilter 
          ? supabase.from('submissions').select('id', { count: 'exact' }).eq('isVerified', false).gte('createdAt', dateFilter)
          : result
        )
    ]);

    const totalCampaigns = totalCampaignsResult.count || 0;
    const activeCampaigns = activeCampaignsResult.count || 0;
    const completedCampaigns = completedCampaignsResult.count || 0;
    const totalSubmissions = {
      _count: { id: totalSubmissionsResult.data?.length || 0 },
      _sum: { entryCount: totalSubmissionsResult.data?.reduce((sum, sub) => sum + (sub.entryCount || 0), 0) || 0 }
    };
    const verifiedSubmissions = {
      _count: { id: verifiedSubmissionsResult.data?.length || 0 },
      _sum: { entryCount: verifiedSubmissionsResult.data?.reduce((sum, sub) => sum + (sub.entryCount || 0), 0) || 0 }
    };
    const pendingSubmissions = pendingSubmissionsResult.count || 0;

    // Get campaign-specific statistics
    const campaignsQuery = dateFilter 
      ? supabase.from('campaigns').select('*').gte('createdAt', dateFilter).order('createdAt', { ascending: false })
      : supabase.from('campaigns').select('*').order('createdAt', { ascending: false });
    
    const { data: campaigns, error: campaignsError } = await campaignsQuery;

    if (campaignsError) {
      console.error('Campaigns fetch error:', campaignsError);
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    // Get all submissions for these campaigns
    const { data: allSubmissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*');

    if (submissionsError) {
      console.error('Submissions fetch error:', submissionsError);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    const processedCampaignStats = campaigns.map(campaign => {
      const campaignSubmissions = allSubmissions.filter(sub => sub.campaignId === campaign.id);
      const totalEntries = campaignSubmissions.reduce((sum, sub) => sum + (sub.entryCount || 0), 0);
      const verifiedSubmissions = campaignSubmissions.filter(sub => sub.isVerified);
      const verificationRate = campaignSubmissions.length > 0 
        ? Math.round((verifiedSubmissions.length / campaignSubmissions.length) * 100)
        : 0;

      return {
        id: campaign.id,
        title: campaign.title,
        entries: totalEntries,
        participants: campaignSubmissions.length,
        verificationRate,
        isActive: campaign.isActive,
        winnerSelected: campaign.winnerSelected,
        createdAt: campaign.createdAt
      };
    });

    // Get recent activity (simplified for demo)
    const recentSubmissionsQuery = dateFilter 
      ? supabase.from('submissions').select(`
          id,
          name,
          isVerified,
          createdAt,
          campaignId
        `).gte('createdAt', dateFilter).order('createdAt', { ascending: false }).limit(10)
      : supabase.from('submissions').select(`
          id,
          name,
          isVerified,
          createdAt,
          campaignId
        `).order('createdAt', { ascending: false }).limit(10);
    
    const { data: recentSubmissions, error: recentSubmissionsError } = await recentSubmissionsQuery;

    if (recentSubmissionsError) {
      console.error('Recent submissions fetch error:', recentSubmissionsError);
    }

    const recentWinnersQuery = dateFilter 
      ? supabase.from('campaigns').select('id, title, updatedAt').eq('winnerSelected', true).gte('updatedAt', dateFilter).order('updatedAt', { ascending: false }).limit(5)
      : supabase.from('campaigns').select('id, title, updatedAt').eq('winnerSelected', true).order('updatedAt', { ascending: false }).limit(5);
    
    const { data: recentWinners, error: recentWinnersError } = await recentWinnersQuery;

    if (recentWinnersError) {
      console.error('Recent winners fetch error:', recentWinnersError);
    }

    // Get campaign titles for submissions
    const campaignTitles = campaigns.reduce((acc, campaign) => {
      acc[campaign.id] = campaign.title;
      return acc;
    }, {} as Record<string, string>);

    // Combine recent activity
    const recentActivity = [
      ...(recentSubmissions || []).map(sub => ({
        id: `submission-${sub.id}`,
        type: sub.isVerified ? 'verification' as const : 'submission' as const,
        message: sub.isVerified 
          ? `${sub.name} entry verified`
          : `New submission from ${sub.name}`,
        timestamp: sub.createdAt,
        campaignId: sub.campaignId,
        campaignTitle: campaignTitles[sub.campaignId] || 'Unknown Campaign'
      })),
      ...(recentWinners || []).map(campaign => ({
        id: `winner-${campaign.id}`,
        type: 'winner_selection' as const,
        message: `Winner selected for ${campaign.title}`,
        timestamp: campaign.updatedAt,
        campaignId: campaign.id,
        campaignTitle: campaign.title
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15);

    const statistics = {
      overview: {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalEntries: totalSubmissions._sum.entryCount || 0,
        totalParticipants: totalSubmissions._count.id || 0,
        verifiedEntries: verifiedSubmissions._sum.entryCount || 0,
        pendingVerification: pendingSubmissions
      },
      campaignStats: processedCampaignStats,
      recentActivity,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(statistics);

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}