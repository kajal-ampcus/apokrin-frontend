import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MapPin, Minus, Plus, RotateCcw, ExternalLink } from 'lucide-react';
import { useTheme } from '../theme/themeConfig';

export interface GlobalOfficeLocation {
  id: string;
  city: string;
  country: string;
  regionLabel: string;
  address?: string;
  phone?: string;
  email?: string;
  lat: number;
  lon: number;
  mapsUrl: string;
  isHeadquarters?: boolean;
}

export const APOKRIN_GLOBAL_OFFICES: GlobalOfficeLocation[] = [
  {
    id: 'chantilly',
    city: 'Chantilly, VA',
    country: 'United States',
    regionLabel: 'Corporate Headquarters · North America',
    address: '4656 Westfields Boulevard, Chantilly, VA 20151, USA',
    phone: '(+1) 703-722-6709',
    email: 'Info@apokrin.com',
    lat: 38.8843,
    lon: -77.448,
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=4656+Westfields+Boulevard+Chantilly+VA+20151+USA',
    isHeadquarters: true,
  },
  {
    id: 'new-york',
    city: 'New York',
    country: 'United States',
    regionLabel: 'East Coast Delivery Presence · North America',
    email: 'Info@apokrin.com',
    lat: 40.7128,
    lon: -74.006,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=New+York+NY+USA',
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    regionLabel: 'European Operations · EMEA',
    email: 'Info@apokrin.com',
    lat: 51.5074,
    lon: -0.1278,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=London+United+Kingdom',
  },
  {
    id: 'zurich',
    city: 'Zurich',
    country: 'Switzerland',
    regionLabel: 'DACH & Alpine Delivery · EMEA',
    email: 'Info@apokrin.com',
    lat: 47.3769,
    lon: 8.5417,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Zurich+Switzerland',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    regionLabel: 'Asia-Pacific Delivery · APAC',
    email: 'Info@apokrin.com',
    lat: 1.3521,
    lon: 103.8198,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Singapore',
  },
];

// Simplified real-world continental outlines (lon, lat) for procedural vector & dot-matrix canvas map
const CONTINENT_POLYGONS: [number, number][][] = [
  // North America
  [
    [-168, 66],
    [-160, 71],
    [-140, 70],
    [-125, 71],
    [-95, 74],
    [-78, 72],
    [-64, 62],
    [-54, 48],
    [-67, 45],
    [-74, 40],
    [-81, 31],
    [-80, 25],
    [-83, 29],
    [-90, 29],
    [-97, 26],
    [-96, 19],
    [-88, 21],
    [-84, 11],
    [-78, 8],
    [-86, 11],
    [-95, 16],
    [-106, 22],
    [-112, 28],
    [-117, 32],
    [-124, 40],
    [-125, 49],
    [-136, 58],
    [-152, 60],
    [-162, 56],
    [-168, 66],
  ],
  // Greenland
  [
    [-52, 60],
    [-42, 60],
    [-22, 71],
    [-18, 81],
    [-46, 83],
    [-68, 77],
    [-55, 68],
    [-52, 60],
  ],
  // South America
  [
    [-78, 9],
    [-71, 12],
    [-62, 10],
    [-50, 1],
    [-35, -6],
    [-38, -15],
    [-41, -22],
    [-49, -28],
    [-54, -34],
    [-62, -41],
    [-68, -54],
    [-74, -52],
    [-74, -40],
    [-71, -30],
    [-70, -18],
    [-77, -12],
    [-81, -5],
    [-79, 2],
    [-78, 9],
  ],
  // Europe
  [
    [-10, 36],
    [-9, 43],
    [-2, 43],
    [-4, 48],
    [2, 51],
    [8, 54],
    [10, 58],
    [5, 61],
    [14, 68],
    [28, 71],
    [40, 68],
    [60, 69],
    [60, 52],
    [46, 44],
    [38, 45],
    [29, 41],
    [23, 37],
    [16, 38],
    [12, 44],
    [6, 43],
    [0, 39],
    [-6, 36],
    [-10, 36],
  ],
  // UK & Ireland
  [
    [-6, 50],
    [1, 51],
    [-2, 58],
    [-7, 57],
    [-6, 50],
  ],
  // Africa
  [
    [-17, 15],
    [-13, 28],
    [-6, 36],
    [10, 37],
    [12, 33],
    [25, 32],
    [33, 31],
    [40, 15],
    [51, 12],
    [45, 2],
    [40, -10],
    [35, -24],
    [28, -33],
    [18, -35],
    [14, -22],
    [12, -6],
    [9, 4],
    [2, 6],
    [-8, 5],
    [-16, 11],
    [-17, 15],
  ],
  // Asia + Middle East
  [
    [27, 41],
    [36, 36],
    [35, 30],
    [43, 13],
    [59, 22],
    [56, 26],
    [50, 30],
    [62, 25],
    [72, 20],
    [77, 8],
    [82, 16],
    [90, 22],
    [97, 16],
    [104, 2],
    [109, 12],
    [108, 21],
    [121, 24],
    [122, 31],
    [119, 39],
    [126, 37],
    [131, 42],
    [141, 52],
    [162, 60],
    [176, 66],
    [160, 70],
    [120, 74],
    [85, 73],
    [60, 69],
    [58, 50],
    [48, 42],
    [39, 42],
    [27, 41],
  ],
  // Japan & Maritime SE Asia accents
  [
    [130, 32],
    [140, 36],
    [144, 44],
    [138, 40],
    [130, 32],
  ],
  // Australia
  [
    [114, -22],
    [122, -17],
    [131, -12],
    [136, -15],
    [142, -11],
    [149, -20],
    [153, -28],
    [150, -37],
    [141, -38],
    [132, -32],
    [122, -34],
    [115, -34],
    [113, -26],
    [114, -22],
  ],
];

const GLOBE_RADIUS = 1.65;
const DEG2RAD = Math.PI / 180;

// Reusable scratch math objects (zero GC inside animation loop)
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vMid = new THREE.Vector3();
const _proj = new THREE.Vector3();
const _mouse = new THREE.Vector2();

function latLonToVector3(lat: number, lon: number, radius: number, out: THREE.Vector3): THREE.Vector3 {
  const phi = (lon + 180) * DEG2RAD;
  const theta = (90 - lat) * DEG2RAD;
  out.set(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
  );
  return out;
}

function latLonToRotationTargets(lat: number, lon: number): { rotX: number; rotY: number } {
  // Default camera looks down -Z toward origin (+Z faces camera).
  // At lon=-90, vertex is (0, 0, +R), so rotY rotates phi to +Z.
  const targetRotY = -(lon + 90) * DEG2RAD;
  const targetRotX = THREE.MathUtils.clamp(lat * DEG2RAD * 0.65, -0.55, 0.55);
  return { rotX: targetRotX, rotY: targetRotY };
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

function createProceduralGlobeTexture(primaryHex: string, secondaryHex: string): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep ocean gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#091229');
    bgGrad.addColorStop(0.5, '#0B1836');
    bgGrad.addColorStop(1, '#081024');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle equirectangular graticule lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let lon = -150; lon <= 180; lon += 30) {
      const x = ((lon + 180) / 360) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = ((90 - lat) / 180) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw continent landmasses filled with rich blue-slate shading + glowing coastline
    ctx.save();
    for (const poly of CONTINENT_POLYGONS) {
      ctx.beginPath();
      poly.forEach(([lon, lat], idx) => {
        const x = ((lon + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      const landGrad = ctx.createLinearGradient(0, 0, width, height);
      landGrad.addColorStop(0, '#162A56');
      landGrad.addColorStop(1, '#1D3A73');
      ctx.fillStyle = landGrad;
      ctx.fill();

      ctx.strokeStyle = secondaryHex;
      ctx.globalAlpha = 0.48;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    // Subtle digital telemetry grid dots across continents via clipping
    ctx.save();
    ctx.beginPath();
    for (const poly of CONTINENT_POLYGONS) {
      poly.forEach(([lon, lat], idx) => {
        const x = ((lon + 180) / 360) * width;
        const y = ((90 - lat) / 180) * height;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
    }
    ctx.clip();

    ctx.fillStyle = primaryHex;
    ctx.globalAlpha = 0.36;
    for (let x = 6; x < width; x += 9) {
      for (let y = 6; y < height; y += 9) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

interface GlobalPresenceGlobe3DProps {
  selectedOfficeId: string;
  onSelectOffice: (officeId: string) => void;
}

export function GlobalPresenceGlobe3D({
  selectedOfficeId,
  onSelectOffice,
}: GlobalPresenceGlobe3DProps) {
  const { themeConfig } = useTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const selectedIdRef = useRef<string>(selectedOfficeId);
  const onSelectRef = useRef(onSelectOffice);
  const targetRotRef = useRef<{ rotX: number; rotY: number }>(
    latLonToRotationTargets(APOKRIN_GLOBAL_OFFICES[0].lat, APOKRIN_GLOBAL_OFFICES[0].lon),
  );
  const zoomTargetRef = useRef<number>(4.35);
  const autoRotatePausedRef = useRef<boolean>(false);

  const [hoveredOffice, setHoveredOffice] = useState<{
    office: GlobalOfficeLocation;
    x: number;
    y: number;
  } | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelectOffice;
  }, [onSelectOffice]);

  useEffect(() => {
    selectedIdRef.current = selectedOfficeId;
    const office = APOKRIN_GLOBAL_OFFICES.find((o) => o.id === selectedOfficeId);
    if (office) {
      targetRotRef.current = latLonToRotationTargets(office.lat, office.lon);
    }
  }, [selectedOfficeId]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 560;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 40);
    camera.position.set(0, 0.15, zoomTargetRef.current);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Lighting rig
    const hemiLight = new THREE.HemisphereLight(0xc7d2fe, 0x091229, 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(themeConfig.three.accentHex, 1.15);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // Globe Group
    const globeGroup = new THREE.Group();
    const initialTargets = targetRotRef.current;
    globeGroup.rotation.set(initialTargets.rotX, initialTargets.rotY, 0);
    scene.add(globeGroup);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Procedural continent globe texture
    const globeTexture = createProceduralGlobeTexture(themeConfig.accent, themeConfig.secondary);
    globeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 56, 40);
    const sphereMat = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughness: 0.62,
      metalness: 0.18,
    });
    geometries.push(sphereGeo);
    materials.push(sphereMat);
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Subtle atmosphere rim shell
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.07, 48, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: themeConfig.three.primaryHex,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
      depthWrite: false,
    });
    geometries.push(atmosGeo);
    materials.push(atmosMat);
    globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Subtle orbital wireframe ring
    const orbitRingGeo = new THREE.TorusGeometry(GLOBE_RADIUS * 1.18, 0.005, 8, 96);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: themeConfig.three.accentHex,
      transparent: true,
      opacity: 0.25,
    });
    geometries.push(orbitRingGeo);
    materials.push(orbitRingMat);
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI * 0.42;
    orbitRing.rotation.y = Math.PI * 0.12;
    globeGroup.add(orbitRing);

    // Subtle ambient star/node particle cloud
    const particleCount = 110;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = GLOBE_RADIUS * (1.28 + ((i * 37) % 100) / 140);
      const theta = ((i * 73) % 180) * DEG2RAD;
      const phi = ((i * 137) % 360) * DEG2RAD;
      pPositions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pPositions[i * 3 + 1] = r * Math.cos(theta);
      pPositions[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: themeConfig.three.accentHex,
      size: 0.028,
      transparent: true,
      opacity: 0.5,
    });
    geometries.push(particleGeo);
    materials.push(particleMat);
    scene.add(new THREE.Points(particleGeo, particleMat));

    // Office markers + interactive raycast targets
    const markerClickables: THREE.Mesh[] = [];
    const markerVisuals = new Map<
      string,
      {
        office: GlobalOfficeLocation;
        pinMat: THREE.MeshStandardMaterial;
        ringMesh: THREE.Mesh;
        ringMat: THREE.MeshBasicMaterial;
        anchor: THREE.Group;
      }
    >();

    const pinGeo = new THREE.SphereGeometry(0.045, 18, 18);
    const hitGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const ringGeo = new THREE.RingGeometry(0.06, 0.09, 28);
    geometries.push(pinGeo, hitGeo, ringGeo);

    APOKRIN_GLOBAL_OFFICES.forEach((office) => {
      const pos = latLonToVector3(office.lat, office.lon, GLOBE_RADIUS + 0.025, _vA).clone();
      const normal = pos.clone().normalize();

      const anchor = new THREE.Group();
      anchor.position.copy(pos);
      anchor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

      const pinMat = new THREE.MeshStandardMaterial({
        color: office.isHeadquarters ? 0xffffff : themeConfig.three.accentHex,
        emissive: themeConfig.three.primaryHex,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      });
      materials.push(pinMat);
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      anchor.add(pinMesh);

      const ringMat = new THREE.MeshBasicMaterial({
        color: themeConfig.three.accentHex,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      materials.push(ringMat);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = 0.005;
      anchor.add(ringMesh);

      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      materials.push(hitMat);
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData.officeId = office.id;
      anchor.add(hitMesh);
      markerClickables.push(hitMesh);

      globeGroup.add(anchor);
      markerVisuals.set(office.id, { office, pinMat, ringMesh, ringMat, anchor });
    });

    // Connection arcs from Chantilly HQ to global offices
    const hq = APOKRIN_GLOBAL_OFFICES[0];
    const hqPos = latLonToVector3(hq.lat, hq.lon, GLOBE_RADIUS + 0.015, _vA).clone();
    const arcPulses: { curve: THREE.CatmullRomCurve3; mesh: THREE.Mesh; offset: number }[] = [];
    const pulseGeo = new THREE.SphereGeometry(0.022, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    geometries.push(pulseGeo);
    materials.push(pulseMat);

    APOKRIN_GLOBAL_OFFICES.slice(1).forEach((office, idx) => {
      const destPos = latLonToVector3(office.lat, office.lon, GLOBE_RADIUS + 0.015, _vB).clone();
      _vMid.addVectors(hqPos, destPos).multiplyScalar(0.5);
      const chordDist = hqPos.distanceTo(destPos);
      _vMid.normalize().multiplyScalar(GLOBE_RADIUS + 0.25 + chordDist * 0.24);

      const curve = new THREE.CatmullRomCurve3([hqPos, _vMid.clone(), destPos]);
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.008, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: themeConfig.three.accentHex,
        transparent: true,
        opacity: 0.55,
      });
      geometries.push(tubeGeo);
      materials.push(tubeMat);
      globeGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      globeGroup.add(pulseMesh);
      arcPulses.push({ curve, mesh: pulseMesh, offset: idx * 0.23 });
    });

    // Pointer Drag-to-Rotate & Raycasting
    const raycaster = new THREE.Raycaster();
    let isDragging = false;
    let dragMoved = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const updateMouseNDC = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragMoved = false;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      autoRotatePausedRef.current = true;
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevPointerX;
        const dy = e.clientY - prevPointerY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          dragMoved = true;
        }
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        targetRotRef.current = {
          rotY: targetRotRef.current.rotY + dx * 0.008,
          rotX: THREE.MathUtils.clamp(targetRotRef.current.rotX + dy * 0.006, -0.75, 0.75),
        };
        setHoveredOffice(null);
        return;
      }

      // Hover raycast
      updateMouseNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(_mouse, camera);
      const hits = raycaster.intersectObjects(markerClickables, false);
      if (hits.length > 0) {
        const officeId = String(hits[0].object.userData.officeId || '');
        const match = markerVisuals.get(officeId);
        if (match) {
          match.anchor.getWorldPosition(_proj);
          _proj.project(camera);
          const rect = renderer.domElement.getBoundingClientRect();
          const px = ((_proj.x + 1) / 2) * rect.width;
          const py = ((-_proj.y + 1) / 2) * rect.height;
          setHoveredOffice({ office: match.office, x: px, y: py });
          renderer.domElement.style.cursor = 'pointer';
          autoRotatePausedRef.current = true;
          return;
        }
      }
      setHoveredOffice(null);
      renderer.domElement.style.cursor = 'grab';
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (renderer.domElement.hasPointerCapture(e.pointerId)) {
        renderer.domElement.releasePointerCapture(e.pointerId);
      }
      if (!dragMoved) {
        updateMouseNDC(e.clientX, e.clientY);
        raycaster.setFromCamera(_mouse, camera);
        const hits = raycaster.intersectObjects(markerClickables, false);
        if (hits.length > 0) {
          const officeId = String(hits[0].object.userData.officeId || '');
          if (officeId) {
            onSelectRef.current(officeId);
          }
        }
      }
      isDragging = false;
    };

    const handlePointerEnter = () => {
      autoRotatePausedRef.current = true;
    };
    const handlePointerLeave = () => {
      isDragging = false;
      autoRotatePausedRef.current = false;
      setHoveredOffice(null);
    };

    const domEl = renderer.domElement;
    domEl.style.cursor = 'grab';
    domEl.style.touchAction = 'none';
    domEl.addEventListener('pointerdown', handlePointerDown);
    domEl.addEventListener('pointermove', handlePointerMove);
    domEl.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('pointerenter', handlePointerEnter);
    domEl.addEventListener('pointerleave', handlePointerLeave);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation loop with software WebGL pacing
    let frameId = 0;
    let destroyed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (destroyed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = (now: number) => {
      if (destroyed) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!prefersReducedMotion && !autoRotatePausedRef.current && !isDragging) {
        targetRotRef.current.rotY += dt * 0.14;
      }

      // Exponentially damp globe rotation & camera zoom
      globeGroup.rotation.y = THREE.MathUtils.damp(
        globeGroup.rotation.y,
        targetRotRef.current.rotY,
        4.5,
        dt,
      );
      globeGroup.rotation.x = THREE.MathUtils.damp(
        globeGroup.rotation.x,
        targetRotRef.current.rotX,
        4.5,
        dt,
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        zoomTargetRef.current,
        5,
        dt,
      );

      // Update marker highlights & pulse rings
      const tSec = now * 0.001;
      markerVisuals.forEach((m, id) => {
        const isSel = id === selectedIdRef.current;
        const pulseScale = isSel && !prefersReducedMotion ? 1.2 + Math.sin(tSec * 3.4) * 0.25 : 1;
        m.ringMesh.scale.setScalar(pulseScale);
        m.ringMat.opacity = isSel ? 0.92 : 0.45;
        m.pinMat.emissiveIntensity = isSel ? 1.4 : 0.75;
        m.anchor.scale.setScalar(isSel ? 1.22 : 1);
      });

      // Animate connection arc signal packets
      arcPulses.forEach((p) => {
        const u = prefersReducedMotion ? 0.5 : (tSec * 0.26 + p.offset) % 1;
        p.curve.getPointAt(u, _vA);
        p.mesh.position.copy(_vA);
      });

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(() => tick(performance.now()));
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    frameId = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('pointerdown', handlePointerDown);
      domEl.removeEventListener('pointermove', handlePointerMove);
      domEl.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('pointerenter', handlePointerEnter);
      domEl.removeEventListener('pointerleave', handlePointerLeave);

      globeTexture.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, [themeConfig, prefersReducedMotion]);

  const handleZoomIn = () => {
    zoomTargetRef.current = THREE.MathUtils.clamp(zoomTargetRef.current - 0.55, 2.9, 5.8);
  };
  const handleZoomOut = () => {
    zoomTargetRef.current = THREE.MathUtils.clamp(zoomTargetRef.current + 0.55, 2.9, 5.8);
  };
  const handleResetView = () => {
    zoomTargetRef.current = 4.35;
    const office = APOKRIN_GLOBAL_OFFICES.find((o) => o.id === selectedOfficeId);
    if (office) {
      targetRotRef.current = latLonToRotationTargets(office.lat, office.lon);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#1E293B] bg-[#081024] shadow-[0_24px_60px_-18px_rgba(8,16,36,0.55)]">
      {/* Subtle top-left blue-purple ambient gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-35 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${themeConfig.primary} 0%, transparent 72%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${themeConfig.secondary} 0%, transparent 72%)`,
        }}
      />

      {/* Minimal Top Bar: Hint + Zoom Controls (Zero viewport occlusion) */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-4">
        <span className="text-xs font-medium text-slate-300">
          Drag to rotate · Click any marker
        </span>

        <div className="inline-flex items-center gap-1 rounded-xl border border-slate-700/80 bg-[#0F172A]/90 p-1">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in globe"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out globe"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            aria-label="Reset globe view"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Dedicated Isolated WebGL Canvas Container */}
      <div className="relative h-[340px] w-full sm:h-[400px] lg:h-[440px]">
        <div
          ref={mountRef}
          aria-label="Interactive 3D globe displaying Apokrin global offices"
          className="h-full w-full"
        />

        {/* Hover Tooltip (Solid translucent dark surface, zero backdrop-blur over WebGL) */}
        {hoveredOffice && (
          <div
            style={{
              left: `${Math.min(Math.max(hoveredOffice.x, 85), 420)}px`,
              top: `${Math.max(hoveredOffice.y - 16, 48)}px`,
            }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl border border-slate-600/80 bg-[#0A1128]/95 px-3 py-2 text-left shadow-xl"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: themeConfig.accent }} />
              <span className="font-display text-xs font-bold text-white whitespace-nowrap">
                {hoveredOffice.office.city}, {hoveredOffice.office.country}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-300 whitespace-nowrap">
              {hoveredOffice.office.regionLabel}
            </p>
          </div>
        )}
      </div>

      {/* Quick Location Selector Dock at Bottom */}
      <div className="relative z-10 border-t border-slate-800/80 bg-[#0A1128]/90 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {APOKRIN_GLOBAL_OFFICES.map((office) => {
              const isSelected = office.id === selectedOfficeId;
              return (
                <button
                  key={office.id}
                  type="button"
                  onClick={() => onSelectOffice(office.id)}
                  aria-pressed={isSelected}
                  style={
                    isSelected
                      ? { background: 'var(--color-btn-gradient)', color: '#FFFFFF' }
                      : undefined
                  }
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    isSelected
                      ? 'shadow-sm'
                      : 'border border-slate-700/80 bg-[#131E3A] text-slate-300 hover:text-white'
                  }`}
                >
                  {office.city}
                </button>
              );
            })}
          </div>

          <a
            href={
              (APOKRIN_GLOBAL_OFFICES.find((o) => o.id === selectedOfficeId) ??
                APOKRIN_GLOBAL_OFFICES[0]
              ).mapsUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200 transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            <span>View Location</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
