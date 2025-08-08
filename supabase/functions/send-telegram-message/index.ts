// This edge function sends a message to a Telegram chat using a bot.
// Redeploying to apply newly set secrets.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID')

  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN secret is not set in Supabase environment variables.");
    return new Response(JSON.stringify({ error: 'Server configuration error: Bot token is missing.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  if (!chatId) {
    console.error("TELEGRAM_CHAT_ID secret is not set in Supabase environment variables.");
    return new Response(JSON.stringify({ error: 'Server configuration error: Chat ID is missing.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const text = `*New Contact Form Submission*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;
    
    // Escape characters for Telegram's MarkdownV2 parser
    const escapeMarkdown = (str: string) => str.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
    const formattedText = escapeMarkdown(text);

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedText,
        parse_mode: 'MarkdownV2',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API Error:', errorData);
      throw new Error('Failed to send message via Telegram.');
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