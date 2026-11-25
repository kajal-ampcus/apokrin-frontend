import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme, type BrandThemeId } from '../theme/themeConfig';

interface NetworkPalette {
  nodePrimary: number;
  nodeSecondary: number;
  nodeSlate: number;
  lineStart: number;
  lineEnd: number;
  pulse: number;
  grid: number;
}

const THEME_NETWORK_PALETTES: Record<BrandThemeId, NetworkPalette> = {
  blue: {
    nodePrimary: 0x2563eb,
    nodeSecondary: 0x0891b2,
    nodeSlate: 0x94a3b8,
    lineStart: 0x60a5fa,
    lineEnd: 0x94a3b8,
    pulse: 0x06b6d4,
    grid: 0xcbd5e1,
  },
  green: {
    nodePrimary: 0x16a34a,
    nodeSecondary: 0x0891b2,
    nodeSlate: 0x94a3b8,
    lineStart: 0x4ade80,
    lineEnd: 0x94a3b8,
    pulse: 0x65a30d,
    grid: 0xcbd5e1,
  },
  orange: {
    nodePrimary: 0xea580c,
    nodeSecondary: 0x2563eb,
    nodeSlate: 0x94a3b8,
    lineStart: 0xfb923c,
    lineEnd: 0x94a3b8,
    pulse: 0xf59e0b,
    grid: 0xcbd5e1,
  },
};

interface MovingNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseScale: number;
  spinPhase: number;
  colorSlot: 0 | 1 | 2;
}

interface DataPulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  active: boolean;
}

const NODE_COUNT = 54;
const MAX_EDGE_SEGMENTS = 180;
const PULSE_COUNT = 10;

// Module-scoped scratch helpers (zero GC inside animation loop)
const _obj3D = new THREE.Object3D();
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _colorC = new THREE.Color();
const _lineColA = new THREE.Color();
const _lineColB = new THREE.Color();

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

/**
 * Minimalist, professional zero-WebGL connected-node mesh fallback for mobile viewports (< 768px)
 * or environments without WebGL. Zero bubbles or decorative orbs — strictly clean hairline geometry.
 */
function LightweightNetworkBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 420 840"
        preserveAspectRatio="xMidYMid slice"
        className={`h-full w-full opacity-55 ${reducedMotion ? '' : 'apokrin-geo-float'}`}
      >
        {/* Left margin minimalist connected node network */}
        <g stroke="#64748B" strokeOpacity="0.24" strokeWidth="0.85">
          <line x1="18" y1="92" x2="62" y2="144" />
          <line x1="62" y1="144" x2="28" y2="218" />
          <line x1="28" y1="218" x2="78" y2="270" />
          <line x1="18" y1="92" x2="28" y2="218" />
          <line x1="22" y1="490" x2="66" y2="548" />
          <line x1="66" y1="548" x2="30" y2="624" />
          <line x1="30" y1="624" x2="74" y2="692" />
          <line x1="22" y1="490" x2="30" y2="624" />
        </g>

        {/* Right margin minimalist connected node network */}
        <g stroke="#3B82F6" strokeOpacity="0.22" strokeWidth="0.85">
          <line x1="402" y1="126" x2="356" y2="188" />
          <line x1="356" y1="188" x2="394" y2="256" />
          <line x1="394" y1="256" x2="348" y2="322" />
          <line x1="402" y1="126" x2="394" y2="256" />
          <line x1="396" y1="544" x2="352" y2="608" />
          <line x1="352" y1="608" x2="398" y2="676" />
          <line x1="398" y1="676" x2="358" y2="748" />
          <line x1="396" y1="544" x2="398" y2="676" />
        </g>

        {/* Crisp diamond micro-nodes */}
        <g fill="#2563EB" fillOpacity="0.45">
          <polygon points="18,89 21,92 18,95 15,92" />
          <polygon points="62,141 65,144 62,147 59,144" />
          <polygon points="28,215 31,218 28,221 25,218" />
          <polygon points="78,267 81,270 78,273 75,270" />
          <polygon points="22,487 25,490 22,493 19,490" />
          <polygon points="66,545 69,548 66,551 63,548" />
          <polygon points="30,621 33,624 30,627 27,624" />
          <polygon points="74,689 77,692 74,695 71,692" />
        </g>
        <g fill="#0891B2" fillOpacity="0.45">
          <polygon points="402,123 405,126 402,129 399,126" />
          <polygon points="356,185 359,188 356,191 353,188" />
          <polygon points="394,253 397,256 394,259 391,256" />
          <polygon points="348,319 351,322 348,325 345,322" />
          <polygon points="396,541 399,544 396,547 393,544" />
          <polygon points="352,605 355,608 352,611 349,608" />
          <polygon points="398,673 401,676 398,679 395,676" />
          <polygon points="358,745 361,748 358,751 355,748" />
        </g>
      </svg>
    </div>
  );
}

export function GlobalAmbient3DBackground() {
  const { theme } = useTheme();
  const themeRef = useRef<BrandThemeId>(theme);
  themeRef.current = theme;

  const mountRef = useRef<HTMLDivElement | null>(null);

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 767px)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMobile = () => setIsMobileViewport(mobileMq.matches);
    const syncMotion = () => setPrefersReducedMotion(motionMq.matches);

    syncMobile();
    syncMotion();

    mobileMq.addEventListener('change', syncMobile);
    motionMq.addEventListener('change', syncMotion);
    return () => {
      mobileMq.removeEventListener('change', syncMobile);
      motionMq.removeEventListener('change', syncMotion);
    };
  }, []);

  useEffect(() => {
    if (isMobileViewport || webglUnavailable) return;
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
        depth: true,
        stencil: false,
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = window.innerWidth || 1280;
    const height = window.innerHeight || 800;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const canvasEl = renderer.domElement;
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.display = 'block';
    canvasEl.style.pointerEvents = 'none';
    container.innerHTML = '';
    container.appendChild(canvasEl);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.032);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
    camera.position.set(0, 0, 13.5);

    const disposables: {
      geometries: THREE.BufferGeometry[];
      materials: THREE.Material[];
    } = { geometries: [], materials: [] };

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const getVisibleHalfBounds = () => {
      const vFovRad = THREE.MathUtils.degToRad(camera.fov);
      const halfH = Math.tan(vFovRad / 2) * camera.position.z;
      const halfW = halfH * camera.aspect;
      return { halfW, halfH };
    };
    let bounds = getVisibleHalfBounds();

    const initialPalette = THEME_NETWORK_PALETTES[themeRef.current];

    // =========================================================================
    // 1. ARCHITECTURAL SUBTLE MICRO-GRID (Ultra-faint technical coordinate plane)
    // =========================================================================
    const buildSubtleGrid = () => {
      const cols = 16;
      const rows = 9;
      const spanX = 22;
      const spanY = 12;
      const pts: number[] = [];

      for (let i = 0; i <= cols; i++) {
        const x = -spanX / 2 + (i / cols) * spanX;
        pts.push(x, -spanY / 2, -6.5, x, spanY / 2, -6.5);
      }
      for (let j = 0; j <= rows; j++) {
        const y = -spanY / 2 + (j / rows) * spanY;
        pts.push(-spanX / 2, y, -6.5, spanX / 2, y, -6.5);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const mat = new THREE.LineBasicMaterial({
        color: initialPalette.grid,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      });
      disposables.geometries.push(geo);
      disposables.materials.push(mat);
      return { mesh: new THREE.LineSegments(geo, mat), mat };
    };
    const subtleGrid = buildSubtleGrid();
    stageGroup.add(subtleGrid.mesh);

    // =========================================================================
    // 2. MOVABLE PRECISION NODES (Crisp geometric micro-octahedrons, zero bubbles)
    // =========================================================================
    const rand = seededRandom(20261120);
    const nodes: MovingNode[] = [];
    const boundPadX = 1.05;
    const boundPadY = 1.05;

    for (let i = 0; i < NODE_COUNT; i++) {
      // Distribute naturally across the scene with a slight peripheral bias for cleaner center reading
      const isPeripheral = i < Math.floor(NODE_COUNT * 0.72);
      const side = i % 2 === 0 ? -1 : 1;
      const x = isPeripheral
        ? side * (0.42 + rand() * 0.62) * bounds.halfW
        : (rand() * 2 - 1) * bounds.halfW * 0.92;
      const y = (rand() * 2 - 1) * bounds.halfH * 0.98;
      const z = -4.2 + rand() * 3.8;

      const angle = rand() * Math.PI * 2;
      const speed = 0.22 + rand() * 0.28;

      nodes.push({
        x,
        y,
        z,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (rand() - 0.5) * 0.12,
        baseScale: 0.75 + rand() * 0.65,
        spinPhase: rand() * Math.PI * 2,
        colorSlot: (i % 3) as 0 | 1 | 2,
      });
    }

    const nodeGeo = new THREE.OctahedronGeometry(0.052, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    disposables.geometries.push(nodeGeo);
    disposables.materials.push(nodeMat);

    const nodeInstances = new THREE.InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
    nodeInstances.frustumCulled = false;
    stageGroup.add(nodeInstances);

    const applyNodeColors = (pal: NetworkPalette) => {
      _colorA.setHex(pal.nodePrimary);
      _colorB.setHex(pal.nodeSecondary);
      _colorC.setHex(pal.nodeSlate);
      for (let i = 0; i < NODE_COUNT; i++) {
        const slot = nodes[i].colorSlot;
        const c = slot === 0 ? _colorA : slot === 1 ? _colorB : _colorC;
        nodeInstances.setColorAt(i, c);
      }
      if (nodeInstances.instanceColor) {
        nodeInstances.instanceColor.needsUpdate = true;
      }
    };
    applyNodeColors(initialPalette);

    // =========================================================================
    // 3. DYNAMIC HAIRLINE CONNECTIONS (Smooth distance-faded tech mesh)
    // =========================================================================
    const linePosBuffer = new Float32Array(MAX_EDGE_SEGMENTS * 2 * 3);
    const lineColBuffer = new Float32Array(MAX_EDGE_SEGMENTS * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePosBuffer, 3);
    const lineColAttr = new THREE.BufferAttribute(lineColBuffer, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineColAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', linePosAttr);
    lineGeo.setAttribute('color', lineColAttr);
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    disposables.geometries.push(lineGeo);
    disposables.materials.push(lineMat);

    const networkLines = new THREE.LineSegments(lineGeo, lineMat);
    networkLines.frustumCulled = false;
    stageGroup.add(networkLines);

    // =========================================================================
    // 4. CRISP DATA-SIGNAL PULSES GLIDING ALONG CONNECTED EDGES
    // =========================================================================
    const pulseGeo = new THREE.OctahedronGeometry(0.036, 0);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: initialPalette.pulse,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    disposables.geometries.push(pulseGeo);
    disposables.materials.push(pulseMat);

    const pulseInstances = new THREE.InstancedMesh(pulseGeo, pulseMat, PULSE_COUNT);
    pulseInstances.frustumCulled = false;
    stageGroup.add(pulseInstances);

    const pulses: DataPulse[] = Array.from({ length: PULSE_COUNT }, (_, idx) => ({
      fromIdx: idx % NODE_COUNT,
      toIdx: (idx + 1) % NODE_COUNT,
      progress: (idx / PULSE_COUNT) % 1,
      speed: 0.35 + (idx % 4) * 0.08,
      active: false,
    }));

    // Active edge cache for assigning pulses without heap allocations
    const activeEdgeFrom = new Int16Array(MAX_EDGE_SEGMENTS);
    const activeEdgeTo = new Int16Array(MAX_EDGE_SEGMENTS);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Smooth interactive pointer & scroll motion targets
    let pointerNdcX = 0;
    let pointerNdcY = 0;
    let pointerActive = false;
    let pointerWorldX = 999;
    let pointerWorldY = 999;
    let smoothedCamX = 0;
    let smoothedCamY = 0;
    let scrollTargetY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      pointerActive = true;
      pointerNdcX = (e.clientX / (window.innerWidth || 1)) * 2 - 1;
      pointerNdcY = -((e.clientY / (window.innerHeight || 1)) * 2 - 1);
      pointerWorldX = pointerNdcX * bounds.halfW;
      pointerWorldY = pointerNdcY * bounds.halfH;
    };

    const handlePointerLeave = () => {
      pointerActive = false;
      pointerNdcX = 0;
      pointerNdcY = 0;
    };

    const handleScroll = () => {
      // Smooth continuous vertical parallax glide while scrolling through pages
      const scrollNorm = window.scrollY / Math.max(window.innerHeight, 650);
      scrollTargetY = Math.sin(scrollNorm * 0.55) * 0.42;
    };

    const handleResize = () => {
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 800;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(w, h);
      bounds = getVisibleHalfBounds();
    };

    let activeThemeApplied: BrandThemeId = themeRef.current;

    const updateSimulation = (dt: number, elapsed: number) => {
      const targetTheme = themeRef.current;
      const pal = THEME_NETWORK_PALETTES[targetTheme];
      if (activeThemeApplied !== targetTheme) {
        activeThemeApplied = targetTheme;
        applyNodeColors(pal);
        pulseMat.color.setHex(pal.pulse);
      }

      // Smooth damped camera/stage parallax from mouse & scroll
      smoothedCamX = THREE.MathUtils.damp(smoothedCamX, pointerNdcX * 0.45, 2.6, dt);
      smoothedCamY = THREE.MathUtils.damp(
        smoothedCamY,
        pointerNdcY * 0.32 + scrollTargetY,
        2.6,
        dt,
      );
      stageGroup.position.set(-smoothedCamX, -smoothedCamY, 0);
      stageGroup.rotation.y = THREE.MathUtils.damp(
        stageGroup.rotation.y,
        pointerNdcX * 0.045,
        2.4,
        dt,
      );
      stageGroup.rotation.x = THREE.MathUtils.damp(
        stageGroup.rotation.x,
        -pointerNdcY * 0.03,
        2.4,
        dt,
      );

      const limitX = bounds.halfW * boundPadX;
      const limitY = bounds.halfH * boundPadY;
      const minZ = -4.5;
      const maxZ = -0.3;

      // Advance moving nodes smoothly with gentle cursor flow response & soft edge bounce
      const cursorRadius = 2.6;
      const cursorRadiusSq = cursorRadius * cursorRadius;

      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];

        n.x += n.vx * dt;
        n.y += n.vy * dt;
        n.z += n.vz * dt;

        // Subtle interactive drift away from pointer for tactile "movable" feel
        if (pointerActive) {
          const dx = n.x - pointerWorldX;
          const dy = n.y - pointerWorldY;
          const dSq = dx * dx + dy * dy;
          if (dSq > 0.01 && dSq < cursorRadiusSq) {
            const dist = Math.sqrt(dSq);
            const push = (1 - dist / cursorRadius) * 0.55 * dt;
            n.x += (dx / dist) * push;
            n.y += (dy / dist) * push;
          }
        }

        // Seamless wrap-around / soft reversal so nodes continuously glide without bunching
        if (n.x > limitX) {
          n.x = limitX;
          n.vx = -Math.abs(n.vx);
        } else if (n.x < -limitX) {
          n.x = -limitX;
          n.vx = Math.abs(n.vx);
        }

        if (n.y > limitY) {
          n.y = limitY;
          n.vy = -Math.abs(n.vy);
        } else if (n.y < -limitY) {
          n.y = -limitY;
          n.vy = Math.abs(n.vy);
        }

        if (n.z > maxZ) {
          n.z = maxZ;
          n.vz = -Math.abs(n.vz);
        } else if (n.z < minZ) {
          n.z = minZ;
          n.vz = Math.abs(n.vz);
        }

        _obj3D.position.set(n.x, n.y, n.z);
        _obj3D.rotation.set(elapsed * 0.25 + n.spinPhase, elapsed * 0.32 + n.spinPhase, 0);
        _obj3D.scale.setScalar(n.baseScale);
        _obj3D.updateMatrix();
        nodeInstances.setMatrixAt(i, _obj3D.matrix);
      }
      nodeInstances.instanceMatrix.needsUpdate = true;

      // Build smooth, distance-faded hairline connections between moving nodes
      _lineColA.setHex(pal.lineStart);
      _lineColB.setHex(pal.lineEnd);
      const maxConnectDist = Math.min(3.15, Math.max(2.3, bounds.halfW * 0.34));
      const maxDistSq = maxConnectDist * maxConnectDist;

      let segCount = 0;
      for (let i = 0; i < NODE_COUNT && segCount < MAX_EDGE_SEGMENTS; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < NODE_COUNT && segCount < MAX_EDGE_SEGMENTS; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dSq = dx * dx + dy * dy + dz * dz;

          if (dSq < maxDistSq) {
            const proximity = 1 - Math.sqrt(dSq) / maxConnectDist;
            // Fade toward crisp white (#ffffff) as nodes move apart so connections appear/disappear seamlessly
            const fade = proximity * proximity;
            const inv = 1 - fade;

            const offset = segCount * 6;
            linePosBuffer[offset] = a.x;
            linePosBuffer[offset + 1] = a.y;
            linePosBuffer[offset + 2] = a.z;
            linePosBuffer[offset + 3] = b.x;
            linePosBuffer[offset + 4] = b.y;
            linePosBuffer[offset + 5] = b.z;

            lineColBuffer[offset] = _lineColA.r * fade + inv;
            lineColBuffer[offset + 1] = _lineColA.g * fade + inv;
            lineColBuffer[offset + 2] = _lineColA.b * fade + inv;
            lineColBuffer[offset + 3] = _lineColB.r * fade + inv;
            lineColBuffer[offset + 4] = _lineColB.g * fade + inv;
            lineColBuffer[offset + 5] = _lineColB.b * fade + inv;

            activeEdgeFrom[segCount] = i;
            activeEdgeTo[segCount] = j;
            segCount++;
          }
        }
      }

      // Add subtle interactive connections to cursor position for live responsiveness
      if (pointerActive && segCount < MAX_EDGE_SEGMENTS) {
        const pointerConnectDist = 2.45;
        const pointerDistSq = pointerConnectDist * pointerConnectDist;
        let pointerLinks = 0;
        for (let i = 0; i < NODE_COUNT && segCount < MAX_EDGE_SEGMENTS && pointerLinks < 4; i++) {
          const n = nodes[i];
          const dx = n.x - pointerWorldX;
          const dy = n.y - pointerWorldY;
          const dSq = dx * dx + dy * dy;
          if (dSq < pointerDistSq) {
            const proximity = 1 - Math.sqrt(dSq) / pointerConnectDist;
            const fade = proximity * 0.72;
            const inv = 1 - fade;
            const offset = segCount * 6;

            linePosBuffer[offset] = n.x;
            linePosBuffer[offset + 1] = n.y;
            linePosBuffer[offset + 2] = n.z;
            linePosBuffer[offset + 3] = pointerWorldX;
            linePosBuffer[offset + 4] = pointerWorldY;
            linePosBuffer[offset + 5] = -1.6;

            lineColBuffer[offset] = _lineColA.r * fade + inv;
            lineColBuffer[offset + 1] = _lineColA.g * fade + inv;
            lineColBuffer[offset + 2] = _lineColA.b * fade + inv;
            lineColBuffer[offset + 3] = _lineColA.r * fade + inv;
            lineColBuffer[offset + 4] = _lineColA.g * fade + inv;
            lineColBuffer[offset + 5] = _lineColA.b * fade + inv;

            segCount++;
            pointerLinks++;
          }
        }
      }

      lineGeo.setDrawRange(0, segCount * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      // Update crisp signal pulses gliding along active edges
      const nodeEdgeCount = Math.max(0, segCount - (pointerActive ? 4 : 0));
      for (let p = 0; p < PULSE_COUNT; p++) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed * dt;
        if (pulse.progress >= 1 || !pulse.active) {
          if (nodeEdgeCount > 0) {
            const edgePick = Math.floor((p * 7 + elapsed * 3) % nodeEdgeCount);
            pulse.fromIdx = activeEdgeFrom[edgePick];
            pulse.toIdx = activeEdgeTo[edgePick];
            pulse.progress = pulse.progress % 1;
            pulse.active = true;
          } else {
            pulse.active = false;
          }
        }

        if (pulse.active) {
          const a = nodes[pulse.fromIdx];
          const b = nodes[pulse.toIdx];
          const t = pulse.progress;
          _obj3D.position.set(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
            a.z + (b.z - a.z) * t,
          );
          const archScale = Math.sin(t * Math.PI);
          _obj3D.rotation.set(elapsed, elapsed * 1.2, 0);
          _obj3D.scale.setScalar(archScale);
        } else {
          _obj3D.position.set(0, 0, -99);
          _obj3D.scale.setScalar(0);
        }
        _obj3D.updateMatrix();
        pulseInstances.setMatrixAt(p, _obj3D.matrix);
      }
      pulseInstances.instanceMatrix.needsUpdate = true;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let frameId = 0;
    let disposed = false;
    let paused = document.hidden;
    let prevTime = performance.now();
    let elapsed = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 85);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed || paused) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 85);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const scheduleNext = () => {
      if (disposed || paused || prefersReducedMotion) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      if (disposed || paused) return;
      const now = performance.now();
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      elapsed += dt;

      updateSimulation(dt, elapsed);
      renderer.render(scene, camera);
      scheduleNext();
    };

    const handleVisibilityChange = () => {
      paused = document.hidden;
      if (paused) {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
      } else if (!disposed && !prefersReducedMotion) {
        prevTime = performance.now();
        scheduleNext();
      }
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      setWebglUnavailable(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    canvasEl.addEventListener('webglcontextlost', handleContextLost);

    // Initial crisp frame
    handleScroll();
    updateSimulation(0.016, 0);
    renderer.render(scene, camera);

    if (!prefersReducedMotion && !paused) {
      scheduleNext();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);

      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [isMobileViewport, prefersReducedMotion, webglUnavailable]);

  if (isMobileViewport || webglUnavailable) {
    return <LightweightNetworkBackdrop reducedMotion={prefersReducedMotion} />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Dedicated Three.js Connected-Node Mesh Canvas */}
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle central clarity vignette so headings and body copy remain razor-crisp */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 56% 74% at 50% 48%, rgba(255, 255, 255, 0.62) 0%, rgba(255, 255, 255, 0.22) 60%, rgba(255, 255, 255, 0) 100%)',
        }}
      />
    </div>
  );
}
