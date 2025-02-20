
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('user_id')
    
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Get the game URL from environment variable or use a default
    const gameUrl = Deno.env.get('GAME_URL') || 'https://hope-coin-game.lovable.app/'
    
    // Generate authentication data
    const authData = {
      user_id: userId,
      auth_date: Math.floor(Date.now() / 1000)
    }

    // Create the game URL with auth data
    const finalUrl = `${gameUrl}?tgWebAppData=${encodeURIComponent(JSON.stringify(authData))}`

    // Redirect to the game URL
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Location': finalUrl
      },
      status: 302
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
