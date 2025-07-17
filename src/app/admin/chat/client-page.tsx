
'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, collectionGroup, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Circle, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteChatSession } from './actions';


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

function DeleteSessionButton({ sessionId, onDeleted }: { sessionId: string, onDeleted: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteChatSession(sessionId);
      if (result.success) {
        toast({
          title: 'Sukses',
          description: result.message,
        });
        onDeleted();
      } else {
        toast({
          title: 'Gagal',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <AlertDialog onOpenChange={(open) => open && event?.stopPropagation()}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={(e) => e.stopPropagation()}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Sesi Obrolan?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Seluruh riwayat percakapan dalam sesi ini akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            {isPending ? <Loader2 className="animate-spin" /> : 'Ya, Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


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
      // Sort sessions to show 'open' ones first
      sessionsData.sort((a, b) => {
        if (a.status === 'open' && b.status !== 'open') return -1;
        if (a.status !== 'open' && b.status === 'open') return 1;
        // @ts-ignore
        return (b.updatedAt?.toDate() || 0) - (a.updatedAt?.toDate() || 0);
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
        lastMessage: `[Admin]: ${newMessage}`,
        status: 'open', // Re-open chat if admin replies to a closed one
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleSessionDeleted = () => {
    if (activeSession && activeSession.id === activeSession.id) {
        setActiveSession(null);
        setMessages([]);
    }
  }

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
                "w-full text-left p-4 border-b hover:bg-muted group",
                activeSession?.id === session.id && "bg-secondary"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2 flex-grow min-w-0">
                   <Circle className={cn("h-2.5 w-2.5 mt-1.5 flex-shrink-0", session.status === 'open' ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400')} />
                   <div className="flex-grow min-w-0">
                    <p className="font-bold truncate">{session.guestName || `Tamu #${session.id.substring(0, 6)}`}</p>
                    <p className="text-sm text-muted-foreground truncate">{session.lastMessage}</p>
                   </div>
                </div>
                <div className='flex items-center gap-1 flex-shrink-0 pl-2'>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(session.updatedAt)}</p>
                    <DeleteSessionButton sessionId={session.id} onDeleted={handleSessionDeleted} />
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      <div className="w-2/3 flex flex-col">
        {activeSession ? (
          <div className="flex flex-col h-full">
            <CardHeader className="flex-row items-center justify-between p-4 border-b">
               <div className="flex items-center gap-3">
                <CardTitle>Obrolan dengan {activeSession.guestName || `Tamu #${activeSession.id.substring(0, 6)}`}</CardTitle>
                <Badge variant={activeSession.status === 'open' ? 'default' : 'secondary'} className={cn(activeSession.status === 'open' && 'bg-green-100 text-green-800')}>{activeSession.status}</Badge>
               </div>
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
