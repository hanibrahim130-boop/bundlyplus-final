import React, { ReactNode } from 'react';
import { Link } from 'wouter';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="py-24 md:py-32 flex flex-col items-center justify-center text-center">
      <div className="w-28 h-28 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center mb-8 shadow-sm border border-slate-100 dark:border-slate-700">
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-8 py-4 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-lg shadow-slate-900/20 dark:shadow-none"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
