import React, { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthMap = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'w-full',
};

export function Section({ children, className = '', maxWidth = 'xl' }: SectionProps) {
  return (
    <section className={`relative z-10 py-20 md:py-24 px-6 ${maxWidthMap[maxWidth]} mx-auto ${className}`}>
      {children}
    </section>
  );
}
