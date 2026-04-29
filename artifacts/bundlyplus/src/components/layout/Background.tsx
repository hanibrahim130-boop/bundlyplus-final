import React from 'react';
import { useTheme } from '@/lib/theme';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Mobile high-refresh policy:
 * - Mobile: zero blur layers, zero animations. Single div with CSS radial-gradient
 *   background-image (rasterised once by the browser, zero per-frame cost).
 * - Desktop: animated blurred blobs (unchanged from previous version).
 */
export function Background() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  /* ── Mobile: single rasterised gradient, no blur, no animation ── */
  if (isMobile) {
    const bg = isDark
      ? 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(236,72,153,0.10) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 80% 30%, rgba(139,92,246,0.08) 0%, transparent 70%)'
      : 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(236,72,153,0.12) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 80% 30%, rgba(216,180,226,0.20) 0%, transparent 70%)';
    return (
      <div
        className={`fixed inset-0 z-[-1] pointer-events-none ${isDark ? 'bg-[#0d1117]' : 'bg-[#FAFAFA]'}`}
        style={{ backgroundImage: bg, contain: 'strict', contentVisibility: 'auto' }}
      />
    );
  }

  /* ── Desktop: lightweight animated blobs ── */
  /* Blur radii reduced ~60% (120-140→50-60px), blob sizes reduced,
     noise SVG overlay removed (fullscreen feTurbulence = expensive). */
  if (isDark) {
    return (
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0d1117] pointer-events-none" style={{ contain: 'strict' }}>
        <div className="bg-blob bg-blob-1 absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] blur-[50px] rounded-full"
          style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)' }} />
        <div className="bg-blob bg-blob-2 absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] blur-[55px] rounded-full"
          style={{ backgroundColor: 'rgba(139, 92, 246, 0.10)' }} />
        <div className="bg-blob bg-blob-3 absolute bottom-[-10%] left-[15%] w-[50vw] h-[50vw] rounded-full blur-[60px]"
          style={{ backgroundColor: 'rgba(251, 146, 60, 0.08)' }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFAFA] pointer-events-none" style={{ contain: 'strict' }}>
      <div className="bg-blob bg-blob-1 absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] blur-[45px] rounded-full bg-pink-200/50" />
      <div className="bg-blob bg-blob-2 absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] blur-[50px] rounded-full"
        style={{ backgroundColor: 'rgba(216, 180, 226, 0.4)' }} />
      <div className="bg-blob bg-blob-3 absolute bottom-[-10%] left-[15%] w-[50vw] h-[50vw] rounded-full bg-orange-100/60 blur-[55px]" />
    </div>
  );
}
