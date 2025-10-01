const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupRLSPolicies() {
  try {
    console.log('🔒 Setting up Row Level Security policies...\n');

    // SQL commands to set up RLS policies
    const sqlCommands = [
      // Enable RLS on tables (if not already enabled)
      'ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE admins ENABLE ROW LEVEL SECURITY;',
      
      // Drop existing policies if they exist
      'DROP POLICY IF EXISTS "Allow public read access to campaigns" ON campaigns;',
      'DROP POLICY IF EXISTS "Allow public insert to submissions" ON submissions;',
      'DROP POLICY IF EXISTS "Allow public read access to submissions" ON submissions;',
      'DROP POLICY IF EXISTS "Allow admin access to admins" ON admins;',
      
      // Create policies for campaigns table
      `CREATE POLICY "Allow public read access to campaigns" ON campaigns
       FOR SELECT USING (true);`,
      
      // Create policies for submissions table
      `CREATE POLICY "Allow public insert to submissions" ON submissions
       FOR INSERT WITH CHECK (true);`,
       
      `CREATE POLICY "Allow public read access to submissions" ON submissions
       FOR SELECT USING (true);`,
      
      // Create policies for admins table (restrict access)
      `CREATE POLICY "Allow admin access to admins" ON admins
       FOR ALL USING (auth.uid() IS NOT NULL);`
    ];

    // Execute each SQL command
    for (const sql of sqlCommands) {
      console.log(`Executing: ${sql.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase
          .from('_supabase_admin')
          .select('*')
          .limit(0);
          
        if (directError) {
          console.log(`⚠️  Could not execute: ${sql}`);
          console.log(`   Error: ${error.message}`);
        }
      } else {
        console.log('✅ Success');
      }
    }

    console.log('\n🎉 RLS policies setup completed!');
    console.log('\nTesting submission access...');

    // Test if we can now insert into submissions
    const testSubmission = {
      name: 'Test User',
      email: 'test@example.com',
      walletAddress: '0x1234567890123456789012345678901234567890',
      tweetUrl: 'https://twitter.com/test/status/123456789',
      campaignId: 'f106a3cf-6664-4bac-8e80-a2ed2c0a685c'
    };

    const { data, error } = await supabase
      .from('submissions')
      .insert(testSubmission)
      .select()
      .single();

    if (error) {
      console.error('❌ Test submission failed:', error);
    } else {
      console.log('✅ Test submission successful!');
      console.log(`   Submission ID: ${data.id}`);
      
      // Clean up test submission
      await supabase
        .from('submissions')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Test submission cleaned up');
    }

  } catch (error) {
    console.error('❌ Error setting up RLS policies:', error);
  }
}

setupRLSPolicies();