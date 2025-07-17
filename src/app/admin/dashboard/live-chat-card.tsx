
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LiveChatCard() {
  const [openChats, setOpenChats] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'chatSessions'), where('status', '==', 'open'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setOpenChats(querySnapshot.size);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching live chat data: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card className={cn("flex flex-col justify-between", openChats > 0 ? "bg-primary/10 border-primary" : "")}>
      <CardHeader>
        <div className="flex items-center gap-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <CardTitle>Live Chat</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold">{openChats}</p>
            <CardDescription>
              {openChats > 0
                ? `Pesan baru menunggu balasan.`
                : 'Tidak ada pesan baru saat ini.'}
            </CardDescription>
          </>
        )}
      </CardContent>
      <CardContent>
        <Button asChild className="w-full" variant={openChats > 0 ? 'default' : 'secondary'}>
          <Link href="/admin/chat">Buka Inbox</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
