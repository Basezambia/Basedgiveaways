import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    
    // Calculate date range based on period
    const now = new Date()
    const daysBack = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))

    // Get all campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')

    if (campaignsError) {
      console.error('Campaigns fetch error:', campaignsError)
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      )
    }

    // Get submissions for the date range
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .gte('createdAt', startDate.toISOString())

    if (submissionsError) {
      console.error('Submissions fetch error:', submissionsError)
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      )
    }

    // Calculate analytics for each campaign
    const campaignAnalytics = campaigns.map(campaign => {
      const campaignSubmissions = submissions.filter(sub => sub.campaignId === campaign.id)
      const totalEntries = campaignSubmissions.reduce((sum, sub) => sum + sub.entryCount, 0)
      const uniqueParticipants = campaignSubmissions.length
      
      // Mock views data - in production, you'd track this separately
      const views = Math.floor(totalEntries * (Math.random() * 10 + 5))
      const conversionRate = views > 0 ? (uniqueParticipants / views) * 100 : 0

      return {
        id: campaign.id,
        title: campaign.title,
        totalEntries,
        uniqueParticipants,
        conversionRate: Math.min(conversionRate, 100), // Cap at 100%
        startDate: campaign.createdAt,
        endDate: campaign.endTime || new Date(new Date(campaign.createdAt).getTime() + (30 * 24 * 60 * 60 * 1000)),
        status: campaign.winnerSelected ? 'ended' : 'active',
        views
      }
    })

    // Calculate overall stats
    const totalStats = {
      totalEntries: campaignAnalytics.reduce((sum, c) => sum + c.totalEntries, 0),
      uniqueParticipants: campaignAnalytics.reduce((sum, c) => sum + c.uniqueParticipants, 0),
      totalViews: campaignAnalytics.reduce((sum, c) => sum + c.views, 0),
      avgConversion: campaignAnalytics.length > 0 
        ? campaignAnalytics.reduce((sum, c) => sum + c.conversionRate, 0) / campaignAnalytics.length 
        : 0
    }

    // Process daily stats into chart-friendly format
    const chartData: Array<{
      date: string;
      entries: number;
      participants: number;
    }> = []
    
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + (24 * 60 * 60 * 1000))
      
      const daySubmissions = submissions.filter(sub => {
        const subDate = new Date(sub.createdAt)
        return subDate >= dayStart && subDate < dayEnd
      })
      
      chartData.push({
        date: dayStart.toISOString().split('T')[0],
        entries: daySubmissions.reduce((sum, sub) => sum + (sub.entryCount || 0), 0),
        participants: daySubmissions.length
      })
    }

    return NextResponse.json({
      campaigns: campaignAnalytics,
      totalStats,
      chartData,
      period
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}