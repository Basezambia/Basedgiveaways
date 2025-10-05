const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function updateCampaignDescriptions() {
  try {
    console.log('🔄 Updating campaign descriptions in database...')

    // Update Travis Scott campaign description
    const travisDescription = "Travis Scott's Circus Maximus World Tour will land in South Africa on 11 October 2025 at FNB Stadium in Johannesburg, bringing his high-energy production, visuals, and chart-topping hits to fans as part of a global stadium run."

    const { data: travisData, error: travisError } = await supabase
      .from('campaigns')
      .update({
        description: travisDescription
      })
      .eq('title', 'TRAVIS')

    if (travisError) {
      console.error('❌ Error updating Travis Scott description:', travisError)
    } else {
      console.log('✅ Travis Scott description updated successfully')
    }

    // Update Ye campaign description
    const yeDescription = "Ye (formerly Kanye West) is slated for a one-night concert in South Africa on 13 December 2025 at Ellis Park Stadium in Johannesburg — billed as his only African stop for the year and a landmark return to the country's live music scene."

    const { data: yeData, error: yeError } = await supabase
      .from('campaigns')
      .update({
        description: yeDescription
      })
      .eq('title', 'YE')

    if (yeError) {
      console.error('❌ Error updating Ye description:', yeError)
    } else {
      console.log('✅ Ye description updated successfully')
    }

    // Verify the updates
    console.log('\n🔍 Verifying description updates...')
    const { data: campaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('title, description')
      .in('title', ['TRAVIS', 'YE'])

    if (fetchError) {
      console.error('❌ Error fetching campaigns:', fetchError)
    } else {
      console.log('\n📊 Updated campaign descriptions:')
      campaigns.forEach(campaign => {
        console.log(`\n${campaign.title}:`)
        console.log(`  Description: ${campaign.description}`)
      })
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the update
updateCampaignDescriptions()