import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ChatSession {
  id: string;
  created_at: string;
  last_message_content: string | null;
  last_message_at: string | null;
}

interface ChatSessionListProps {
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}

export const ChatSessionList = ({ selectedSessionId, onSelectSession }: ChatSessionListProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      // We use an RPC call to a database function to get sessions with their last message.
      // This is more efficient than fetching all messages for all sessions.
      const { data, error } = await supabase.rpc('get_chat_sessions_with_last_message');

      if (error) {
        console.error('Error fetching chat sessions:', error);
      } else {
        setSessions(data || []);
      }
      setLoading(false);
    };

    fetchSessions();

    const channel = supabase
      .channel('chat-sessions-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages' },
        () => fetchSessions() // Refetch all sessions when any message changes
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold p-4">Conversations</h2>
      <div className="space-y-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={cn(
              'w-full text-left p-4 rounded-lg transition-colors',
              selectedSessionId === session.id
                ? 'bg-primary/20'
                : 'hover:bg-muted/50'
            )}
          >
            <div className="flex justify-between items-baseline">
              <p className="font-semibold truncate text-sm text-white">
                Session <span className="font-mono text-xs">{session.id.substring(0, 8)}</span>
              </p>
              {session.last_message_at && (
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(session.last_message_at), { addSuffix: true })}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {session.last_message_content || 'No messages yet...'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};