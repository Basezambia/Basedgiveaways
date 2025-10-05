const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jltjkvrbhzsrredcazes.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdGprdnJiaHpzcnJlZGNhemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjQ0MjgsImV4cCI6MjA3NDc0MDQyOH0.nQmL-_EWAFk4dUGbOTwkUcMAOivS6CoWSPdM7tdMMco'

const supabase = createClient(supabaseUrl, supabaseKey)

async function restoreCampaignDescriptions() {
  try {
    console.log('🔄 Restoring original campaign descriptions in database...\n')
    
    // Restore Travis Scott campaign description
    console.log('Restoring TRAVIS campaign description...')
    const { data: travisData, error: travisError } = await supabase
      .from('campaigns')
      .update({
        description: "Travis Scott's Circus Maximus World Tour will land in South Africa on 11 October 2025 at FNB Stadium in Johannesburg, bringing his high-energy production, visuals, and chart-topping hits to fans as part of a global stadium run."
      })
      .eq('title', 'TRAVIS')
      .select()

    if (travisError) {
      console.error('❌ Error restoring Travis description:', travisError)
    } else {
      console.log('✅ Travis description restored successfully')
    }

    // Restore Ye campaign description
    console.log('Restoring YE campaign description...')
    const { data: yeData, error: yeError } = await supabase
      .from('campaigns')
      .update({
        description: "Ye (formerly Kanye West) is slated for a one-night concert in South Africa on 13 December 2025 at Ellis Park Stadium in Johannesburg — billed as his only African stop for the year and a landmark return to the country's live music scene."
      })
      .eq('title', 'YE')
      .select()

    if (yeError) {
      console.error('❌ Error restoring Ye description:', yeError)
    } else {
      console.log('✅ Ye description restored successfully')
    }

    // Verify the restoration
    console.log('\n🔍 Verifying restored descriptions...')
    const { data: campaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('title, description')
      .in('title', ['TRAVIS', 'YE'])
      .order('title')

    if (fetchError) {
      console.error('❌ Error fetching campaigns:', fetchError)
    } else {
      console.log('\n📊 Restored campaign descriptions:')
      campaigns.forEach(campaign => {
        console.log(`\n${campaign.title}:`)
        console.log(`  Description: ${campaign.description}`)
      })
    }

    console.log('\n🎉 Campaign descriptions restored successfully!')
    console.log('✨ Database now contains original event details!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

restoreCampaignDescriptions()