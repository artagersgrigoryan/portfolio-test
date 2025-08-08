import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const escapeMarkdown = (str: string) => {
  if (!str) return '';
  return str.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

serve(async (req) => {
  try {
    const payload = await req.json()
    
    // Check for a message that is a reply to another message
    if (payload.message && payload.message.reply_to_message && payload.message.text) {
      const replyToMessage = payload.message.reply_to_message;
      const adminReplyText = payload.message.text;
      const originalTelegramMessageId = replyToMessage.message_id;

      if (!originalTelegramMessageId) {
        return new Response("OK", { status: 200 });
      }

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
        
        // --- DIAGNOSTIC STEP ---
        // Send a failure message back to the admin if the lookup fails
        const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
        const adminChatId = payload.message.chat.id;

        if (botToken && adminChatId) {
          const errorMessage = `⚠️ *Reply Failed*\n\nI couldn't find the original website chat session for the message you replied to\\. The user will not see your reply\\.\n\n*Reason:* The message's tracking ID was not found in the database\\. This usually happens if the message was sent before the latest code update\\.\n\n*Action:* Please ask the user to send a new message from the website\\.`;
          
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: adminChatId,
              text: errorMessage,
              parse_mode: 'MarkdownV2',
              reply_to_message_id: payload.message.message_id
            }),
          });
        }
        // --- END DIAGNOSTIC STEP ---

        return new Response("OK", { status: 200 });
      }

      const { session_id: sessionId } = originalMessage;

      // Insert the admin's reply into the correct session
      const { error: insertError } = await supabaseAdmin
        .from('chat_messages')
        .insert({ session_id: sessionId, sender: 'admin', content: adminReplyText });

      if (insertError) {
        console.error('DB Insert Error from Webhook:', insertError);
      }
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error.message);
    return new Response("Error processing webhook", { status: 200 });
  }
})