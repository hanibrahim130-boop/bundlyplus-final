import React, { ReactNode } from 'react';

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
    <div className={`pt-28 md:pt-36 pb-32 px-6 ${maxWidthMap[maxWidth]} mx-auto min-h-screen animate-[fadeIn_0.3s_ease-out] ${className}`}>
      {children}
    </div>
  );
}
