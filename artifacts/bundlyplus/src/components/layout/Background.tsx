import React from 'react';
import { useTheme } from '@/lib/theme';

export function Background() {
  const { isDark } = useTheme();

  if (isDark) {
    return (
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0d1117] pointer-events-none">
        <div className="bg-blob bg-blob-1 absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)' }} />
        <div className="bg-blob bg-blob-2 absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px]"
          style={{ backgroundColor: 'rgba(139, 92, 246, 0.10)' }} />
        <div className="bg-blob bg-blob-3 absolute bottom-[-10%] left-[15%] w-[60vw] h-[60vw] rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(251, 146, 60, 0.08)' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFAFA] pointer-events-none">
      <div className="bg-blob bg-blob-1 absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-pink-200/50 blur-[100px] mix-blend-multiply" />
      <div className="bg-blob bg-blob-2 absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] mix-blend-multiply"
        style={{ backgroundColor: 'rgba(216, 180, 226, 0.4)' }} />
      <div className="bg-blob bg-blob-3 absolute bottom-[-10%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-orange-100/60 blur-[130px] mix-blend-multiply" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
}
