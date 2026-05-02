import React from 'react';

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ subtitle, title, centered = true, className = '' }: SectionHeaderProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-12 md:mb-16 ${className}`}>
      <h2 className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-3">{subtitle}</h2>
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-800 dark:text-slate-100">{title}</h3>
    </div>
  );
}
