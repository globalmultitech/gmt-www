
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';

function PageTransitionLoaderContent() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      setLoading(true);
      
      const timer = setTimeout(() => {
        setLoading(false);
        previousPathRef.current = pathname;
      }, 700); // Duration of the loading indicator

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
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
