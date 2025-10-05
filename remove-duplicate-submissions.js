const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with correct credentials
const supabase = createClient(
  'https://jltjkvrbhzsrredcazes.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdGprdnJiaHpzcnJlZGNhemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjQ0MjgsImV4cCI6MjA3NDc0MDQyOH0.nQmL-_EWAFk4dUGbOTwkUcMAOivS6CoWSPdM7tdMMco'
);

async function removeDuplicateSubmissions() {
  try {
    console.log('🔍 Checking for duplicate submissions...\n');

    // Get all submissions ordered by creation date
    const { data: allSubmissions, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .order('createdAt', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching submissions:', fetchError);
      return;
    }

    console.log(`📊 Total submissions found: ${allSubmissions.length}`);
    
    if (allSubmissions.length === 0) {
      console.log('ℹ️ No submissions found in the database.');
      return;
    }

    // Group submissions by email and wallet address to find duplicates
    const submissionGroups = {};
    
    allSubmissions.forEach(submission => {
      const key = `${submission.email.toLowerCase()}_${submission.walletAddress.toLowerCase()}`;
      
      if (!submissionGroups[key]) {
        submissionGroups[key] = [];
      }
      submissionGroups[key].push(submission);
    });

    // Find duplicates (groups with more than 1 submission)
    const duplicateGroups = Object.entries(submissionGroups).filter(([key, submissions]) => submissions.length > 1);
    
    console.log(`\n🔍 Found ${duplicateGroups.length} duplicate groups:`);
    
    if (duplicateGroups.length === 0) {
      console.log('✅ No duplicates found! Database is clean.');
      return;
    }

    let totalToRemove = 0;
    const submissionsToRemove = [];

    duplicateGroups.forEach(([key, submissions], groupIndex) => {
      console.log(`\n📋 Duplicate Group ${groupIndex + 1}:`);
      console.log(`   Email/Wallet: ${submissions[0].email} / ${submissions[0].walletAddress}`);
      console.log(`   Total submissions: ${submissions.length}`);
      
      // Sort by creation date to keep the first one
      submissions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      console.log(`   📌 KEEPING: ${submissions[0].name} - Campaign: ${submissions[0].campaignId} - Created: ${new Date(submissions[0].createdAt).toLocaleString()}`);
      
      // Mark the rest for removal
      for (let i = 1; i < submissions.length; i++) {
        const submission = submissions[i];
        console.log(`   🗑️ REMOVING: ${submission.name} - Campaign: ${submission.campaignId} - Created: ${new Date(submission.createdAt).toLocaleString()}`);
        submissionsToRemove.push(submission.id);
        totalToRemove++;
      }
    });

    if (totalToRemove === 0) {
      console.log('\n✅ No duplicates to remove.');
      return;
    }

    console.log(`\n⚠️ About to remove ${totalToRemove} duplicate submissions.`);
    console.log('🔄 Proceeding with removal...');

    // Remove duplicate submissions
    const { error: deleteError } = await supabase
      .from('submissions')
      .delete()
      .in('id', submissionsToRemove);

    if (deleteError) {
      console.error('❌ Error removing duplicate submissions:', deleteError);
      return;
    }

    console.log(`✅ Successfully removed ${totalToRemove} duplicate submissions!`);

    // Verify the cleanup
    console.log('\n🔍 Verifying cleanup...');
    const { data: remainingSubmissions, error: verifyError } = await supabase
      .from('submissions')
      .select('*')
      .order('createdAt', { ascending: true });

    if (verifyError) {
      console.error('❌ Error verifying cleanup:', verifyError);
    } else {
      console.log(`📊 Remaining submissions: ${remainingSubmissions.length}`);
      
      console.log('\n📋 Final submissions list:');
      remainingSubmissions.forEach((submission, index) => {
        console.log(`${index + 1}. ${submission.name} (${submission.email})`);
        console.log(`   Wallet: ${submission.walletAddress}`);
        console.log(`   Campaign: ${submission.campaignId}`);
        console.log(`   Created: ${new Date(submission.createdAt).toLocaleString()}`);
        console.log('   ---');
      });
    }

    console.log('\n🎉 Duplicate removal completed successfully!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

removeDuplicateSubmissions();