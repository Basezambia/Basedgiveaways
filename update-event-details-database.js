const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function updateEventDetails() {
  try {
    console.log('🔄 Updating event details in database...')

    // Update Travis Scott event details
    const { data: travisData, error: travisError } = await supabase
      .from('campaigns')
      .update({
        eventDate: '2025-10-11T19:00:00.000Z', // October 11, 2025
        location: 'FNB Stadium, Johannesburg',
        artist: 'TRAVIS SCOTT'
      })
      .eq('title', 'TRAVIS')

    if (travisError) {
      console.error('❌ Error updating Travis Scott:', travisError)
    } else {
      console.log('✅ Travis Scott event details updated successfully')
    }

    // Update Ye event details
    const { data: yeData, error: yeError } = await supabase
      .from('campaigns')
      .update({
        eventDate: '2025-12-13T19:00:00.000Z', // December 13, 2025
        location: 'Ellis Park Stadium, Johannesburg',
        artist: 'YE'
      })
      .eq('title', 'YE')

    if (yeError) {
      console.error('❌ Error updating Ye:', yeError)
    } else {
      console.log('✅ Ye event details updated successfully')
    }

    // Verify the updates
    console.log('\n🔍 Verifying updates...')
    const { data: campaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('title, eventDate, location, artist')
      .in('title', ['TRAVIS', 'YE'])

    if (fetchError) {
      console.error('❌ Error fetching campaigns:', fetchError)
    } else {
      console.log('\n📊 Updated campaign details:')
      campaigns.forEach(campaign => {
        console.log(`\n${campaign.title}:`)
        console.log(`  Date: ${campaign.eventDate}`)
        console.log(`  Location: ${campaign.location}`)
        console.log(`  Artist: ${campaign.artist}`)
      })
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the update
updateEventDetails()