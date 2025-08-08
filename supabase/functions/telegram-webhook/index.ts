import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

serve(async (req) => {
  try {
    const payload = await req.json()

    if (payload.message && payload.message.reply_to_message && payload.message.text) {
      const originalMessage = payload.message.reply_to_message.text;
      const adminReply = payload.message.text;

      const sessionIdMatch = originalMessage.match(/From Session: `([a-fA-F0-9-]+)`/);
      
      if (sessionIdMatch && sessionIdMatch[1]) {
        const sessionId = sessionIdMatch[1];

        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error } = await supabaseAdmin
          .from('chat_messages')
          .insert({ session_id: sessionId, sender: 'admin', content: adminReply });

        if (error) {
          console.error('DB Insert Error from Webhook:', error);
        }
      } else {
        console.log("Webhook received a reply, but couldn't find a session ID.");
      }
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error.message);
    return new Response("Error processing webhook", { status: 200 });
  }
})