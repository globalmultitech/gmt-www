
'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';
import { useLoadingStore } from '@/hooks/use-loading-store';

function PageTransitionLoaderContent() {
  const pathname = usePathname();
  const { isLoading, stopLoading } = useLoadingStore();

  useEffect(() => {
    // Whenever the pathname changes, the new page has loaded, so we stop the loading animation.
    stopLoading();
  }, [pathname, stopLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="p-4 bg-background/80 backdrop-blur-sm rounded-full shadow-lg">
                <Logo companyName="" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export default function PageTransitionLoader() {
    return (
        <Suspense fallback={null}>
            <PageTransitionLoaderContent />
        </Suspense>
    )
}
