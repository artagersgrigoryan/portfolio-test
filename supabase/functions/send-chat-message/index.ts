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

    // Insert the user's message and get its ID
    const { data: messageData, error: insertError } = await supabaseAdmin
      .from('chat_messages')
      .insert({ session_id: sessionId, sender: 'user', content: message })
      .select('id')
      .single();

    if (insertError) {
      console.error('DB Insert Error:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    const userMessageId = messageData.id;

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
    // The text sent to Telegram still includes the session ID as a fallback/for context
    const text = `*New Chat Message* 💬\n\n*From Session:* \`${sessionId}\`\n\n*Message:*\n${escapedMessage}`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'MarkdownV2',
      }),
    })

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API Error:', errorData);
      // Don't throw here, the message is already in the DB.
    } else {
      const telegramResult = await telegramResponse.json();
      if (telegramResult.ok && telegramResult.result.message_id) {
        const telegramMessageId = telegramResult.result.message_id;
        
        // Update the user's message row with the telegram_message_id
        const { error: updateError } = await supabaseAdmin
          .from('chat_messages')
          .update({ telegram_message_id: telegramMessageId })
          .eq('id', userMessageId);

        if (updateError) {
          console.error('DB Update Error:', updateError);
          // Don't throw, not a critical failure for the user
        }
      }
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