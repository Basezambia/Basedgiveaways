import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // In production, verify admin token here
    const authHeader = request.headers.get('authorization');
    // For demo purposes, we'll skip strict auth verification

    const { data: updatedCampaign, error } = await supabase
      .from('campaigns')
      .update({
        ...body,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Campaign update error:', error);
      return NextResponse.json(
        { error: 'Failed to update campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign
    });

  } catch (error) {
    console.error('Campaign update error:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In production, verify admin token here
    const authHeader = request.headers.get('authorization');
    // For demo purposes, we'll skip strict auth verification

    // Get campaign details before deletion for notification
    const { data: campaign, error: findError } = await supabase
      .from('campaigns')
      .select('title')
      .eq('id', id)
      .single();

    if (findError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Delete campaign (submissions will be cascade deleted due to schema)
    const { error: deleteError } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Campaign deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Campaign deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}