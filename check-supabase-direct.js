const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseDirect() {
  try {
    console.log('🔍 Checking Supabase directly...\n');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Using Service Role Key:', supabaseKey ? 'Yes' : 'No');

    // Check campaigns table
    console.log('\n📋 Checking campaigns table...');
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*');

    if (campaignsError) {
      console.error('❌ Campaigns error:', campaignsError);
    } else {
      console.log(`✅ Found ${campaigns.length} campaigns`);
      campaigns.forEach(campaign => {
        console.log(`  - ${campaign.title} (${campaign.id})`);
      });
    }

    // Check submissions table
    console.log('\n📝 Checking submissions table...');
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(10);

    if (submissionsError) {
      console.error('❌ Submissions error:', submissionsError);
      console.log('Error details:', submissionsError);
    } else {
      console.log(`✅ Found ${submissions.length} recent submissions`);
      submissions.forEach((submission, index) => {
        console.log(`  ${index + 1}. ${submission.name} - ${submission.walletAddress}`);
        console.log(`     Entries: ${submission.entryCount}, Created: ${submission.createdAt}`);
      });
    }

    // Check table schema
    console.log('\n🏗️ Checking table schema...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('❌ Could not fetch table schema:', tablesError.message);
    } else {
      console.log('✅ Available tables:', tables.map(t => t.table_name));
    }

  } catch (error) {
    console.error('❌ Error checking Supabase directly:', error);
  }
}

checkSupabaseDirect();