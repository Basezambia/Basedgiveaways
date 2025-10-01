const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function updateCampaignsWithEventDetails() {
  try {
    console.log('🎯 Updating campaigns with event details...\n');
    
    await prisma.$connect();
    console.log('✅ Connected to database\n');
    
    // Update YE campaign
    console.log('Updating YE campaign with event details...');
    const yeCampaign = await prisma.campaign.updateMany({
      where: { title: 'YE' },
      data: {
        eventDate: new Date('2025-12-13T20:30:00'),
        location: 'Ellis Park Stadium, Johannesburg',
        artist: 'Kanye West (YE)'
      }
    });
    console.log(`✅ Updated ${yeCampaign.count} YE campaign(s)`);
    
    // Update TRAVIS campaign
    console.log('Updating TRAVIS campaign with event details...');
    const travisCampaign = await prisma.campaign.updateMany({
      where: { title: 'TRAVIS' },
      data: {
        eventDate: new Date('2025-10-11T20:30:00'),
        location: 'FNB Stadium, Johannesburg',
        artist: 'Travis Scott'
      }
    });
    console.log(`✅ Updated ${travisCampaign.count} TRAVIS campaign(s)`);
    
    // Verify updates
    console.log('\n📋 Updated campaigns:');
    const allCampaigns = await prisma.campaign.findMany({
      select: {
        id: true,
        title: true,
        eventDate: true,
        location: true,
        artist: true
      }
    });
    
    allCampaigns.forEach(campaign => {
      console.log(`- ${campaign.title}:`);
      console.log(`  Event Date: ${campaign.eventDate}`);
      console.log(`  Location: ${campaign.location}`);
      console.log(`  Artist: ${campaign.artist}`);
      console.log('');
    });
    
    console.log('🎉 Campaign event details update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating campaigns:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCampaignsWithEventDetails();