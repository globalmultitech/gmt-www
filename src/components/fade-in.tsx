'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewTriggerOffset?: string;
};

export default function FadeIn({
  children,
  className,
  delay = 0.2,
  viewTriggerOffset = "200px",
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: `0px 0px -${viewTriggerOffset} 0px` });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
