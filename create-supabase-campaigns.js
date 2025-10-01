const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createCampaigns() {
  try {
    console.log('🎯 Creating test campaigns in Supabase...\n');

    // Check existing campaigns first
    const { data: existingCampaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching existing campaigns:', fetchError);
      return;
    }

    console.log(`Found ${existingCampaigns.length} existing campaigns`);
    if (existingCampaigns.length > 0) {
      existingCampaigns.forEach(campaign => {
        console.log(`- ${campaign.title} (ID: ${campaign.id})`);
      });
      console.log('');
    }

    // Create campaigns data
    const campaigns = [
      {
        title: 'YE',
        description: 'WIN A FREE YE TICKET',
        imageUrl: '/campaign1.png',
        rules: 'Create a tweet tagging @yewest @kanyewest',
        isActive: true,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      },
      {
        title: 'TRAVIS',
        description: 'WIN A FREE TRAVIS TICKET',
        imageUrl: '/campaign2.png',
        rules: 'Create a tweet tagging @travisscott @ladylight',
        isActive: true,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      }
    ];

    // Insert campaigns
    for (const campaignData of campaigns) {
      console.log(`Creating ${campaignData.title} campaign...`);
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaignData)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating ${campaignData.title} campaign:`, error);
      } else {
        console.log(`✅ ${campaignData.title} campaign created successfully!`);
        console.log(`   ID: ${data.id}`);
        console.log(`   Title: ${data.title}`);
        console.log(`   Active: ${data.isActive}`);
      }
      console.log('');
    }

    // Verify campaigns were created
    console.log('🔍 Verifying created campaigns...');
    const { data: allCampaigns, error: verifyError } = await supabase
      .from('campaigns')
      .select('*')
      .order('createdAt', { ascending: false });

    if (verifyError) {
      console.error('❌ Error verifying campaigns:', verifyError);
    } else {
      console.log(`✅ Found ${allCampaigns.length} campaigns in database:`);
      allCampaigns.forEach(campaign => {
        console.log(`   - ${campaign.title} (ID: ${campaign.id}, Active: ${campaign.isActive})`);
      });
    }

    console.log('\n🎉 Campaign creation process completed!');

  } catch (error) {
    console.error('❌ Error creating campaigns:', error);
  }
}

createCampaigns();