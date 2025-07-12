
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Label } from './ui/label';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  createdAt: any;
};

type ChatStage = 'form' | 'chatting' | 'loading';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stage, setStage] = useState<ChatStage>('loading');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
        setSessionId(storedSessionId);
        const storedName = localStorage.getItem('chatUserName');
        const storedCompany = localStorage.getItem('chatUserCompany');
        if (storedName && storedCompany) {
            setName(storedName);
            setCompany(storedCompany);
            setStage('chatting');
        } else {
            // Has session ID but no user info, force back to form
            setStage('form');
        }
    } else {
      setStage('form');
    }
  }, []);

  useEffect(() => {
    if (!sessionId || stage !== 'chatting') return;

    const q = query(collection(db, `chatSessions/${sessionId}/messages`), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [sessionId, stage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleStartChat = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !company) return;

      const newSessionId = uuidv4();
      localStorage.setItem('chatSessionId', newSessionId);
      localStorage.setItem('chatUserName', name);
      localStorage.setItem('chatUserCompany', company);
      setSessionId(newSessionId);

      const sessionRef = doc(db, 'chatSessions', newSessionId);
      const guestDisplayName = `${name} dari ${company}`;

      try {
        await setDoc(sessionRef, {
            guestName: guestDisplayName,
            status: "open",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        setStage('chatting');
      } catch (error) {
        console.error("Error creating session: ", error);
      }
  }

  const handleEndChat = async () => {
    if (!sessionId) return;
    
    // Mark session as closed in Firestore
    const sessionRef = doc(db, 'chatSessions', sessionId);
    try {
        await updateDoc(sessionRef, {
            status: 'closed',
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error closing session:", error);
    }
    
    // Clear local storage and state
    localStorage.removeItem('chatSessionId');
    localStorage.removeItem('chatUserName');
    localStorage.removeItem('chatUserCompany');
    setSessionId(null);
    setName('');
    setCompany('');
    setMessages([]);
    setStage('form');
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !sessionId) return;

    const messageData = {
      content: newMessage,
      sender: 'user',
      createdAt: serverTimestamp(),
    };
    
    const sessionRef = doc(db, 'chatSessions', sessionId);
    
    try {
      await addDoc(collection(sessionRef, 'messages'), messageData);
      // Also update session metadata
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
  
  const renderContent = () => {
    switch (stage) {
        case 'loading':
            return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
        case 'form':
            return (
                <form onSubmit={handleStartChat} className="p-4 space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Contoh: Budi" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="company">Perusahaan</Label>
                        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Contoh: PT. Maju Mundur" />
                    </div>
                    <Button type="submit" className="w-full" disabled={!name || !company}>Mulai Mengobrol</Button>
                </form>
            );
        case 'chatting':
            return (
                 <>
                    <CardContent className="flex-grow p-4 overflow-hidden">
                        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                    'flex items-end gap-2',
                                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {message.sender === 'admin' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                    )}
                                    <div
                                    className={cn(
                                        'max-w-xs rounded-lg px-3 py-2 text-sm',
                                        message.sender === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                        : 'bg-muted text-muted-foreground rounded-bl-none'
                                    )}
                                    >
                                    {message.content}
                                    </div>
                                    {message.sender === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    )}
                                </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                        <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        autoComplete="off"
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                        </Button>
                    </form>
                    </CardFooter>
                 </>
            )
    }
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-80 h-[500px] origin-bottom-right"
            >
              <Card className="flex flex-col h-full shadow-2xl">
                <CardHeader className="flex-row items-center justify-between bg-primary text-primary-foreground p-4">
                  <CardTitle className="text-lg">Butuh Bantuan?</CardTitle>
                  {stage === 'chatting' && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" onClick={handleEndChat}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Tutup Obrolan</span>
                      </Button>
                  )}
                </CardHeader>
                {renderContent()}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-4"
        >
        <Button
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isOpen ? 'x' : 'msg'}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
                </motion.div>
            </AnimatePresence>
        </Button>
      </motion.div>
      </div>
    </>
  );
}
