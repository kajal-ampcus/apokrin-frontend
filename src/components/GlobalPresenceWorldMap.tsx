import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import countries110m from 'world-atlas/countries-110m.json';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GLOBAL_LOCATIONS, type GlobalLocation } from '../data/globalLocations';

const MAP_W = 1000;
const MAP_H = 480;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

interface ProjectedLocation extends GlobalLocation {
  svgX: number;
  svgY: number;
}

interface CountryPathItem {
  key: string;
  d: string;
  fill: string;
}

interface ConnectionArc {
  id: string;
  fromId: string;
  toId: string;
  d: string;
}

const REGION_BLUE_FILLS = ['#60A5FA', '#3B82F6', '#4F8DF5', '#5B9BF8'];

function buildArcPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const lift = Math.min(88, Math.max(16, dist * 0.23));
  const ctrlX = mx;
  const ctrlY = Math.max(10, my - lift);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function GlobalPresenceWorldMap() {
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 1000,
    height: 480,
  });

  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [pinnedLocationId, setPinnedLocationId] = useState<string | null>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    originPanX: number;
    originPanY: number;
    moved: boolean;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    originPanX: 0,
    originPanY: 0,
    moved: false,
  });

  // Build authentic Natural Earth world map paths & projected marker coordinates once
  const { countryPaths, graticulePath, projectedLocations, locationMap, connectionArcs } =
    useMemo(() => {
      const topology = countries110m as unknown as Topology<{
        countries: GeometryCollection;
      }>;
      const geo = feature(topology, topology.objects.countries) as FeatureCollection<Geometry>;

      // Exclude Antarctica ('010') so inhabited continents occupy maximum crisp detail
      const inhabitedFeatures: Feature<Geometry>[] = geo.features.filter(
        (f) => String(f.id ?? '') !== '010',
      );
      const inhabitedCollection: FeatureCollection<Geometry> = {
        type: 'FeatureCollection',
        features: inhabitedFeatures,
      };

      const projection = geoNaturalEarth1().fitExtent(
        [
          [16, 12],
          [MAP_W - 16, MAP_H - 12],
        ],
        inhabitedCollection,
      );
      const pathGen = geoPath(projection);

      const countries: CountryPathItem[] = inhabitedFeatures
        .map((f, index) => {
          const d = pathGen(f) ?? '';
          if (!d) return null;
          const numericId = Number(f.id ?? index) || index;
          return {
            key: String(f.id ?? `country-${index}`),
            d,
            fill: REGION_BLUE_FILLS[numericId % REGION_BLUE_FILLS.length],
          };
        })
        .filter((item): item is CountryPathItem => item !== null);

      const graticule = pathGen(geoGraticule10()) ?? '';

      const projected: ProjectedLocation[] = GLOBAL_LOCATIONS.map((loc) => {
        const coords = projection([loc.lon, loc.lat]) ?? [MAP_W / 2, MAP_H / 2];
        return {
          ...loc,
          svgX: coords[0],
          svgY: coords[1],
        };
      });

      const byId = new Map<string, ProjectedLocation>();
      projected.forEach((p) => byId.set(p.id, p));

      // Deduplicated curved global connection arcs
      const seenPairs = new Set<string>();
      const arcs: ConnectionArc[] = [];
      projected.forEach((origin) => {
        origin.connections.forEach((targetId) => {
          const target = byId.get(targetId);
          if (!target) return;
          const pairKey = [origin.id, target.id].sort().join('--');
          if (seenPairs.has(pairKey)) return;
          seenPairs.add(pairKey);
          arcs.push({
            id: pairKey,
            fromId: origin.id,
            toId: target.id,
            d: buildArcPath(origin.svgX, origin.svgY, target.svgX, target.svgY),
          });
        });
      });

      return {
        countryPaths: countries,
        graticulePath: graticule,
        projectedLocations: projected,
        locationMap: byId,
        connectionArcs: arcs,
      };
    }, []);

  // Measure map viewport container for accurate screen projection & tooltip collision avoidance
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateSize = () => {
      setViewportSize({
        width: el.clientWidth || 1000,
        height: el.clientHeight || 480,
      });
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close active tooltip on outside click or Escape key
  useEffect(() => {
    const handleDocPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('[data-map-marker="true"]') ||
        target.closest('[data-map-tooltip="true"]')
      ) {
        return;
      }
      setActiveLocationId(null);
      setPinnedLocationId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveLocationId(null);
        setPinnedLocationId(null);
      }
    };

    document.addEventListener('pointerdown', handleDocPointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleDocPointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fitted SVG rect inside viewportSize
  const fittedStage = useMemo(() => {
    const cw = viewportSize.width || 1000;
    const ch = viewportSize.height || 480;
    const scaleFit = Math.min(cw / MAP_W, ch / MAP_H);
    const fitW = MAP_W * scaleFit;
    const fitH = MAP_H * scaleFit;
    const offsetX = (cw - fitW) / 2;
    const offsetY = (ch - fitH) / 2;
    return { cw, ch, scaleFit, fitW, fitH, offsetX, offsetY };
  }, [viewportSize.height, viewportSize.width]);

  const clampPan = useCallback(
    (nextX: number, nextY: number, targetZoom: number) => {
      if (targetZoom <= 1.01) {
        return { x: 0, y: 0 };
      }
      const maxPanX = ((targetZoom - 1) * fittedStage.cw) / 2 + 36;
      const maxPanY = ((targetZoom - 1) * fittedStage.ch) / 2 + 28;
      return {
        x: Math.min(Math.max(nextX, -maxPanX), maxPanX),
        y: Math.min(Math.max(nextY, -maxPanY), maxPanY),
      };
    },
    [fittedStage.ch, fittedStage.cw],
  );

  // Convert SVG (x, y) into container pixel coordinates under current zoom & pan
  const projectToContainer = useCallback(
    (svgX: number, svgY: number) => {
      const bx = fittedStage.offsetX + svgX * fittedStage.scaleFit;
      const by = fittedStage.offsetY + svgY * fittedStage.scaleFit;
      const cx = fittedStage.cw / 2;
      const cy = fittedStage.ch / 2;
      return {
        px: cx + (bx - cx) * zoom + pan.x,
        py: cy + (by - cy) * zoom + pan.y,
      };
    },
    [fittedStage, pan.x, pan.y, zoom],
  );

  const handleZoomIn = () => {
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Number((prev + 0.45).toFixed(2)));
      setPan((currPan) => clampPan(currPan.x * (next / prev), currPan.y * (next / prev), next));
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(MIN_ZOOM, Number((prev - 0.45).toFixed(2)));
      setPan((currPan) =>
        next <= 1.01
          ? { x: 0, y: 0 }
          : clampPan(currPan.x * (next / prev), currPan.y * (next / prev), next),
      );
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveLocationId(null);
    setPinnedLocationId(null);
  };

  // Pointer drag-to-pan on map canvas
  const handleViewportPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (
      target?.closest('[data-map-marker="true"]') ||
      target?.closest('[data-map-tooltip="true"]')
    ) {
      return;
    }
    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originPanX: pan.x,
      originPanY: pan.y,
      moved: false,
    };
    if (zoom > 1.01) {
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleViewportPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId !== e.pointerId || zoom <= 1.01) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      state.moved = true;
    }
    if (state.moved) {
      setPan(clampPan(state.originPanX + dx, state.originPanY + dy, zoom));
    }
  };

  const handleViewportPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId === e.pointerId) {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      if (!state.moved) {
        setActiveLocationId(null);
        setPinnedLocationId(null);
      }
      dragStateRef.current.pointerId = null;
      setIsDragging(false);
    }
  };

  const handleMarkerPointerEnter = (e: ReactPointerEvent<HTMLButtonElement>, locId: string) => {
    if (e.pointerType === 'mouse') {
      setActiveLocationId(locId);
    }
  };

  const handleMarkerPointerLeave = (e: ReactPointerEvent<HTMLButtonElement>, locId: string) => {
    if (e.pointerType === 'mouse') {
      setActiveLocationId((curr) => {
        if (pinnedLocationId) return pinnedLocationId;
        return curr === locId ? null : curr;
      });
    }
  };

  const handleMarkerClick = (loc: ProjectedLocation) => {
    if (pinnedLocationId === loc.id && activeLocationId === loc.id) {
      setPinnedLocationId(null);
      setActiveLocationId(null);
    } else {
      setActiveLocationId(loc.id);
      setPinnedLocationId(loc.id);
    }
  };

  const handleMarkerKeyDown = (
    e: ReactKeyboardEvent<HTMLButtonElement>,
    loc: ProjectedLocation,
  ) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setActiveLocationId(null);
      setPinnedLocationId(null);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMarkerClick(loc);
    }
  };

  const activeLocation = activeLocationId ? locationMap.get(activeLocationId) ?? null : null;

  // Compute safe, unclipped floating tooltip coordinates & pointer alignment
  const tooltipLayout = useMemo(() => {
    if (!activeLocation) return null;
    const { px, py } = projectToContainer(activeLocation.svgX, activeLocation.svgY);
    const { cw, ch } = fittedStage;
    const tooltipW = Math.min(256, Math.max(210, cw - 24));
    const estimatedTooltipH = 148;
    const margin = 10;
    const markerGap = 16;

    const placeBelow = py - estimatedTooltipH - markerGap < margin;
    const top = placeBelow
      ? Math.min(py + markerGap, Math.max(margin, ch - estimatedTooltipH - margin))
      : Math.max(py - markerGap, estimatedTooltipH + margin);

    const minCenter = tooltipW / 2 + margin;
    const maxCenter = Math.max(minCenter, cw - tooltipW / 2 - margin);
    const clampedLeft = Math.min(Math.max(px, minCenter), maxCenter);

    const maxPointerOffset = tooltipW / 2 - 20;
    const pointerOffset = Math.min(
      Math.max(px - clampedLeft, -maxPointerOffset),
      maxPointerOffset,
    );

    return {
      location: activeLocation,
      width: tooltipW,
      left: clampedLeft,
      top,
      placeBelow,
      pointerOffset,
    };
  }, [activeLocation, fittedStage, projectToContainer]);

  return (
    <div className="w-full">
      {/* Minimal Borderless Inline Controls Row (No Outer Card or Box) */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-medium text-[#475569]">
          <div className="flex items-center gap-2 text-[#0A1128]">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full border-2 border-white bg-[#F43F5E] shadow-[0_0_0_2px_rgba(244,63,94,0.28)]"
            />
            <span className="font-display font-bold tabular-nums">15 Global Locations</span>
          </div>

          <span className="hidden h-3.5 w-px bg-[#CBD5E1] sm:inline-block" aria-hidden="true" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full border-2 border-white bg-gradient-to-br from-[#FB7185] to-[#EC4899] ring-1 ring-[#F43F5E]/30"
              />
              <span>Branch Marker</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden="true">
                <path
                  d="M 1 4 Q 10 1 19 4"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.75"
                  strokeDasharray="3 2.5"
                />
              </svg>
              <span>Global Link</span>
            </div>
          </div>
        </div>

        {/* Compact Zoom / Pan Controls */}
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-[#64748B] md:inline">
            {zoom > 1.01 ? 'Drag to pan · Click marker' : 'Hover or click any marker'}
          </span>

          <div className="inline-flex items-center gap-0.5 rounded-lg bg-white/75 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in world map"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#0A1128] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out world map"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#0A1128] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetView}
              aria-label="Reset world map view"
              title="Reset view"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#0A1128] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Standalone Full-Width Borderless World Map Visualization */}
      <div
        ref={viewportRef}
        onPointerDown={handleViewportPointerDown}
        onPointerMove={handleViewportPointerMove}
        onPointerUp={handleViewportPointerUp}
        onPointerCancel={handleViewportPointerUp}
        onDoubleClick={handleZoomIn}
        role="region"
        aria-label="Interactive world map showing 15 global locations"
        className={`relative aspect-[16/10] max-h-[540px] w-full min-h-[260px] overflow-hidden select-none sm:aspect-[1000/480] ${
          zoom > 1.01 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        style={{
          touchAction: zoom > 1.01 ? 'none' : 'pan-y',
        }}
      >
        {/* Subtle Moving / Rotating Atmospheric Orbital Effect */}
        <div
          aria-hidden="true"
          className="apokrin-map-ambient-ring pointer-events-none absolute -left-[10%] -top-[16%] h-[132%] w-[120%] opacity-55"
        >
          <svg viewBox="0 0 1000 480" className="h-full w-full">
            <defs>
              <radialGradient id="apokrin-map-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.18" />
                <stop offset="68%" stopColor="#BFDBFE" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="500" cy="240" r="300" fill="url(#apokrin-map-glow)" />
            <ellipse
              cx="500"
              cy="240"
              rx="430"
              ry="188"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="0.9"
              strokeDasharray="6 10"
              opacity="0.45"
            />
          </svg>
        </div>

        {/* Zoomable & Pannable Layer: Vector Map + Locked Markers */}
        <div
          className={`relative h-full w-full ${
            isDragging ? '' : 'transition-transform duration-300 ease-out'
          }`}
          style={{
            transformOrigin: 'center center',
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          }}
        >
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <filter id="apokrin-land-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="2.5"
                  floodColor="#1E3A8A"
                  floodOpacity="0.12"
                />
              </filter>
              <linearGradient id="apokrin-arc-active" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>

            {/* Subtle Latitude / Longitude Graticule Lines */}
            <path d={graticulePath} fill="none" stroke="#CBD5E1" strokeWidth={0.5} opacity={0.4} />

            {/* Blue Geographical Country Regions */}
            <g filter="url(#apokrin-land-shadow)">
              {countryPaths.map((country) => (
                <path
                  key={country.key}
                  d={country.d}
                  fill={country.fill}
                  fillOpacity={0.88}
                  stroke="#F8FAFC"
                  strokeWidth={0.65 / Math.sqrt(zoom)}
                  className="transition-opacity duration-200 hover:fill-opacity-100"
                />
              ))}
            </g>

            {/* Animated Connection Arcs Between Selected / Global Locations */}
            <g>
              {connectionArcs.map((arc) => {
                const isConnectedToActive =
                  activeLocationId !== null &&
                  (arc.fromId === activeLocationId || arc.toId === activeLocationId);

                return (
                  <g key={arc.id}>
                    <path
                      d={arc.d}
                      fill="none"
                      stroke={isConnectedToActive ? 'url(#apokrin-arc-active)' : '#2563EB'}
                      strokeWidth={(isConnectedToActive ? 2.1 : 0.95) / Math.sqrt(zoom)}
                      strokeDasharray={isConnectedToActive ? '6 4' : '3 5'}
                      strokeLinecap="round"
                      opacity={activeLocationId ? (isConnectedToActive ? 0.92 : 0.16) : 0.28}
                      className={isConnectedToActive ? 'apokrin-arc-dash-flow' : ''}
                    />

                    {isConnectedToActive && !prefersReducedMotion && (
                      <circle
                        r={3.2 / Math.sqrt(zoom)}
                        fill="#F43F5E"
                        stroke="#FFFFFF"
                        strokeWidth={1 / Math.sqrt(zoom)}
                      >
                        <animateMotion dur="2.2s" repeatCount="indefinite" path={arc.d} />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Exact-Aligned Marker Overlay Inside Same Pan/Zoom Coordinate Space */}
          <div
            className="pointer-events-none absolute"
            style={{
              left: `${fittedStage.offsetX}px`,
              top: `${fittedStage.offsetY}px`,
              width: `${fittedStage.fitW}px`,
              height: `${fittedStage.fitH}px`,
            }}
          >
            {projectedLocations.map((loc, index) => {
              const isActive = activeLocationId === loc.id;

              return (
                <button
                  key={loc.id}
                  type="button"
                  data-map-marker="true"
                  onPointerEnter={(e) => handleMarkerPointerEnter(e, loc.id)}
                  onPointerLeave={(e) => handleMarkerPointerLeave(e, loc.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerClick(loc);
                  }}
                  onFocus={() => setActiveLocationId(loc.id)}
                  onKeyDown={(e) => handleMarkerKeyDown(e, loc)}
                  aria-label={`${loc.title} — ${loc.landmark}, Population ${loc.population}, Timezone ${loc.timezone}`}
                  aria-expanded={isActive}
                  style={{
                    left: `${(loc.svgX / MAP_W) * 100}%`,
                    top: `${(loc.svgY / MAP_H) * 100}%`,
                    zIndex: isActive ? 30 : 15,
                    transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                  }}
                  className="pointer-events-auto group absolute flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A1128] focus-visible:ring-offset-1 sm:h-4.5 sm:w-4.5"
                >
                  {/* Pulsing Rose/Pink Halo Ring */}
                  <span
                    aria-hidden="true"
                    style={{ animationDelay: `${(index % 5) * 0.42}s` }}
                    className={`apokrin-marker-pulse-ring absolute h-4.5 w-4.5 rounded-full ${
                      isActive ? 'bg-[#F43F5E]/55' : 'bg-[#F43F5E]/40'
                    }`}
                  />

                  {/* Active Selection Halo */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute h-6 w-6 rounded-full bg-[#EC4899]/25 ring-2 ring-[#F43F5E]/45"
                    />
                  )}

                  {/* White-Bordered Circular Marker with Red/Pink Center Accent */}
                  <span
                    aria-hidden="true"
                    className={`relative flex items-center justify-center rounded-full border-[2.5px] border-white bg-gradient-to-br from-[#FB7185] via-[#F43F5E] to-[#EC4899] shadow-[0_3px_10px_rgba(225,29,72,0.42)] transition-transform duration-200 ${
                      isActive
                        ? 'h-4.5 w-4.5 scale-115 shadow-[0_0_16px_rgba(244,63,94,0.65)]'
                        : 'h-3.5 w-3.5 group-hover:scale-125'
                    }`}
                  >
                    <span className="h-1 w-1 rounded-full bg-white/90" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Single Dynamic Floating Dark Navy Tooltip (#1E293B) */}
        <AnimatePresence>
          {tooltipLayout && (
            <div
              key={`anchor-${tooltipLayout.location.id}`}
              style={{
                left: `${tooltipLayout.left}px`,
                top: `${tooltipLayout.top}px`,
              }}
              className={`pointer-events-none absolute z-40 -translate-x-1/2 ${
                tooltipLayout.placeBelow ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              <motion.div
                data-map-tooltip="true"
                role="dialog"
                aria-label={tooltipLayout.location.title}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: tooltipLayout.placeBelow ? -8 : 8, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: tooltipLayout.placeBelow ? -4 : 4, scale: 0.97 }
                }
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: `${tooltipLayout.width}px` }}
                className="pointer-events-auto relative rounded-xl bg-[#1E293B] px-4 py-3.5 text-left shadow-[0_20px_44px_-10px_rgba(15,23,42,0.52)] ring-1 ring-white/10"
              >
                {/* Header: City, Country + Close button for touch/keyboard convenience */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-[15px] font-bold leading-snug text-white">
                    {tooltipLayout.location.title}
                  </h4>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLocationId(null);
                      setPinnedLocationId(null);
                    }}
                    aria-label="Close location tooltip"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Landmark & Address in Light Grey */}
                <p className="mt-1.5 text-xs font-medium text-slate-200">
                  {tooltipLayout.location.landmark}
                </p>
                <p className="mt-0.5 text-xs text-slate-300">
                  {tooltipLayout.location.address}
                </p>

                {/* Thin Divider */}
                <div className="my-2.5 border-t border-slate-600/60" />

                {/* Muted Grey Population & Timezone */}
                <p className="text-[11px] font-medium text-slate-400 tabular-nums">
                  Population: {tooltipLayout.location.population} | Timezone:{' '}
                  {tooltipLayout.location.timezone}
                </p>

                {/* Small Triangular Tooltip Pointer */}
                <span
                  aria-hidden="true"
                  style={{
                    left: `calc(50% + ${tooltipLayout.pointerOffset}px)`,
                  }}
                  className={`absolute h-3 w-3 -translate-x-1/2 rotate-45 bg-[#1E293B] ${
                    tooltipLayout.placeBelow ? '-top-1.5' : '-bottom-1.5'
                  }`}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
