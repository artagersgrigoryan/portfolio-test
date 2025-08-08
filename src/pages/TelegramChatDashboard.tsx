import { useState, useEffect } from 'react';
import { ChatSessionList } from '@/components/ChatSessionList';
import { ChatConversation } from '@/components/ChatConversation';
import { Toaster as Sonner } from "@/components/ui/sonner";

const TelegramChatDashboard = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    // This script is provided by Telegram when the Mini App is loaded.
    // It allows the web app to interact with the Telegram client.
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.body.appendChild(script);

    // Read session ID from URL hash on load and on change
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setSelectedSessionId(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    handleHashChange(); // Check hash on initial load

    return () => {
      document.body.removeChild(script);
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, []);

  return (
    // The Mini App will inherit its theme from the Telegram client.
    // We'll use our dark theme as a base.
    <div className="dark bg-background text-foreground h-screen flex flex-col">
      <Sonner />
      <div className="flex-grow flex overflow-hidden">
        <div className="w-1/3 border-r border-border overflow-y-auto">
          <ChatSessionList
            selectedSessionId={selectedSessionId}
            onSelectSession={setSelectedSessionId}
          />
        </div>
        <div className="w-2/3 flex flex-col">
          {selectedSessionId ? (
            <ChatConversation sessionId={selectedSessionId} key={selectedSessionId} />
          ) : (
            <div className="flex-grow flex items-center justify-center text-muted-foreground">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramChatDashboard;