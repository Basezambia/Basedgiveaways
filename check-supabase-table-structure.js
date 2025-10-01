const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  try {
    console.log('Checking campaigns table structure...');
    
    // Use raw SQL to get table information
    const { data: columns, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'campaigns' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    });

    if (error) {
      console.error('Error fetching table structure with RPC:', error);
      
      // Fallback: try to get a sample record to see what columns exist
      console.log('Trying fallback method...');
      const { data: sampleData, error: sampleError } = await supabase
        .from('campaigns')
        .select('*')
        .limit(1);

      if (sampleError) {
        console.error('Error fetching sample data:', sampleError);
      } else {
        console.log('Sample record structure:');
        if (sampleData && sampleData.length > 0) {
          console.log('Available columns:', Object.keys(sampleData[0]));
          console.log('Sample data:', sampleData[0]);
        } else {
          console.log('No records found');
        }
      }
      return;
    }

    console.log('Current campaigns table columns:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkTableStructure();