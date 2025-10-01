const { PrismaClient } = require('@prisma/client');

// Use regular Prisma client for direct database operations
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function createCampaigns() {
  try {
    console.log('🎯 Creating YE and TRAVIS campaigns directly...\n');
    
    await prisma.$connect();
    console.log('✅ Connected to database\n');
    
    // Check existing campaigns first
    const existingCampaigns = await prisma.campaign.findMany();
    console.log(`Found ${existingCampaigns.length} existing campaigns`);
    
    if (existingCampaigns.length > 0) {
      existingCampaigns.forEach(campaign => {
        console.log(`- ${campaign.title} (ID: ${campaign.id})`);
      });
      console.log('');
    }
    
    // Create YE Campaign
    console.log('Creating YE campaign...');
    const yeCampaign = await prisma.campaign.upsert({
      where: { id: '1' },
      update: {
        title: 'YE',
        description: 'WIN A FREE YE TICKET',
        imageUrl: '/campaign1.png',
        rules: 'Create a tweet tagging @yewest @kanyewest',
        isActive: true,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      create: {
        id: '1',
        title: 'YE',
        description: 'WIN A FREE YE TICKET',
        imageUrl: '/campaign1.png',
        rules: 'Create a tweet tagging @yewest @kanyewest',
        isActive: true,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }
    });
    console.log(`✅ YE Campaign created/updated: ${yeCampaign.id} - ${yeCampaign.title}`);
    
    // Create TRAVIS Campaign
    console.log('Creating TRAVIS campaign...');
    const travisCampaign = await prisma.campaign.upsert({
      where: { id: '2' },
      update: {
        title: 'TRAVIS',
        description: 'WIN A FREE TRAVIS TICKET',
        imageUrl: '/campaign2.png',
        rules: 'Create a tweet tagging @travisscott @ladylight',
        isActive: true,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      create: {
        id: '2',
        title: 'TRAVIS',
        description: 'WIN A FREE TRAVIS TICKET',
        imageUrl: '/campaign2.png',
        rules: 'Create a tweet tagging @travisscott @ladylight',
        isActive: true,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }
    });
    console.log(`✅ TRAVIS Campaign created/updated: ${travisCampaign.id} - ${travisCampaign.title}`);
    
    // Verify campaigns were created
    console.log('\n🔍 Verifying campaigns...');
    const allCampaigns = await prisma.campaign.findMany({
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });
    
    console.log(`\n🎉 Total campaigns in database: ${allCampaigns.length}`);
    allCampaigns.forEach(campaign => {
      console.log(`- ${campaign.title} (ID: ${campaign.id}) - ${campaign._count.submissions} submissions`);
      console.log(`  Active: ${campaign.isActive}, Ends: ${campaign.endTime?.toISOString() || 'No end time'}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating campaigns:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed.');
  }
}

createCampaigns();