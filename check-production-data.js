const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductionData() {
  try {
    console.log('🔍 Checking production database for event details...\n');
    
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('id, title, eventDate, location, artist, updatedAt');

    if (error) {
      console.error('❌ Error fetching campaigns:', error);
      return;
    }

    console.log('📋 Campaign data in production database:');
    campaigns.forEach(campaign => {
      console.log(`\n- ${campaign.title}:`);
      console.log(`  ID: ${campaign.id}`);
      console.log(`  Event Date: ${campaign.eventDate || 'NULL'}`);
      console.log(`  Location: ${campaign.location || 'NULL'}`);
      console.log(`  Artist: ${campaign.artist || 'NULL'}`);
      console.log(`  Updated At: ${campaign.updatedAt}`);
    });

    console.log('\n✅ Production database check completed!');
  } catch (error) {
    console.error('❌ Error checking production data:', error);
  }
}

checkProductionData();