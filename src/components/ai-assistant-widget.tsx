
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Bot, X, Send, User, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { askAssistant } from '@/ai/flows/assistant-flow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
};

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'initial',
          sender: 'ai',
          content: 'Halo! Saya asisten AI dari Global Multi Technology. Ada yang bisa saya bantu terkait produk atau layanan kami?',
        }
      ]);
    }
  }, [isOpen, messages.length]);

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
    if (newMessage.trim() === '' || isThinking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsThinking(true);

    try {
      const result = await askAssistant({ question: newMessage });
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: result.answer,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking assistant:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50">
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
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Tutup Jendela</span>
                  </Button>
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
                                {message.sender === 'ai' && (
                                <Avatar className="h-8 w-8 bg-sky-blue text-white">
                                    <AvatarFallback><Sparkles className="h-5 w-5" /></AvatarFallback>
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
                                  <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.content}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                                {message.sender === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                                )}
                            </div>
                            ))}
                            {isThinking && (
                                <div className="flex items-end gap-2 justify-start">
                                    <Avatar className="h-8 w-8 bg-sky-blue text-white">
                                      <AvatarFallback><Sparkles className="h-5 w-5" /></AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-xs rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground rounded-bl-none flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Mengetik...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                        <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tanya tentang produk..."
                        autoComplete="off"
                        disabled={isThinking}
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim() || isThinking}>
                          {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
          className="rounded-full w-16 h-16 shadow-lg bg-sky-blue hover:bg-sky-blue/90"
          onClick={() => setIsOpen(!isOpen)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isOpen ? 'x' : 'ai'}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                {isOpen ? <X className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
                </motion.div>
            </AnimatePresence>
        </Button>
      </motion.div>
      </div>
    </>
  );
}
