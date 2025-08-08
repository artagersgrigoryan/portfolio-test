import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const escapeMarkdown = (str: string) => {
  if (!str) return '';
  return str.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, ensure the session exists to prevent foreign key violations.
    const { error: sessionError } = await supabaseAdmin
      .from('chat_sessions')
      .upsert({ id: sessionId });

    if (sessionError) {
      console.error('DB Session Upsert Error:', sessionError);
      throw new Error(`Database error: ${sessionError.message}`);
    }

    const { error: insertError } = await supabaseAdmin
      .from('chat_messages')
      .insert({ session_id: sessionId, sender: 'user', content: message })

    if (insertError) {
      console.error('DB Insert Error:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID')

    if (!botToken || !chatId) {
      console.error("Telegram secrets are not set.");
      return new Response(JSON.stringify({ success: true, warning: 'Message stored but could not be sent to Telegram.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const escapedMessage = escapeMarkdown(message);
    const text = `*New Chat Message* 💬\n\n*From Session:* \`${sessionId}\`\n\n*Message:*\n${escapedMessage}`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'MarkdownV2',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API Error:', errorData);
    }

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