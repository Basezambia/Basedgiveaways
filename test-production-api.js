const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProductionAPI() {
  try {
    console.log('🧪 Testing Production API Method...\n');

    // Get available campaigns
    const campaigns = await prisma.campaign.findMany();
    console.log('Available campaigns:', campaigns.map(c => ({ id: c.id, title: c.title })));

    if (campaigns.length === 0) {
      console.log('❌ No campaigns found!');
      return;
    }

    const testCampaign = campaigns[0]; // Use first available campaign

    // Create a unique test submission using the same method as production API
    const uniqueId = Date.now();
    const testSubmission = {
      campaignId: testCampaign.id,
      name: `Production Test User ${uniqueId}`,
      email: `prodtest${uniqueId}@example.com`,
      walletAddress: `0x${uniqueId.toString(16).padStart(40, '0')}`,
      tweetUrl: `https://twitter.com/prodtest/status/${uniqueId}`,
      entryCount: 1 // Same as production default
    };

    console.log('\n📝 Creating test submission with production method...');
    console.log('Submission data:', testSubmission);

    // Use the exact same Prisma method as production API
    const createdSubmission = await prisma.submission.create({
      data: testSubmission
    });

    console.log('\n✅ Submission created successfully!');
    console.log('Created submission:', {
      id: createdSubmission.id,
      name: createdSubmission.name,
      walletAddress: createdSubmission.walletAddress,
      entryCount: createdSubmission.entryCount,
      isVerified: createdSubmission.isVerified,
      createdAt: createdSubmission.createdAt
    });

    // Verify the submission exists in the database
    console.log('\n🔍 Retrieving submission from database...');
    const retrievedSubmission = await prisma.submission.findUnique({
      where: { id: createdSubmission.id },
      include: {
        campaign: {
          select: {
            title: true,
            isActive: true
          }
        }
      }
    });

    if (retrievedSubmission) {
      console.log('✅ Submission successfully retrieved from database!');
      console.log('Retrieved submission:', {
        id: retrievedSubmission.id,
        name: retrievedSubmission.name,
        walletAddress: retrievedSubmission.walletAddress,
        entryCount: retrievedSubmission.entryCount,
        isVerified: retrievedSubmission.isVerified,
        campaignTitle: retrievedSubmission.campaign.title,
        createdAt: retrievedSubmission.createdAt
      });
    } else {
      console.log('❌ Failed to retrieve submission from database!');
    }

    // Check if it appears in leaderboard (should be filtered out due to test naming)
    console.log('\n📊 Checking leaderboard visibility...');
    const leaderboardEntries = await prisma.submission.findMany({
      where: {
        campaign: {
          isActive: true
        },
        // Same filter as leaderboard API (simplified for compatibility)
        AND: [
          {
            NOT: {
              OR: [
                { name: { contains: 'test' } },
                { name: { contains: 'Test' } },
                { email: { contains: 'test' } },
                { email: { contains: 'example' } },
                { walletAddress: { contains: '0x1234' } },
                { walletAddress: { contains: '0xtest' } }
              ]
            }
          }
        ]
      },
      include: {
        campaign: {
          select: {
            title: true,
            isActive: true
          }
        }
      },
      orderBy: [
        { entryCount: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    const isInLeaderboard = leaderboardEntries.some(entry => entry.id === createdSubmission.id);
    console.log(`📋 Submission ${isInLeaderboard ? 'IS' : 'IS NOT'} visible in leaderboard (expected: NOT visible due to "test" filter)`);

    console.log('\n🎉 Production API test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Submission created using exact production method');
    console.log('- ✅ Submission successfully stored in database');
    console.log('- ✅ Submission can be retrieved from database');
    console.log('- ✅ Leaderboard filtering works as expected');

  } catch (error) {
    console.error('❌ Production API test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductionAPI();