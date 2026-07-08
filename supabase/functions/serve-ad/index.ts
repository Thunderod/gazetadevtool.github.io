import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { app_id, target_age, app_category, limit = 5, event_type = 'request' } = await req.json()
    if (!app_id) {
      return new Response(JSON.stringify({ error: 'Missing app_id' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
    }

    // Connect to Project B database using Service Role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Validate app_id in Project B (using existing 'apps' table)
    const { data: appData, error: appError } = await supabaseAdmin
      .from('apps')
      .select('status')
      .eq('id', app_id)
      .single()

    if (appError || !appData || appData.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Invalid or inactive app_id' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 })
    }

    // Safely increment stat in Project B database
    await supabaseAdmin.rpc('increment_daily_stat', {
      p_app_id: app_id,
      p_stat_type: event_type
    })

    // If it's just an impression or click, return success without fetching an ad
    if (event_type === 'impression' || event_type === 'click') {
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })
    }

    // Otherwise, fetch from Project A (Ad Network Backend)
    let projectAUrl = Deno.env.get('PROJECT_A_SUPABASE_URL')
    const projectAKey = Deno.env.get('PROJECT_A_ANON_KEY')

    if (projectAUrl && !projectAUrl.startsWith('http')) {
        projectAUrl = 'https://' + projectAUrl
    }

    if (!projectAUrl || !projectAKey) {
        return new Response(JSON.stringify({ error: 'Gateway configuration error' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 })
    }

    const response = await fetch(`${projectAUrl}/rest/v1/rpc/get_active_ads_pool`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": projectAKey,
        "Authorization": `Bearer ${projectAKey}`
      },
      body: JSON.stringify({
        p_target_age: target_age,
        p_app_category: app_category,
        p_limit: limit
      })
    })

    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: response.status,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
