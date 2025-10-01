const { PrismaClient } = require('@prisma/client/edge');
const { withAccelerate } = require('@prisma/extension-accelerate');

const prisma = new PrismaClient().$extends(withAccelerate());

async function seedCampaigns() {
  try {
    console.log('🌱 Seeding campaigns...\n');
    
    // Check if campaigns already exist
    const existingCampaigns = await prisma.campaign.findMany();
    console.log(`Found ${existingCampaigns.length} existing campaigns`);
    
    // YE Campaign
    const yeCampaign = await prisma.campaign.upsert({
      where: { id: '1' },
      update: {},
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
    
    console.log(`✅ YE Campaign: ${yeCampaign.id} - ${yeCampaign.title}`);
    
    // TRAVIS Campaign
    const travisCampaign = await prisma.campaign.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        title: 'TRAVIS',
        description: 'WIN A FREE TRAVIS TICKET',
        imageUrl: '/campaign2.png',
        rules: 'Create a tweet tagging @travisscott @travisscott @ladylight',
        isActive: true,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }
    });
    
    console.log(`✅ TRAVIS Campaign: ${travisCampaign.id} - ${travisCampaign.title}`);
    
    // Verify campaigns were created
    const allCampaigns = await prisma.campaign.findMany({
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });
    
    console.log('\n📋 All campaigns in database:');
    allCampaigns.forEach(campaign => {
      console.log(`- ID: ${campaign.id}, Title: ${campaign.title}, Active: ${campaign.isActive}, Submissions: ${campaign._count.submissions}`);
    });
    
    console.log('\n🎉 Campaign seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding campaigns:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCampaigns();