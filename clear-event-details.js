const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearEventDetails() {
  try {
    console.log('🧹 Clearing event details from campaign covers...\n');

    // Clear event details for YE campaign
    console.log('Clearing YE campaign event details...');
    const { data: yeUpdate, error: yeError } = await supabase
      .from('campaigns')
      .update({
        eventDate: null,
        location: null,
        artist: null
      })
      .eq('title', 'YE')
      .select();

    if (yeError) {
      console.error('❌ Error updating YE campaign:', yeError);
    } else {
      console.log(`✅ Cleared event details for ${yeUpdate?.length || 0} YE campaign(s)`);
    }

    // Clear event details for TRAVIS campaign
    console.log('Clearing TRAVIS campaign event details...');
    const { data: travisUpdate, error: travisError } = await supabase
      .from('campaigns')
      .update({
        eventDate: null,
        location: null,
        artist: null
      })
      .eq('title', 'TRAVIS')
      .select();

    if (travisError) {
      console.error('❌ Error updating TRAVIS campaign:', travisError);
    } else {
      console.log(`✅ Cleared event details for ${travisUpdate?.length || 0} TRAVIS campaign(s)`);
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

    console.log('\n🎉 Event details cleared successfully from campaign covers!');
  } catch (error) {
    console.error('❌ Error clearing event details:', error);
  }
}

clearEventDetails();