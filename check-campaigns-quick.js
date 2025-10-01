const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCampaigns() {
  try {
    const campaigns = await prisma.campaign.findMany();
    console.log('Available campaigns:');
    campaigns.forEach(c => {
      console.log(`- ID: ${c.id}`);
      console.log(`  Title: ${c.title}`);
      console.log(`  Active: ${c.isActive}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCampaigns();