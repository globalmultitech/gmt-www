
'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, collectionGroup, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

type ChatSession = {
  id: string;
  guestName?: string;
  status: 'open' | 'closed';
  lastMessage?: string;
  updatedAt?: any;
  unreadCount?: number;
};

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  createdAt: any;
};

export default function ChatAdminClientPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'chatSessions'), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sessionsData: ChatSession[] = [];
      querySnapshot.forEach((doc) => {
        sessionsData.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      setSessions(sessionsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeSession) return;

    const q = query(collection(db, `chatSessions/${activeSession.id}/messages`), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeSession]);

   useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeSession) return;

    const messageData = {
      content: newMessage,
      sender: 'admin',
      createdAt: serverTimestamp(),
    };
    
    try {
      const sessionRef = doc(db, 'chatSessions', activeSession.id);
      await addDoc(collection(sessionRef, 'messages'), messageData);
      await updateDoc(sessionRef, {
        updatedAt: serverTimestamp(),
        lastMessage: newMessage,
        status: 'open',
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp?.toDate) return '';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: id });
  };


  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Inbox Pesan</h2>
        </div>
        <ScrollArea className="flex-grow">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => setActiveSession(session)}
              className={cn(
                "w-full text-left p-4 border-b hover:bg-muted",
                activeSession?.id === session.id && "bg-secondary"
              )}
            >
              <div className="flex justify-between items-center">
                <p className="font-bold truncate">{session.guestName || `Tamu #${session.id.substring(0, 6)}`}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(session.updatedAt)}</p>
              </div>
              <p className="text-sm text-muted-foreground truncate">{session.lastMessage}</p>
            </button>
          ))}
        </ScrollArea>
      </div>

      <div className="w-2/3 flex flex-col">
        {activeSession ? (
          <div className="flex flex-col h-full">
            <CardHeader className="flex-row items-center justify-between p-4 border-b">
              <CardTitle>Obrolan dengan {activeSession.guestName || `Tamu #${activeSession.id.substring(0, 6)}`}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-4 overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                            'flex items-end gap-2',
                            message.sender === 'admin' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {message.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            )}
                            <div
                            className={cn(
                                'max-w-md rounded-lg px-3 py-2 text-sm',
                                message.sender === 'admin'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted text-muted-foreground rounded-bl-none'
                            )}
                            >
                            {message.content}
                            </div>
                            {message.sender === 'admin' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            )}
                        </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t bg-background">
              <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik balasan..."
                  autoComplete="off"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Pilih sesi obrolan untuk memulai.</p>
          </div>
        )}
      </div>
    </div>
  );
}

