const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDatabase() {
  console.log('🔍 Testing Prisma Database Connection...\n');

  try {
    // Test 1: Database Connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Test 2: Check existing data
    console.log('2. Checking existing data...');
    
    const userCount = await prisma.user.count();
    console.log(`   Users in database: ${userCount}`);
    
    const campaignCount = await prisma.campaign.count();
    console.log(`   Campaigns in database: ${campaignCount}`);
    
    const submissionCount = await prisma.submission.count();
    console.log(`   Submissions in database: ${submissionCount}`);
    
    const postCount = await prisma.post.count();
    console.log(`   Posts in database: ${postCount}\n`);

    // Test 3: Create a test user
    console.log('3. Testing CREATE operation...');
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User'
      }
    });
    console.log(`✅ Created test user with ID: ${testUser.id}\n`);

    // Test 4: Read the created user
    console.log('4. Testing READ operation...');
    const foundUser = await prisma.user.findUnique({
      where: { id: testUser.id }
    });
    console.log(`✅ Found user: ${foundUser.name} (${foundUser.email})\n`);

    // Test 5: Update the user
    console.log('5. Testing UPDATE operation...');
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { name: 'Updated Test User' }
    });
    console.log(`✅ Updated user name to: ${updatedUser.name}\n`);

    // Test 6: Create a test campaign
    console.log('6. Testing Campaign creation...');
    const testCampaign = await prisma.campaign.create({
      data: {
        title: 'Test Campaign',
        description: 'This is a test campaign',
        isActive: true
      }
    });
    console.log(`✅ Created test campaign with ID: ${testCampaign.id}\n`);

    // Test 7: Create a test submission
    console.log('7. Testing Submission creation...');
    const testSubmission = await prisma.submission.create({
      data: {
        name: 'Test Submitter',
        email: `submitter-${Date.now()}@example.com`,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        campaignId: testCampaign.id
      }
    });
    console.log(`✅ Created test submission with ID: ${testSubmission.id}\n`);

    // Test 8: Test relationships
    console.log('8. Testing relationships...');
    const campaignWithSubmissions = await prisma.campaign.findUnique({
      where: { id: testCampaign.id },
      include: { submissions: true }
    });
    console.log(`✅ Campaign has ${campaignWithSubmissions.submissions.length} submission(s)\n`);

    // Test 9: Clean up test data
    console.log('9. Cleaning up test data...');
    await prisma.submission.delete({ where: { id: testSubmission.id } });
    await prisma.campaign.delete({ where: { id: testCampaign.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All Prisma database tests passed successfully!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed.');
  }
}

testDatabase();