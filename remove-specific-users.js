const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with correct credentials
const supabase = createClient(
  'https://jltjkvrbhzsrredcazes.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdGprdnJiaHpzcnJlZGNhemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjQ0MjgsImV4cCI6MjA3NDc0MDQyOH0.nQmL-_EWAFk4dUGbOTwkUcMAOivS6CoWSPdM7tdMMco'
);

async function removeSpecificUsers() {
  try {
    console.log('🎯 Removing specific users from the database...\n');

    const usersToRemove = ['liseli', 'lrmnd', 'frank'];
    
    // First, find the users to be removed
    console.log('🔍 Finding users to remove...');
    const { data: usersFound, error: findError } = await supabase
      .from('submissions')
      .select('id, name, email, walletAddress, createdAt')
      .in('name', usersToRemove);

    if (findError) {
      console.error('❌ Error finding users:', findError);
      return;
    }

    console.log(`📊 Found ${usersFound.length} users matching the criteria:`);
    usersFound.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Created: ${new Date(user.createdAt).toLocaleString()}`);
    });

    if (usersFound.length === 0) {
      console.log('ℹ️ No users found with the specified names.');
      return;
    }

    // Remove the users
    console.log('\n🗑️ Removing users...');
    const userIds = usersFound.map(user => user.id);
    
    const { error: deleteError } = await supabase
      .from('submissions')
      .delete()
      .in('id', userIds);

    if (deleteError) {
      console.error('❌ Error removing users:', deleteError);
      return;
    }

    console.log(`✅ Successfully removed ${usersFound.length} users!`);

    // Verify the removal
    console.log('\n🔍 Verifying removal...');
    const { data: remainingUsers, error: verifyError } = await supabase
      .from('submissions')
      .select('id, name, email, createdAt')
      .in('name', usersToRemove);

    if (verifyError) {
      console.error('❌ Error verifying removal:', verifyError);
    } else {
      if (remainingUsers.length === 0) {
        console.log('✅ All specified users have been successfully removed!');
      } else {
        console.log(`⚠️ ${remainingUsers.length} users with matching names still exist:`);
        remainingUsers.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name} (${user.email})`);
        });
      }
    }

    // Show current leaderboard status
    console.log('\n📋 Current submissions after removal:');
    const { data: allSubmissions, error: allError } = await supabase
      .from('submissions')
      .select('id, name, email, walletAddress, createdAt')
      .order('createdAt', { ascending: true });

    if (allError) {
      console.error('❌ Error fetching remaining submissions:', allError);
    } else {
      console.log(`📊 Total remaining submissions: ${allSubmissions.length}`);
      allSubmissions.forEach((submission, index) => {
        console.log(`${index + 1}. ${submission.name} (${submission.email}) - Created: ${new Date(submission.createdAt).toLocaleString()}`);
      });
    }

    console.log('\n🎉 User removal completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

removeSpecificUsers();