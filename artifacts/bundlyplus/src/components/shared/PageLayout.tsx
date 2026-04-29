import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
  className?: string;
}

const maxWidthMap = {
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
};

export function PageLayout({ children, maxWidth = 'xl', className = '' }: PageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`pt-28 md:pt-36 pb-32 px-6 ${maxWidthMap[maxWidth]} mx-auto min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
}
