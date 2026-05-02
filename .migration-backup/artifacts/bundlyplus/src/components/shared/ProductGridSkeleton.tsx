import React from "react";
import { cn } from "@/lib/utils";

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 overflow-hidden shadow-sm">
      <div className="h-40 bg-slate-100 dark:bg-slate-800/60 relative overflow-hidden shimmer-bg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4 relative overflow-hidden shimmer-bg" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2 relative overflow-hidden shimmer-bg" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-slate-100 dark:bg-slate-800/60 rounded w-16 relative overflow-hidden shimmer-bg" />
          <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800/60 rounded-full relative overflow-hidden shimmer-bg" />
        </div>
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  className?: string;
  count?: number;
}

export function ProductGridSkeleton({
  className,
  count = 4,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
