import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, sessionId } = await req.json()

    if (!message || !sessionId) {
      return new Response(JSON.stringify({ error: 'Message and sessionId are required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { 'X-Supabase-Client-Info': 'supabase-js/2.54.0' } } }
    )

    await supabaseAdmin
      .from('chat_messages')
      .insert({ session_id: sessionId, sender: 'user', content: message });

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID')
    const webAppUrl = `https://goicesirlbdgjspjpcin.dyad.sh/telegram-chat-dashboard#${sessionId}`

    if (!botToken || !chatId) {
      console.error("Telegram secrets are not set.");
      return new Response(JSON.stringify({ success: true, warning: 'Message stored but could not be sent to Telegram.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const text = `You have a new chat message!\n\n> _${message.substring(0, 80)}..._`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Open Chat Dashboard', web_app: { url: webAppUrl } }]
          ]
        }
      }),
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})