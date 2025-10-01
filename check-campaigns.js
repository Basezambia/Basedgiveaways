const { PrismaClient } = require('@prisma/client/edge');
const { withAccelerate } = require('@prisma/extension-accelerate');

const prisma = new PrismaClient().$extends(withAccelerate());

async function checkCampaigns() {
  try {
    console.log('🔍 Checking campaigns in database...\n');
    
    const campaigns = await prisma.campaign.findMany({
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });
    
    console.log(`Found ${campaigns.length} campaigns:`);
    
    if (campaigns.length === 0) {
      console.log('❌ No campaigns found in database');
    } else {
      campaigns.forEach(campaign => {
        console.log(`- ID: ${campaign.id}`);
        console.log(`  Title: ${campaign.title}`);
        console.log(`  Active: ${campaign.isActive}`);
        console.log(`  Submissions: ${campaign._count.submissions}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking campaigns:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCampaigns();