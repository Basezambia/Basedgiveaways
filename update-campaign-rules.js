const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with correct credentials
const supabase = createClient(
  'https://jltjkvrbhzsrredcazes.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdGprdnJiaHpzcnJlZGNhemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjQ0MjgsImV4cCI6MjA3NDc0MDQyOH0.nQmL-_EWAFk4dUGbOTwkUcMAOivS6CoWSPdM7tdMMco'
);

async function updateCampaignRules() {
  try {
    console.log('🔄 Updating campaign rules to remove specific tags...\n');

    // First, check current rules
    const { data: currentCampaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('id, title, rules')
      .order('title');

    if (fetchError) {
      console.error('❌ Error fetching campaigns:', fetchError);
      return;
    }

    console.log('Current campaign rules:');
    currentCampaigns.forEach(campaign => {
      console.log(`${campaign.title}: ${campaign.rules}`);
    });
    console.log('');

    // Update YE campaign rules - remove @kanyewest
    console.log('Updating YE campaign rules (removing @kanyewest)...');
    const { data: yeData, error: yeError } = await supabase
      .from('campaigns')
      .update({
        rules: 'Create a tweet tagging @yewest @lady_light_lsk @basezambia'
      })
      .eq('title', 'YE')
      .select();

    if (yeError) {
      console.error('❌ Error updating YE rules:', yeError);
    } else {
      console.log('✅ YE campaign rules updated successfully');
    }

    // Update TRAVIS campaign rules - remove @travisscott
    console.log('Updating TRAVIS campaign rules (removing @travisscott)...');
    const { data: travisData, error: travisError } = await supabase
      .from('campaigns')
      .update({
        rules: 'Create a tweet tagging @TRIXX @lady_light_lsk @basezambia'
      })
      .eq('title', 'TRAVIS')
      .select();

    if (travisError) {
      console.error('❌ Error updating TRAVIS rules:', travisError);
    } else {
      console.log('✅ TRAVIS campaign rules updated successfully');
    }

    // Verify the updates
    console.log('\n📋 Updated campaign rules:');
    const { data: updatedCampaigns, error: verifyError } = await supabase
      .from('campaigns')
      .select('id, title, rules')
      .order('title');

    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError);
    } else {
      updatedCampaigns.forEach(campaign => {
        console.log(`${campaign.title}: ${campaign.rules}`);
      });
    }

    console.log('\n🎉 Campaign rules update completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateCampaignRules();