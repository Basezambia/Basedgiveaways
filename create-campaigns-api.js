const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function createCampaigns() {
  console.log('🎯 Creating YE and TRAVIS campaigns via API...\n');

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
      rules: 'Create a tweet tagging @travisscott @travisscott @ladylight',
      isActive: true,
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    }
  ];

  for (const campaignData of campaigns) {
    try {
      console.log(`Creating ${campaignData.title} campaign...`);
      
      const response = await fetch(`${BASE_URL}/api/admin/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(campaignData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${campaignData.title} campaign created successfully!`);
        console.log(`   ID: ${data.campaign.id}`);
        console.log(`   Title: ${data.campaign.title}`);
        console.log(`   Active: ${data.campaign.isActive}`);
      } else {
        console.log(`❌ Failed to create ${campaignData.title} campaign: ${data.error}`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`⚠️  Server not running - cannot create ${campaignData.title} campaign`);
        console.log('   Start the development server with: npm run dev');
        return;
      } else {
        console.log(`❌ Error creating ${campaignData.title} campaign: ${error.message}`);
      }
    }
    console.log('');
  }

  // Verify campaigns were created
  try {
    console.log('🔍 Verifying created campaigns...');
    const response = await fetch(`${BASE_URL}/api/admin/campaigns`, {
      headers: {
        'Authorization': 'Bearer admin-token'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.campaigns.length} campaigns in database:`);
      data.campaigns.forEach(campaign => {
        console.log(`   - ${campaign.title} (ID: ${campaign.id}, Active: ${campaign.isActive})`);
      });
    }
  } catch (error) {
    console.log(`❌ Error verifying campaigns: ${error.message}`);
  }

  console.log('\n🎉 Campaign creation process completed!');
}

createCampaigns();