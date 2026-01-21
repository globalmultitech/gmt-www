'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Bot, X, Send, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { askAssistant } from '@/ai/flows/assistant-flow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveChatLead } from '@/app/actions/assistant-actions';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
};

type SessionInfo = {
  name: string;
  company: string;
};

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();


  useEffect(() => {
    if (isOpen && !sessionInfo && messages.length === 0) {
      setMessages([
        {
          id: 'initial-greeting',
          sender: 'ai',
          content: 'Selamat datang! Silakan isi formulir di bawah ini untuk memulai percakapan.',
        },
      ]);
    } else if (isOpen && sessionInfo && messages.length === 1 && messages[0].id === 'initial-greeting') {
        // This case handles when a user re-opens the widget after submitting the form
        // but before the first actual chat message. We can reset it to a normal greeting.
        setMessages([{
            id: 're-open-greeting',
            sender: 'ai',
            content: `Halo ${sessionInfo.name}! Ada lagi yang bisa saya bantu?`
        }])
    }
  }, [isOpen, sessionInfo, messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = { name, company, contact, initialMessage };
      const result = await saveChatLead(formData);

      if (result.success) {
        toast({ title: 'Sukses', description: 'Formulir terkirim. Memulai obrolan...' });
        setSessionInfo({ name, company });
        
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: initialMessage,
            sender: 'user',
        };

        const updatedMessages = [userMessage];
        setMessages(updatedMessages);
        setIsThinking(true);
        triggerAiResponse(updatedMessages);

      } else {
        toast({
          title: 'Gagal',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  const triggerAiResponse = async (currentMessages: Message[]) => {
     try {
      const result = await askAssistant({ 
        history: currentMessages.map(({id, ...rest}) => rest)
      });
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
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isThinking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: 'user',
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');
    setIsThinking(true);
    triggerAiResponse(updatedMessages);
  };
  
  const FormContent = (
     <form onSubmit={handleFormSubmit} className="space-y-3 px-2 sm:px-4 py-2">
        <div className="space-y-1">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1">
            <Label htmlFor="company">Perusahaan</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
        </div>
        <div className="space-y-1">
            <Label htmlFor="contact">Kontak (Email/Telepon)</Label>
            <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>
        <div className="space-y-1">
            <Label htmlFor="initialMessage">Pesan Awal</Label>
            <Textarea id="initialMessage" value={initialMessage} onChange={(e) => setInitialMessage(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Mulai Obrolan'}
        </Button>
     </form>
  );

  const ChatContent = (
    <>
      <CardContent className="flex-grow p-2 sm:p-4 overflow-hidden">
        <ScrollArea className="h-full pr-2 sm:pr-4" ref={scrollAreaRef}>
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn('flex items-end gap-2', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {message.sender === 'ai' && (
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 bg-sky-blue text-white">
                    <AvatarFallback><Bot className="h-4 w-4 sm:h-5 sm:w-5" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn('max-w-[180px] sm:max-w-xs rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm', message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none')}>
                  <div className={cn("prose prose-sm max-w-none dark:prose-invert", message.sender === 'user' && "text-primary-foreground")}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8"><AvatarFallback><User /></AvatarFallback></Avatar>
                )}
              </div>
            ))}
            {isThinking && (
              <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 bg-sky-blue text-white">
                    <AvatarFallback><Bot className="h-4 w-4 sm:h-5 sm:w-5" /></AvatarFallback>
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
      <CardFooter className="p-2 sm:p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Tanya tentang produk..." autoComplete="off" disabled={isThinking} className="h-10 sm:h-9" />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || isThinking} className="h-10 w-10 sm:h-9 sm:w-9">
            {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </>
  );

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
              className="w-[calc(100vw-2rem)] h-auto max-h-[80vh] sm:w-80 sm:h-auto sm:max-h-[70vh] origin-bottom-right mb-4 flex"
            >
              <Card className="flex flex-col h-full shadow-2xl w-full">
                <CardHeader className="flex-row items-center justify-between bg-primary text-primary-foreground p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <CardTitle className="text-base sm:text-lg">GMT-AI Assistant</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-6 sm:w-6 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Tutup Jendela</span>
                  </Button>
                </CardHeader>
                
                {sessionInfo ? ChatContent : FormContent}

              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button size="icon" className="rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg bg-sky-blue hover:bg-sky-blue/90" onClick={() => setIsOpen(!isOpen)}>
            <AnimatePresence mode="wait">
              <motion.div key={isOpen ? 'x' : 'ai'} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                {isOpen ? <X className="h-7 w-7 sm:h-8 sm:w-8" /> : <Bot className="h-7 w-7 sm:h-8 sm:w-8" />}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </>
  );
}
