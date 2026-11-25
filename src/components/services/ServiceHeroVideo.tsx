import { MouseEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface ServiceHeroVideoProps {
  videoSrc: string;
  posterSrc: string;
  title: string;
  subtitle: string;
  ariaLabel: string;
  prefersReducedMotion: boolean;
}

/**
 * High-definition, self-hosted looping hero showcase video for Apokrin split-layout service pages.
 * Includes measured contrast scrim, accessible Play/Pause control, compositor-only progress bar,
 * prefers-reduced-motion respect, and automatic poster fallback.
 */
export function ServiceHeroVideo({
  videoSrc,
  posterSrc,
  title,
  subtitle,
  ariaLabel,
  prefersReducedMotion,
}: ServiceHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(!prefersReducedMotion);
  const [progress, setProgress] = useState<number>(0);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);

  useEffect(() => {
    setVideoFailed(false);
    setProgress(0);
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [videoSrc, prefersReducedMotion]);

  const handleTogglePlayback = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || videoFailed) return;

    if (video.paused) {
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const stopSliderPropagation = (e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="apokrin-clay-panel rounded-[1.85rem] border border-white/95 p-3 shadow-[0_24px_56px_-22px_rgba(37,99,235,0.22)]">
      <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-[1.2rem] bg-[#0A1128]">
        {videoFailed ? (
          <img
            src={posterSrc}
            alt={ariaLabel}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            key={videoSrc}
            src={videoSrc}
            poster={posterSrc}
            aria-label={ariaLabel}
            autoPlay={!prefersReducedMotion}
            loop
            muted
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (el.duration > 0) {
                setProgress(Math.min(1, Math.max(0, el.currentTime / el.duration)));
              }
            }}
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-cover"
          />
        )}

        {/* Subtle Top Edge Optical Sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0A1128]/25 to-transparent"
        />

        {/* Measured Bottom Contrast Scrim & Controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1128]/88 via-[#0A1128]/45 to-transparent px-4 pb-4 pt-12 sm:px-5 sm:pb-5">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold tracking-tight text-white sm:text-base">
                {title}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-slate-200/90">
                {subtitle}
              </p>
            </div>

            {!videoFailed && (
              <button
                type="button"
                onPointerDown={stopSliderPropagation}
                onClick={handleTogglePlayback}
                aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
                aria-pressed={isPlaying}
                className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#0A1128]/65 text-white backdrop-blur-md transition-transform duration-150 hover:scale-105 hover:bg-[#0A1128]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1128]"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4 translate-x-[1px]" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Compositor-Only Playback Progress Hairline */}
        {!videoFailed && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/15"
          >
            <div
              className="h-full w-full origin-left transition-transform duration-150 ease-linear"
              style={{
                transform: `scaleX(${progress})`,
                background: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
