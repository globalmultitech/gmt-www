
'use client';

import { Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { usePathname, useSearchParams } from 'next/navigation';

function PageTransitionLoaderContent() {
  const { isLoading, stopLoading } = useLoadingStore();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs whenever the pathname changes.
    // The Suspense boundary ensures this component re-evaluates after navigation,
    // making it a reliable place to stop the loading animation.
    stopLoading();
  }, [pathname, stopLoading]);

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
    return (
      <Suspense fallback={null}>
         <PageTransitionLoaderContent />
      </Suspense>
    )
}
