const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addEventColumns() {
  try {
    console.log('Adding event details columns to campaigns table...');
    
    // Add eventDate column
    console.log('Adding eventDate column...');
    const { error: eventDateError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS "eventDate" timestamp with time zone;'
    });
    
    if (eventDateError) {
      console.error('Error adding eventDate column:', eventDateError);
    } else {
      console.log('✓ eventDate column added successfully');
    }

    // Add location column
    console.log('Adding location column...');
    const { error: locationError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS "location" text;'
    });
    
    if (locationError) {
      console.error('Error adding location column:', locationError);
    } else {
      console.log('✓ location column added successfully');
    }

    // Add artist column
    console.log('Adding artist column...');
    const { error: artistError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS "artist" text;'
    });
    
    if (artistError) {
      console.error('Error adding artist column:', artistError);
    } else {
      console.log('✓ artist column added successfully');
    }

    console.log('\nAll event details columns added successfully!');

  } catch (error) {
    console.error('Error:', error);
  }
}

addEventColumns();