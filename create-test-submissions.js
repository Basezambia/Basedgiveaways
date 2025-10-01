const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestSubmissions() {
  try {
    console.log('Creating test submissions...');

    // Get the campaign IDs
    const campaigns = await prisma.campaign.findMany();
    console.log('Found campaigns:', campaigns.map(c => ({ id: c.id, title: c.title })));

    if (campaigns.length === 0) {
      console.log('No campaigns found!');
      return;
    }

    const yeCampaign = campaigns.find(c => c.title === 'YE');
    const travisCampaign = campaigns.find(c => c.title === 'TRAVIS');

    if (!yeCampaign || !travisCampaign) {
      console.log('YE or TRAVIS campaign not found!');
      return;
    }

    // Create test submissions for YE campaign
    const yeSubmissions = [
      {
        campaignId: yeCampaign.id,
        name: 'Kanye Fan #1',
        email: 'kanyefan1@example.com',
        walletAddress: '0x1234567890123456789012345678901234567890',
        tweetUrl: 'https://twitter.com/user1/status/123456789',
        entryCount: 15,
        isVerified: true
      },
      {
        campaignId: yeCampaign.id,
        name: 'YE Supporter',
        email: 'yesupporter@example.com',
        walletAddress: '0x2345678901234567890123456789012345678901',
        tweetUrl: 'https://twitter.com/user2/status/123456790',
        entryCount: 12,
        isVerified: true
      },
      {
        campaignId: yeCampaign.id,
        name: 'West Coast Fan',
        email: 'westcoast@example.com',
        walletAddress: '0x3456789012345678901234567890123456789012',
        tweetUrl: 'https://twitter.com/user3/status/123456791',
        entryCount: 8,
        isVerified: false
      },
      {
        campaignId: yeCampaign.id,
        name: 'Chicago Represent',
        email: 'chicago@example.com',
        walletAddress: '0x4567890123456789012345678901234567890123',
        tweetUrl: 'https://twitter.com/user4/status/123456792',
        entryCount: 20,
        isVerified: true
      },
      {
        campaignId: yeCampaign.id,
        name: 'Donda Listener',
        email: 'donda@example.com',
        walletAddress: '0x5678901234567890123456789012345678901234',
        tweetUrl: 'https://twitter.com/user5/status/123456793',
        entryCount: 5,
        isVerified: false
      }
    ];

    // Create test submissions for TRAVIS campaign
    const travisSubmissions = [
      {
        campaignId: travisCampaign.id,
        name: 'Astroworld Visitor',
        email: 'astroworld@example.com',
        walletAddress: '0x6789012345678901234567890123456789012345',
        tweetUrl: 'https://twitter.com/user6/status/123456794',
        entryCount: 18,
        isVerified: true
      },
      {
        campaignId: travisCampaign.id,
        name: 'Cactus Jack Fan',
        email: 'cactusjack@example.com',
        walletAddress: '0x7890123456789012345678901234567890123456',
        tweetUrl: 'https://twitter.com/user7/status/123456795',
        entryCount: 14,
        isVerified: true
      },
      {
        campaignId: travisCampaign.id,
        name: 'Houston Native',
        email: 'houston@example.com',
        walletAddress: '0x8901234567890123456789012345678901234567',
        tweetUrl: 'https://twitter.com/user8/status/123456796',
        entryCount: 10,
        isVerified: false
      },
      {
        campaignId: travisCampaign.id,
        name: 'Sicko Mode',
        email: 'sickomode@example.com',
        walletAddress: '0x9012345678901234567890123456789012345678',
        tweetUrl: 'https://twitter.com/user9/status/123456797',
        entryCount: 22,
        isVerified: true
      }
    ];

    // Insert all submissions
    const allSubmissions = [...yeSubmissions, ...travisSubmissions];
    
    for (const submission of allSubmissions) {
      await prisma.submission.create({
        data: submission
      });
      console.log(`Created submission for ${submission.name} in ${submission.campaignId === yeCampaign.id ? 'YE' : 'TRAVIS'} campaign`);
    }

    console.log('\n✅ Test submissions created successfully!');
    
    // Verify submissions were created
    const yeCount = await prisma.submission.count({ where: { campaignId: yeCampaign.id } });
    const travisCount = await prisma.submission.count({ where: { campaignId: travisCampaign.id } });
    
    console.log(`\nVerification:`);
    console.log(`YE campaign submissions: ${yeCount}`);
    console.log(`TRAVIS campaign submissions: ${travisCount}`);

  } catch (error) {
    console.error('Error creating test submissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSubmissions();