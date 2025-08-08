import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  id: number;
  sender: 'user' | 'admin';
  content: string;
}

const SESSION_ID_KEY = 'chat_session_id';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initializeSession = () => {
    let currentSessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      localStorage.setItem(SESSION_ID_KEY, currentSessionId);
      supabase.from('chat_sessions').insert({ id: currentSessionId }).then();
    }
    setSessionId(currentSessionId);
    setMessages([]);
  };

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const fetchHistory = async () => {
      setIsHistoryLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, sender, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        showError("Could not load chat history.");
      } else if (data) {
        setMessages(data as ChatMessage[]);
      }
      setIsHistoryLoading(false);
    };

    fetchHistory();

    const channel = supabase
      .channel(`chat-session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !sessionId) return;

    const tempMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-chat-message', {
        body: { message: tempMessage, sessionId },
      });

      if (error) throw new Error(error.message);
    } catch (err: any) {
      showError(err.message || "Failed to send message.");
      setMessage(tempMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    localStorage.removeItem(SESSION_ID_KEY);
    initializeSession();
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <Button size="icon" className="rounded-full h-16 w-16 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-28 right-8 z-50 w-80 h-96 flex flex-col shadow-2xl animate-in fade-in-5 slide-in-from-bottom-2 duration-300">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <h3 className="font-bold">Live Chat</h3>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handleResetSession} title="Start New Conversation">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4 overflow-y-auto space-y-4">
            {isHistoryLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." disabled={isLoading} />
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
};