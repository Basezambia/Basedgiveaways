const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSupabaseCampaigns() {
  try {
    console.log('🔄 Updating Supabase campaigns with event details...\n');

    // First, let's check if the columns exist
    const { data: existingCampaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('id, title')
      .limit(1);

    if (fetchError) {
      console.error('❌ Error fetching campaigns:', fetchError);
      return;
    }

    console.log('✅ Successfully connected to Supabase database\n');

    // Update YE campaign
    console.log('Updating YE campaign with event details...');
    const { data: yeUpdate, error: yeError } = await supabase
      .from('campaigns')
      .update({
        eventDate: '2025-12-13T18:30:00.000Z',
        location: 'Ellis Park Stadium, Johannesburg',
        artist: 'Kanye West (YE)'
      })
      .eq('title', 'YE')
      .select();

    if (yeError) {
      console.error('❌ Error updating YE campaign:', yeError);
    } else {
      console.log(`✅ Updated ${yeUpdate?.length || 0} YE campaign(s)`);
    }

    // Update TRAVIS campaign
    console.log('Updating TRAVIS campaign with event details...');
    const { data: travisUpdate, error: travisError } = await supabase
      .from('campaigns')
      .update({
        eventDate: '2025-10-11T18:30:00.000Z',
        location: 'FNB Stadium, Johannesburg',
        artist: 'Travis Scott'
      })
      .eq('title', 'TRAVIS')
      .select();

    if (travisError) {
      console.error('❌ Error updating TRAVIS campaign:', travisError);
    } else {
      console.log(`✅ Updated ${travisUpdate?.length || 0} TRAVIS campaign(s)`);
    }

    // Verify the updates
    console.log('\n📋 Updated campaigns:');
    const { data: updatedCampaigns, error: verifyError } = await supabase
      .from('campaigns')
      .select('id, title, eventDate, location, artist');

    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError);
    } else {
      updatedCampaigns.forEach(campaign => {
        console.log(`\n- ${campaign.title}:`);
        console.log(`  Event Date: ${campaign.eventDate || 'NULL'}`);
        console.log(`  Location: ${campaign.location || 'NULL'}`);
        console.log(`  Artist: ${campaign.artist || 'NULL'}`);
      });
    }

    console.log('\n🎉 Supabase campaign event details update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating Supabase campaigns:', error);
  }
}

updateSupabaseCampaigns();