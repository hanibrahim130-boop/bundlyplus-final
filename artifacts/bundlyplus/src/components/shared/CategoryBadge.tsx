import React from 'react';

interface CategoryBadgeProps {
  label: string;
  className?: string;
}

export function CategoryBadge({ label, className = '' }: CategoryBadgeProps) {
  return (
    <span className={`bg-white/80 text-slate-600 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-100 shadow-sm ${className}`}>
      {label}
    </span>
  );
}
