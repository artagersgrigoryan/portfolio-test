import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

serve(async (req) => {
  try {
    const payload = await req.json()
    
    console.log("--- TELEGRAM WEBHOOK PAYLOAD RECEIVED ---");
    console.log(JSON.stringify(payload, null, 2));
    console.log("-----------------------------------------");

    // Check for a message that is a reply to another message
    if (payload.message && payload.message.reply_to_message && payload.message.text) {
      const replyToMessage = payload.message.reply_to_message;
      const adminReplyText = payload.message.text;
      const originalTelegramMessageId = replyToMessage.message_id;

      if (!originalTelegramMessageId) {
        console.log("Webhook received a reply, but it's missing the original message_id.");
        return new Response("OK", { status: 200 });
      }

      console.log("Replying to Telegram message ID:", originalTelegramMessageId);

      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Find the original message in our DB using the telegram_message_id
      const { data: originalMessage, error: findError } = await supabaseAdmin
        .from('chat_messages')
        .select('session_id')
        .eq('telegram_message_id', originalTelegramMessageId)
        .single();

      if (findError || !originalMessage) {
        console.error('Could not find original message in DB for telegram_message_id:', originalTelegramMessageId, findError);
        return new Response("OK", { status: 200 }); // Acknowledge webhook, but can't process
      }

      const { session_id: sessionId } = originalMessage;
      console.log("Found session ID:", sessionId);

      // Insert the admin's reply into the correct session
      const { error: insertError } = await supabaseAdmin
        .from('chat_messages')
        .insert({ session_id: sessionId, sender: 'admin', content: adminReplyText });

      if (insertError) {
        console.error('DB Insert Error from Webhook:', insertError);
      } else {
        console.log("Successfully inserted admin reply for session:", sessionId);
      }
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error.message);
    // Always return 200 to Telegram to prevent retries
    return new Response("Error processing webhook", { status: 200 });
  }
})