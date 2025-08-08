import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to escape characters for Telegram's MarkdownV2 parser
const escapeMarkdown = (str: string) => {
  if (!str) return '';
  return str.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
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
    return new Response(JSON.stringify({ error: 'Server configuration error: Telegram Chat ID is missing. Please set it in your project secrets.' }), {
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

    const escapedName = escapeMarkdown(name);
    const escapedEmail = escapeMarkdown(email);
    const escapedMessage = escapeMarkdown(message);

    const text = `*New Contact Form Submission*\n\n*Name:* ${escapedName}\n*Email:* ${escapedEmail}\n\n*Message:*\n${escapedMessage}`;

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
      const apiError = errorData.description || 'Failed to send message via Telegram.';
      throw new Error(`Telegram API Error: ${apiError}`);
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