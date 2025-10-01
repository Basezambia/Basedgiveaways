const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function populateEventData() {
  try {
    console.log('Populating event details for campaigns...');

    // Update YE campaign
    console.log('Updating YE campaign...');
    const { data: yeData, error: yeError } = await supabase
      .from('campaigns')
      .update({
        eventDate: '2025-02-14T20:00:00Z',
        location: 'Madison Square Garden, New York',
        artist: 'Kanye West'
      })
      .eq('title', 'YE')
      .select();

    if (yeError) {
      console.error('Error updating YE campaign:', yeError);
    } else {
      console.log('✓ YE campaign updated successfully:', yeData);
    }

    // Update TRAVIS campaign
    console.log('Updating TRAVIS campaign...');
    const { data: travisData, error: travisError } = await supabase
      .from('campaigns')
      .update({
        eventDate: '2025-03-15T19:30:00Z',
        location: 'Astroworld Festival, Houston',
        artist: 'Travis Scott'
      })
      .eq('title', 'TRAVIS')
      .select();

    if (travisError) {
      console.error('Error updating TRAVIS campaign:', travisError);
    } else {
      console.log('✓ TRAVIS campaign updated successfully:', travisData);
    }

    // Verify the updates
    console.log('\nVerifying all campaigns with event details...');
    const { data: allCampaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('title, eventDate, location, artist');

    if (fetchError) {
      console.error('Error fetching campaigns:', fetchError);
    } else {
      console.log('All campaigns with event details:');
      allCampaigns.forEach(campaign => {
        console.log(`- ${campaign.title}:`);
        console.log(`  Event Date: ${campaign.eventDate}`);
        console.log(`  Location: ${campaign.location}`);
        console.log(`  Artist: ${campaign.artist}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

populateEventData();