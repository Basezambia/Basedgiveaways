const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSupabaseData() {
  try {
    console.log('🔍 Checking Supabase database data...\n');

    // Check campaigns
    const campaigns = await prisma.campaign.findMany();
    console.log('📋 Campaigns found:', campaigns.length);
    campaigns.forEach(campaign => {
      console.log(`  - ${campaign.title} (ID: ${campaign.id}) - Active: ${campaign.isActive}`);
    });

    // Check submissions
    const submissions = await prisma.submission.findMany({
      include: {
        campaign: {
          select: {
            title: true,
            isActive: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('\n📝 Submissions found:', submissions.length);
    
    if (submissions.length === 0) {
      console.log('❌ No submissions found in the database!');
    } else {
      console.log('\nRecent submissions:');
      submissions.slice(0, 10).forEach((submission, index) => {
        console.log(`  ${index + 1}. ${submission.name} (${submission.walletAddress})`);
        console.log(`     Campaign: ${submission.campaign.title}`);
        console.log(`     Entries: ${submission.entryCount}, Verified: ${submission.isVerified}`);
        console.log(`     Created: ${submission.createdAt}`);
        console.log('');
      });
    }

    // Check database connection
    console.log('🔗 Testing database connection...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful');

    // Check table structure
    console.log('\n🏗️ Checking table structure...');
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'Submission' 
      ORDER BY ordinal_position
    `;
    console.log('Submission table columns:', tableInfo);

  } catch (error) {
    console.error('❌ Error checking Supabase data:', error);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Database connection failed. Check your DATABASE_URL in .env.local');
    } else if (error.code === 'P2021') {
      console.log('\n💡 Table does not exist. You may need to run migrations.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkSupabaseData();