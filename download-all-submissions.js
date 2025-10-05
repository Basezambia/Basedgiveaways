const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase client with correct credentials
const supabase = createClient(
  'https://jltjkvrbhzsrredcazes.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdGprdnJiaHpzcnJlZGNhemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjQ0MjgsImV4cCI6MjA3NDc0MDQyOH0.nQmL-_EWAFk4dUGbOTwkUcMAOivS6CoWSPdM7tdMMco'
);

async function downloadAllSubmissions() {
  try {
    console.log('📥 Downloading all submissions from the database...\n');

    // Get all submissions with campaign information
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select(`
        *,
        campaigns!inner(
          id,
          title,
          description
        )
      `)
      .order('createdAt', { ascending: true });

    if (error) {
      console.error('❌ Error fetching submissions:', error);
      return;
    }

    console.log(`📊 Total submissions found: ${submissions.length}`);
    
    if (submissions.length === 0) {
      console.log('ℹ️ No submissions found in the database.');
      return;
    }

    // Display all submissions
    console.log('\n📋 All submissions:');
    submissions.forEach((submission, index) => {
      console.log(`${index + 1}. Name: ${submission.name}`);
      console.log(`   Email: ${submission.email}`);
      console.log(`   Wallet: ${submission.walletAddress}`);
      console.log(`   Campaign: ${submission.campaigns.title}`);
      console.log(`   Entries: ${submission.entryCount}`);
      console.log(`   Verified: ${submission.isVerified}`);
      console.log(`   Created: ${new Date(submission.createdAt).toLocaleString()}`);
      if (submission.tweetUrl) {
        console.log(`   Tweet URL: ${submission.tweetUrl}`);
      }
      console.log('   ---');
    });

    // Save to JSON file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `submissions-backup-${timestamp}.json`;
    
    const backupData = {
      exportDate: new Date().toISOString(),
      totalSubmissions: submissions.length,
      submissions: submissions
    };

    fs.writeFileSync(filename, JSON.stringify(backupData, null, 2));
    console.log(`\n💾 Backup saved to: ${filename}`);

    // Save to CSV file for easier viewing
    const csvFilename = `submissions-backup-${timestamp}.csv`;
    const csvHeaders = 'Index,Name,Email,Wallet Address,Campaign,Entries,Verified,Created Date,Tweet URL\n';
    const csvRows = submissions.map((submission, index) => {
      return [
        index + 1,
        `"${submission.name}"`,
        `"${submission.email}"`,
        `"${submission.walletAddress}"`,
        `"${submission.campaigns.title}"`,
        submission.entryCount,
        submission.isVerified,
        `"${new Date(submission.createdAt).toLocaleString()}"`,
        `"${submission.tweetUrl || ''}"`
      ].join(',');
    }).join('\n');

    fs.writeFileSync(csvFilename, csvHeaders + csvRows);
    console.log(`📊 CSV backup saved to: ${csvFilename}`);

    console.log('\n✅ All submissions downloaded successfully!');
    
    return submissions;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

downloadAllSubmissions();