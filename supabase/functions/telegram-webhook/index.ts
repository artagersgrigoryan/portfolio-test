import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

serve(async (req) => {
  try {
    const payload = await req.json()
    
    // Check if an admin is trying to reply to a bot message
    if (payload.message && payload.message.reply_to_message && payload.message.text) {
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      const adminChatId = payload.message.chat.id;

      if (botToken && adminChatId) {
        const errorMessage = `To reply to users, please use the "Live Chat Dashboard" button.`;
        
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminChatId,
            text: errorMessage,
            reply_to_message_id: payload.message.message_id
          }),
        });
      }
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error.message);
    return new Response("Error processing webhook", { status: 200 });
  }
})