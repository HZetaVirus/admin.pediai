import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN')
const META_PIXEL_ID = Deno.env.get('META_PIXEL_ID')
const GA4_MEASUREMENT_ID = Deno.env.get('GA4_MEASUREMENT_ID')
const GA4_API_SECRET = Deno.env.get('GA4_API_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sha256(message: string) {
  if (!message) return null;
  const msgUint8 = new TextEncoder().encode(message.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    const { record } = await req.json() // Triggado pelo Webhook do banco

    if (!record) throw new Error('No record found')

    // 1. Buscar dados do perfil do cliente
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, phone, id')
      .eq('id', record.user_id)
      .single()

    // Buscar email do auth.users (necessário service_role_key)
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(record.user_id)
    const email = user?.email

    // 2. Extrair metadados de tracking do registro
    const tracking = record.tracking_data || {}
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1'
    const userAgent = tracking.userAgent || req.headers.get('user-agent') || ''

    // 3. Preparar Hashes para Meta
    const hashedEmail = await sha256(email || '')
    const hashedPhone = await sha256(profile?.phone || '')

    // --- ENVIAR PARA META CAPI ---
    if (META_ACCESS_TOKEN && META_PIXEL_ID) {
      const metaPayload = {
        data: [{
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'email',
          user_data: {
            em: [hashedEmail],
            ph: [hashedPhone],
            client_ip_address: clientIp,
            client_user_agent: userAgent,
            fbc: tracking.fbc,
            fbp: tracking.fbp,
          },
          custom_data: {
            value: record.total,
            currency: 'BRL',
            order_id: record.id.toString(),
          },
        }]
      }

      await fetch(`https://graph.facebook.com/v17.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaPayload),
      })
    }

    // --- ENVIAR PARA GOOGLE GA4 ---
    if (GA4_MEASUREMENT_ID && GA4_API_SECRET) {
      const gaPayload = {
        client_id: record.user_id, // Usamos o ID do usuário como client_id estável
        events: [{
          name: 'purchase',
          params: {
            transaction_id: record.id.toString(),
            value: record.total,
            currency: 'BRL',
            items: [], // Expandir se houver dados de itens
            ip_override: clientIp,
            user_agent: userAgent,
          }
        }]
      }

      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gaPayload),
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
