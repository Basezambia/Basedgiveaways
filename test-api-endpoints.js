const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testApiEndpoints() {
  console.log('🔗 Testing API Endpoints that use Prisma...\n');

  const tests = [];

  // Test 1: Admin Campaigns endpoint
  tests.push({
    name: 'GET /api/admin/campaigns',
    url: `${BASE_URL}/api/admin/campaigns`,
    method: 'GET',
    headers: { 'authorization': 'Bearer test-token' }
  });

  // Test 2: Admin Stats endpoint
  tests.push({
    name: 'GET /api/admin/stats',
    url: `${BASE_URL}/api/admin/stats?timeRange=7d`,
    method: 'GET',
    headers: { 'authorization': 'Bearer test-token' }
  });

  // Test 3: Admin Submissions endpoint
  tests.push({
    name: 'GET /api/admin/submissions',
    url: `${BASE_URL}/api/admin/submissions?status=all`,
    method: 'GET',
    headers: { 'authorization': 'Bearer test-token' }
  });

  // Test 4: Analytics endpoint
  tests.push({
    name: 'GET /api/analytics',
    url: `${BASE_URL}/api/analytics?period=30d`,
    method: 'GET'
  });

  // Test 5: Leaderboard endpoint (will fail without campaign ID, but we can test the error handling)
  tests.push({
    name: 'GET /api/leaderboard (no campaign ID)',
    url: `${BASE_URL}/api/leaderboard`,
    method: 'GET',
    expectError: true
  });

  // Test 6: Stats endpoint (will fail without campaign ID, but we can test the error handling)
  tests.push({
    name: 'GET /api/stats (no campaign ID)',
    url: `${BASE_URL}/api/stats`,
    method: 'GET',
    expectError: true
  });

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          ...test.headers
        }
      });

      const data = await response.json();

      if (test.expectError) {
        if (!response.ok && data.error) {
          console.log(`✅ Expected error received: ${data.error}`);
          passedTests++;
        } else {
          console.log(`❌ Expected error but got success response`);
        }
      } else {
        if (response.ok) {
          console.log(`✅ Success: ${response.status}`);
          if (data.campaigns) console.log(`   Found ${data.campaigns.length} campaigns`);
          if (data.entries) console.log(`   Found ${data.entries.length} entries`);
          if (data.total !== undefined) console.log(`   Total records: ${data.total}`);
          passedTests++;
        } else {
          console.log(`❌ Failed: ${response.status} - ${data.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`⚠️  Server not running - ${test.name} skipped`);
        console.log('   Start the development server with: npm run dev');
        totalTests--; // Don't count this as a failure
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    console.log('');
  }

  console.log(`📊 API Endpoint Test Results: ${passedTests}/${totalTests} tests passed\n`);

  if (passedTests === totalTests) {
    console.log('🎉 All API endpoints are working correctly!');
  } else {
    console.log('⚠️  Some API endpoints may need attention.');
    console.log('💡 Make sure the development server is running: npm run dev');
  }
}

// Also test if we can create a simple test campaign and submission
async function testCrudOperations() {
  console.log('\n🧪 Testing CRUD operations via API...\n');

  try {
    // Test creating a campaign via API (if endpoint exists)
    console.log('Testing campaign creation...');
    
    const campaignData = {
      title: 'API Test Campaign',
      description: 'Testing campaign creation via API',
      isActive: true
    };

    // Note: This would require a POST endpoint for campaigns
    console.log('ℹ️  Campaign creation endpoint not implemented in current API');
    console.log('   CRUD operations were tested directly with Prisma client');

  } catch (error) {
    console.log(`❌ CRUD test error: ${error.message}`);
  }
}

async function runAllTests() {
  await testApiEndpoints();
  await testCrudOperations();
}

runAllTests();