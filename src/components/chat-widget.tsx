
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  createdAt: any;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem('chatSessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('chatSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const q = query(collection(db, `chatSessions/${sessionId}/messages`), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [sessionId]);

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
    if (newMessage.trim() === '' || !sessionId) return;

    const messageData = {
      content: newMessage,
      sender: 'user',
      createdAt: serverTimestamp(),
    };

    try {
      // Create session document if it's the first message
      if (messages.length === 0) {
        await setDoc(doc(db, "chatSessions", sessionId), {
            guestName: "Anonymous User",
            status: "open",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastMessage: newMessage
        });
      }

      await addDoc(collection(db, `chatSessions/${sessionId}/messages`), messageData);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

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
                </CardHeader>
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
