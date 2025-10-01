const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkExistingData() {
  console.log('📊 Checking existing data in the database...\n');

  try {
    await prisma.$connect();

    // Check Users
    console.log('👥 USERS:');
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log(`   Total users: ${await prisma.user.count()}`);
    if (users.length > 0) {
      console.log('   Recent users:');
      users.forEach(user => {
        console.log(`   - ${user.name || 'No name'} (${user.email}) - Created: ${user.createdAt.toISOString()}`);
      });
    } else {
      console.log('   No users found');
    }
    console.log('');

    // Check Campaigns
    console.log('🎯 CAMPAIGNS:');
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    });
    console.log(`   Total campaigns: ${await prisma.campaign.count()}`);
    if (campaigns.length > 0) {
      console.log('   Recent campaigns:');
      campaigns.forEach(campaign => {
        console.log(`   - "${campaign.title}" (${campaign.isActive ? 'Active' : 'Inactive'}) - ${campaign._count.submissions} submissions`);
        console.log(`     Created: ${campaign.createdAt.toISOString()}`);
        if (campaign.endTime) {
          console.log(`     Ends: ${campaign.endTime.toISOString()}`);
        }
      });
    } else {
      console.log('   No campaigns found');
    }
    console.log('');

    // Check Submissions
    console.log('📝 SUBMISSIONS:');
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        campaign: {
          select: { title: true }
        }
      }
    });
    console.log(`   Total submissions: ${await prisma.submission.count()}`);
    if (submissions.length > 0) {
      console.log('   Recent submissions:');
      submissions.forEach(submission => {
        console.log(`   - ${submission.name} (${submission.email})`);
        console.log(`     Campaign: "${submission.campaign.title}"`);
        console.log(`     Wallet: ${submission.walletAddress}`);
        console.log(`     Verified: ${submission.isVerified ? 'Yes' : 'No'}`);
        console.log(`     Created: ${submission.createdAt.toISOString()}`);
        console.log('');
      });
    } else {
      console.log('   No submissions found');
    }

    // Check Posts
    console.log('📄 POSTS:');
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log(`   Total posts: ${await prisma.post.count()}`);
    if (posts.length > 0) {
      console.log('   Recent posts:');
      posts.forEach(post => {
        console.log(`   - "${post.title}" (${post.published ? 'Published' : 'Draft'})`);
        console.log(`     Created: ${post.createdAt.toISOString()}`);
      });
    } else {
      console.log('   No posts found');
    }
    console.log('');

    // Database statistics
    console.log('📈 DATABASE STATISTICS:');
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.campaign.count(),
      prisma.submission.count(),
      prisma.post.count(),
      prisma.campaign.count({ where: { isActive: true } }),
      prisma.submission.count({ where: { isVerified: true } })
    ]);

    console.log(`   Total records: ${stats[0] + stats[1] + stats[2] + stats[3]}`);
    console.log(`   Active campaigns: ${stats[4]}`);
    console.log(`   Verified submissions: ${stats[5]}`);

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkExistingData();