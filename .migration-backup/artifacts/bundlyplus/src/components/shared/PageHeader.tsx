import React from 'react';

interface PageHeaderProps {
  title: string;
  gradientWord: string;
  subtitle: string;
  className?: string;
}

export function PageHeader({ title, gradientWord, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`text-center mb-12 md:mb-16 max-w-3xl mx-auto ${className}`}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-800 dark:text-slate-100 mb-6">
        {title} <span className="text-gradient">{gradientWord}</span>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{subtitle}</p>
    </div>
  );
}
