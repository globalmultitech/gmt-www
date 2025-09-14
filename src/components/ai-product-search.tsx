
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { getProductRecommendation } from '@/app/actions';

export default function AIProductSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setRecommendation('');
    setError('');

    const result = await getProductRecommendation(query);

    if (result.error) {
      setError(result.error);
    } else {
      setRecommendation(result.recommendation || 'Maaf, saya tidak dapat menemukan produk yang cocok saat ini.');
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-center text-2xl font-bold font-headline text-primary mb-1">
          Cari Produk dengan AI
        </h2>
        <p className="text-center text-muted-foreground mb-4">
          Ketik kebutuhan Anda (contoh: "mesin hitung uang" atau "produk videotron")
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Saya butuh solusi untuk..."
            className="text-base"
            disabled={isLoading}
          />
          <Button type="submit" size="lg" disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Cari
              </>
            )}
          </Button>
        </form>

        {(recommendation || error) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 border rounded-lg bg-secondary/50"
          >
            {error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <div
                className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: recommendation }}
              />
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
