import React from 'react';
import { useTheme } from '@/lib/theme';
import { useIsMobile } from '@/hooks/use-mobile';

export function Background() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  // On mobile: reduce blob count to 2, shrink blur radius, disable third blob
  if (isDark) {
    return (
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0d1117] pointer-events-none" style={{ contain: 'strict' }}>
        <div className={`bg-blob ${isMobile ? '' : 'bg-blob-1'} absolute top-[-10%] left-[-10%] ${isMobile ? 'w-[60vw] h-[60vw] blur-[60px]' : 'w-[50vw] h-[50vw] blur-[120px]'} rounded-full`}
          style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)' }} />
        <div className={`bg-blob ${isMobile ? '' : 'bg-blob-2'} absolute top-[10%] right-[-10%] ${isMobile ? 'w-[50vw] h-[50vw] blur-[60px]' : 'w-[45vw] h-[45vw] blur-[130px]'} rounded-full`}
          style={{ backgroundColor: 'rgba(139, 92, 246, 0.10)' }} />
        {!isMobile && (
          <div className="bg-blob bg-blob-3 absolute bottom-[-10%] left-[15%] w-[60vw] h-[60vw] rounded-full blur-[140px]"
            style={{ backgroundColor: 'rgba(251, 146, 60, 0.08)' }} />
        )}
        {!isMobile && (
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFAFA] pointer-events-none" style={{ contain: 'strict' }}>
      <div className={`bg-blob ${isMobile ? '' : 'bg-blob-1'} absolute top-[-10%] left-[-10%] ${isMobile ? 'w-[60vw] h-[60vw] blur-[60px]' : 'w-[50vw] h-[50vw] blur-[100px]'} rounded-full bg-pink-200/50 mix-blend-multiply`} />
      <div className={`bg-blob ${isMobile ? '' : 'bg-blob-2'} absolute top-[10%] right-[-10%] ${isMobile ? 'w-[50vw] h-[50vw] blur-[60px]' : 'w-[45vw] h-[45vw] blur-[120px]'} rounded-full mix-blend-multiply`}
        style={{ backgroundColor: 'rgba(216, 180, 226, 0.4)' }} />
      {!isMobile && (
        <div className="bg-blob bg-blob-3 absolute bottom-[-10%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-orange-100/60 blur-[130px] mix-blend-multiply" />
      )}
      {!isMobile && (
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      )}
    </div>
  );
}
