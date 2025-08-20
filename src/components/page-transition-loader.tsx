
'use client';

import { Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { useSearchParams } from 'next/navigation';

function PageTransitionLoaderContent() {
  const { isLoading, stopLoading } = useLoadingStore();
  
  // useSearchParams is a Client Component hook that lets you read the current URL's query string.
  // We use it here to re-trigger the useEffect when the path changes, inside a Suspense boundary.
  useSearchParams();

  useEffect(() => {
    // This effect will run when the new page component has been rendered,
    // thanks to the <Suspense> boundary in layout.tsx.
    // We can now safely stop the loading animation.
    stopLoading();
  }, [stopLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
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
    // This top-level component doesn't need Suspense itself, 
    // but its child needs to be wrapped in Suspense where it's used.
    return <PageTransitionLoaderContent />;
}
