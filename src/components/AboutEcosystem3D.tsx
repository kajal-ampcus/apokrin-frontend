import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useTheme } from '../theme/themeConfig';

export interface EcosystemNodeMeta {
  id: string;
  label: string;
  subtitle: string;
}

const NODE_METADATA: Record<string, EcosystemNodeMeta> = {
  hub: {
    id: 'hub',
    label: 'Apokrin Integration Hub',
    subtitle: 'Unified orchestration connecting enterprise AI, cloud, data, and security',
  },
  ai: {
    id: 'ai',
    label: 'AI & Machine Learning',
    subtitle: 'Neural inference pipelines, intelligent automation, and model governance',
  },
  cloud: {
    id: 'cloud',
    label: 'Cloud Solutions',
    subtitle: 'Multi-region cloud architecture, container orchestration, and resilient failover',
  },
  analytics: {
    id: 'analytics',
    label: 'Data Analytics',
    subtitle: 'Real-time streaming telemetry, lakehouse pipelines, and decision intelligence',
  },
  security: {
    id: 'security',
    label: 'Cybersecurity',
    subtitle: 'Zero-trust access control, continuous compliance, and policy enforcement',
  },
  infra: {
    id: 'infra',
    label: 'Scalable Infrastructure',
    subtitle: 'High-availability compute clusters and automated Infrastructure-as-Code',
  },
  transformation: {
    id: 'transformation',
    label: 'Digital Transformation',
    subtitle: 'Cross-system integration modernizing core commercial operations',
  },
};

// Reusable scratch math objects (zero GC inside animation loop)
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vMid = new THREE.Vector3();
const _mouse = new THREE.Vector2();

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

interface Disposables {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
}

function createClayMaterials(disposables: Disposables) {
  const mats = {
    whiteClay: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.36,
      metalness: 0.04,
      clearcoat: 0.42,
      clearcoatRoughness: 0.32,
      sheen: 0.2,
      sheenColor: new THREE.Color(0xeaf1fa),
    }),
    greyBlueClay: new THREE.MeshPhysicalMaterial({
      color: 0xeaf1fa,
      roughness: 0.42,
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.36,
    }),
    skyBlueClay: new THREE.MeshPhysicalMaterial({
      color: 0xb9dcff,
      roughness: 0.35,
      metalness: 0.06,
      clearcoat: 0.45,
      clearcoatRoughness: 0.28,
    }),
    lavenderClay: new THREE.MeshPhysicalMaterial({
      color: 0xdcd9ff,
      roughness: 0.38,
      metalness: 0.05,
      clearcoat: 0.4,
      clearcoatRoughness: 0.3,
    }),
    primaryBlueClay: new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      emissive: 0x1e40af,
      emissiveIntensity: 0.08,
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
    }),
    cyanClay: new THREE.MeshPhysicalMaterial({
      color: 0x22b8cf,
      emissive: 0x0891b2,
      emissiveIntensity: 0.12,
      roughness: 0.28,
      metalness: 0.1,
      clearcoat: 0.58,
      clearcoatRoughness: 0.2,
    }),
  };

  disposables.materials.push(
    mats.whiteClay,
    mats.greyBlueClay,
    mats.skyBlueClay,
    mats.lavenderClay,
    mats.primaryBlueClay,
    mats.cyanClay,
  );
  return mats;
}

type ClayMats = ReturnType<typeof createClayMaterials>;

function buildCentralHub(mats: ClayMats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();
  group.userData.nodeId = 'hub';

  // Soft inflated 3D cloud hub formed by smooth overlapping clay spheres + rounded base
  const puffSpecs: [number, number, number, number][] = [
    [0, 0.24, 0, 0.52],
    [-0.44, 0.02, 0.06, 0.38],
    [0.44, 0.05, -0.04, 0.4],
    [-0.22, 0.02, -0.22, 0.34],
    [0.2, 0.04, 0.24, 0.34],
  ];

  puffSpecs.forEach(([x, y, z, r]) => {
    const geo = new THREE.SphereGeometry(r, 32, 24);
    disposables.geometries.push(geo);
    const mesh = new THREE.Mesh(geo, mats.whiteClay);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.nodeId = 'hub';
    group.add(mesh);
  });

  // Cushioned base capsule uniting cloud silhouette
  const baseGeo = new THREE.CapsuleGeometry(0.28, 0.72, 12, 24);
  baseGeo.rotateZ(Math.PI / 2);
  disposables.geometries.push(baseGeo);
  const baseMesh = new THREE.Mesh(baseGeo, mats.greyBlueClay);
  baseMesh.position.set(0, -0.14, 0);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  baseMesh.userData.nodeId = 'hub';
  group.add(baseMesh);

  // Embedded front Apokrin glowing integration core ring + sphere
  const ringGeo = new THREE.TorusGeometry(0.23, 0.048, 16, 36);
  const coreGeo = new THREE.SphereGeometry(0.11, 24, 24);
  disposables.geometries.push(ringGeo, coreGeo);

  const ring = new THREE.Mesh(ringGeo, mats.primaryBlueClay);
  ring.position.set(0, 0.06, 0.42);
  ring.userData.nodeId = 'hub';
  group.add(ring);

  const core = new THREE.Mesh(coreGeo, mats.cyanClay);
  core.position.set(0, 0.06, 0.44);
  core.userData.nodeId = 'hub';
  group.add(core);

  // Subtle orbiting clay halo ring around hub
  const haloGeo = new THREE.TorusGeometry(0.95, 0.026, 14, 56);
  disposables.geometries.push(haloGeo);
  const halo = new THREE.Mesh(haloGeo, mats.skyBlueClay);
  halo.rotation.x = Math.PI * 0.42;
  halo.rotation.y = 0.25;
  halo.userData.nodeId = 'hub';
  group.add(halo);

  return group;
}

function buildAiBrainNode(mats: ClayMats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();
  group.userData.nodeId = 'ai';

  // Soft rounded clay pedestal disc
  const discGeo = new THREE.CylinderGeometry(0.5, 0.52, 0.14, 32);
  disposables.geometries.push(discGeo);
  const disc = new THREE.Mesh(discGeo, mats.whiteClay);
  disc.position.y = -0.34;
  disc.castShadow = true;
  disc.userData.nodeId = 'ai';
  group.add(disc);

  // Two sculpted rounded brain hemispheres (light lavender clay)
  const lobeGeo = new THREE.CapsuleGeometry(0.22, 0.26, 12, 24);
  lobeGeo.rotateX(Math.PI / 2);
  disposables.geometries.push(lobeGeo);

  [-1, 1].forEach((side) => {
    const lobe = new THREE.Mesh(lobeGeo, mats.lavenderClay);
    lobe.position.set(side * 0.18, 0.04, 0);
    lobe.rotation.z = side * 0.12;
    lobe.castShadow = true;
    lobe.userData.nodeId = 'ai';
    group.add(lobe);
  });

  // Glowing cyan & blue neural nodes embedded on brain surface
  const nodeGeo = new THREE.SphereGeometry(0.068, 18, 18);
  disposables.geometries.push(nodeGeo);
  const nodeOffsets: [number, number, number, boolean][] = [
    [-0.24, 0.18, 0.22, true],
    [0.24, 0.2, 0.2, false],
    [-0.18, -0.06, 0.28, false],
    [0.2, -0.05, 0.27, true],
    [0, 0.28, 0.04, true],
  ];
  nodeOffsets.forEach(([x, y, z, isCyan]) => {
    const n = new THREE.Mesh(nodeGeo, isCyan ? mats.cyanClay : mats.primaryBlueClay);
    n.position.set(x, y, z);
    n.userData.nodeId = 'ai';
    group.add(n);
  });

  return group;
}

function buildCloudNode(mats: ClayMats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();
  group.userData.nodeId = 'cloud';

  const puffs: [number, number, number, number][] = [
    [0, 0.16, 0, 0.3],
    [-0.26, 0.02, 0.04, 0.23],
    [0.26, 0.04, -0.03, 0.24],
  ];
  puffs.forEach(([x, y, z, r]) => {
    const geo = new THREE.SphereGeometry(r, 28, 22);
    disposables.geometries.push(geo);
    const m = new THREE.Mesh(geo, mats.skyBlueClay);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.userData.nodeId = 'cloud';
    group.add(m);
  });

  const baseGeo = new THREE.CapsuleGeometry(0.16, 0.42, 10, 20);
  baseGeo.rotateZ(Math.PI / 2);
  disposables.geometries.push(baseGeo);
  const base = new THREE.Mesh(baseGeo, mats.whiteClay);
  base.position.y = -0.06;
  base.castShadow = true;
  base.userData.nodeId = 'cloud';
  group.add(base);

  // Connected sub-nodes hanging beneath the cloud
  const subGeo = new THREE.SphereGeometry(0.085, 18, 18);
  const strutGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.24, 12);
  disposables.geometries.push(subGeo, strutGeo);

  [-0.22, 0, 0.22].forEach((x, idx) => {
    const strut = new THREE.Mesh(strutGeo, mats.greyBlueClay);
    strut.position.set(x, -0.24, 0);
    strut.userData.nodeId = 'cloud';
    group.add(strut);

    const sub = new THREE.Mesh(
      subGeo,
      idx === 1 ? mats.primaryBlueClay : mats.cyanClay,
    );
    sub.position.set(x, -0.38, 0);
    sub.userData.nodeId = 'cloud';
    group.add(sub);
  });

  return group;
}

function buildAnalyticsNode(mats: ClayMats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();
  group.userData.nodeId = 'analytics';

  // Soft beveled clay base tablet
  const tabletShape = new THREE.Shape();
  tabletShape.moveTo(-0.38, -0.26);
  tabletShape.quadraticCurveTo(0, -0.32, 0.38, -0.26);
  tabletShape.quadraticCurveTo(0.45, 0, 0.38, 0.26);
  tabletShape.quadraticCurveTo(0, 0.32, -0.38, 0.26);
  tabletShape.quadraticCurveTo(-0.45, 0, -0.38, -0.26);

  const tabletGeo = new THREE.ExtrudeGeometry(tabletShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.04,
    bevelSegments: 4,
    curveSegments: 16,
  });
  tabletGeo.translate(0, 0, -0.05);
  disposables.geometries.push(tabletGeo);

  const tablet = new THREE.Mesh(tabletGeo, mats.whiteClay);
  tablet.castShadow = true;
  tablet.userData.nodeId = 'analytics';
  group.add(tablet);

  // Three floating 3D rounded bars (animated height pulse stored in userData)
  const barSpecs = [
    { x: -0.2, h: 0.24, mat: mats.skyBlueClay, phase: 0 },
    { x: 0, h: 0.36, mat: mats.cyanClay, phase: 1.2 },
    { x: 0.2, h: 0.48, mat: mats.primaryBlueClay, phase: 2.4 },
  ];

  const bars: THREE.Mesh[] = [];
  barSpecs.forEach((spec) => {
    const barGeo = new THREE.CapsuleGeometry(0.068, spec.h, 10, 18);
    disposables.geometries.push(barGeo);
    const bar = new THREE.Mesh(barGeo, spec.mat);
    bar.position.set(spec.x, -0.14 + spec.h * 0.5, 0.15);
    bar.castShadow = true;
    bar.userData.nodeId = 'analytics';
    bar.userData.baseY = bar.position.y;
    bar.userData.phase = spec.phase;
    group.add(bar);
    bars.push(bar);
  });

  group.userData.bars = bars;
  return group;
}

function buildSecurityNode(mats: ClayMats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();
  group.userData.nodeId = 'security';

  // Sculpted 3D Clay Shield
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(0, 0.44);
  shieldShape.quadraticCurveTo(0.24, 0.4, 0.36, 0.32);
  shieldShape.quadraticCurveTo(0.38, -0.12, 0, -0.44);
  shieldShape.quadraticCurveTo(-0.38, -0.12, -0.36, 0.32);
  shieldShape.quadraticCurveTo(-0.24, 0.4, 0, 0.44);

  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.045,
    bevelSegments: 5,
    curveSegments: 18,
  });
  shieldGeo.translate(0, 0, -0.06);
  disposables.geometries.push(shieldGeo);

  const shield = new THREE.Mesh(shieldGeo, mats.primaryBlueClay);
  shield.castShadow = true;
  shield.userData.nodeId = 'security';
  group.add(shield);

  // Raised White Clay Lock Body
  const lockBodyGeo = new THREE.BoxGeometry(0.24, 0.2, 0.12);
  disposables.geometries.push(lockBodyGeo);
  const lockBody = new THREE.Mesh(lockBodyGeo, mats.whiteClay);
  lockBody.position.set(0, -0.06, 0.13);
  lockBody.userData.nodeId = 'security';
  group.add(lockBody);

  // Smooth Rounded Clay Lock Shackle
  const shackleGeo = new THREE.TorusGeometry(0.085, 0.028, 12, 24, Math.PI);
  disposables.geometries.push(shackleGeo);
  const shackle = new THREE.Mesh(shackleGeo, mats.cyanClay);
  shackle.position.set(0, 0.04, 0.13);
  shackle.userData.nodeId = 'security';
  group.add(shackle);

  return group;
}

function buildInfrastructureNode(mats: ClayMats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();
  group.userData.nodeId = 'infra';

  // 3 Stacked Rounded Server/Database Tiers
  const tierGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.15, 32);
  const rimGeo = new THREE.TorusGeometry(0.35, 0.032, 12, 32);
  rimGeo.rotateX(Math.PI / 2);
  const ledGeo = new THREE.CapsuleGeometry(0.026, 0.08, 6, 12);
  ledGeo.rotateZ(Math.PI / 2);
  disposables.geometries.push(tierGeo, rimGeo, ledGeo);

  const tierMats = [mats.skyBlueClay, mats.whiteClay, mats.greyBlueClay];
  [-0.24, 0, 0.24].forEach((y, idx) => {
    const tier = new THREE.Mesh(tierGeo, tierMats[idx]);
    tier.position.y = y;
    tier.castShadow = true;
    tier.userData.nodeId = 'infra';
    group.add(tier);

    const rim = new THREE.Mesh(rimGeo, mats.whiteClay);
    rim.position.y = y + 0.05;
    rim.userData.nodeId = 'infra';
    group.add(rim);

    const led = new THREE.Mesh(
      ledGeo,
      idx === 1 ? mats.cyanClay : mats.primaryBlueClay,
    );
    led.position.set(0.14, y, 0.36);
    led.userData.nodeId = 'infra';
    group.add(led);
  });

  return group;
}

function buildTransformationNode(mats: ClayMats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();
  group.userData.nodeId = 'transformation';

  // Connected 3D Network Nodes Cluster
  const centerGeo = new THREE.SphereGeometry(0.2, 24, 24);
  const satGeo = new THREE.SphereGeometry(0.115, 20, 20);
  const linkGeo = new THREE.CylinderGeometry(0.028, 0.028, 1, 12);
  disposables.geometries.push(centerGeo, satGeo, linkGeo);

  const center = new THREE.Mesh(centerGeo, mats.primaryBlueClay);
  center.castShadow = true;
  center.userData.nodeId = 'transformation';
  group.add(center);

  const satCoords: [number, number, number, THREE.Material][] = [
    [-0.36, 0.24, 0.18, mats.cyanClay],
    [0.36, 0.2, -0.14, mats.lavenderClay],
    [0.12, -0.34, 0.26, mats.skyBlueClay],
    [-0.22, -0.26, -0.24, mats.whiteClay],
  ];

  satCoords.forEach(([x, y, z, mat]) => {
    const sat = new THREE.Mesh(satGeo, mat);
    sat.position.set(x, y, z);
    sat.castShadow = true;
    sat.userData.nodeId = 'transformation';
    group.add(sat);

    const dir = new THREE.Vector3(x, y, z);
    const len = dir.length();
    const link = new THREE.Mesh(linkGeo, mats.greyBlueClay);
    link.scale.set(1, len, 1);
    link.position.set(x * 0.5, y * 0.5, z * 0.5);
    link.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    link.userData.nodeId = 'transformation';
    group.add(link);
  });

  return group;
}

interface NodeInstance {
  id: string;
  group: THREE.Group;
  basePos: THREE.Vector3;
  floatPhase: number;
  floatSpeed: number;
  rotSpeedY: number;
  currentScale: number;
}

interface ConduitInstance {
  curve: THREE.CatmullRomCurve3;
  tubeMat: THREE.MeshBasicMaterial;
  particles: {
    mesh: THREE.Mesh;
    pulseHalo: THREE.Mesh;
    progress: number;
    speed: number;
    direction: 1 | -1;
  }[];
}

export function AboutEcosystem3D() {
  const { themeConfig } = useTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFallback, setWebglFallback] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string>('hub');
  const activeNodeRef = useRef<string>('hub');
  const themeConfigRef = useRef(themeConfig);
  const applyThemeRef = useRef<((cfg: typeof themeConfig) => void) | null>(null);

  useEffect(() => {
    themeConfigRef.current = themeConfig;
    applyThemeRef.current?.(themeConfig);
  }, [themeConfig]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 480;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvasEl = renderer.domElement;
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(canvasEl);

    const scene = new THREE.Scene();

    // Soft studio reflection environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    camera.position.set(0, 0.25, 8.6);
    camera.lookAt(0, 0, 0);

    // Soft Claymorphism Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xf8fbff, 0xdbe7f7, 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffcf5, 1.85);
    keyLight.position.set(4.2, 5.8, 5.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    const sb = 4;
    keyLight.shadow.camera.left = -sb;
    keyLight.shadow.camera.right = sb;
    keyLight.shadow.camera.top = sb;
    keyLight.shadow.camera.bottom = -sb;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb9dcff, 0.85);
    fillLight.position.set(-4.8, 1.4, 3.6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xdcd9ff, 0.9);
    rimLight.position.set(0, 2.8, -5.0);
    scene.add(rimLight);

    const disposables: Disposables = { geometries: [], materials: [] };
    const mats = createClayMaterials(disposables);

    // Master stage group for subtle mouse parallax
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // Central Hub + 6 Technology Symbols at Varied Depths
    const hubGroup = buildCentralHub(mats, disposables);
    stageGroup.add(hubGroup);

    const nodes: NodeInstance[] = [
      {
        id: 'hub',
        group: hubGroup,
        basePos: new THREE.Vector3(0, 0.05, 0),
        floatPhase: 0,
        floatSpeed: 1.15,
        rotSpeedY: 0.14,
        currentScale: 1,
      },
      {
        id: 'ai',
        group: buildAiBrainNode(mats, disposables),
        basePos: new THREE.Vector3(-2.05, 1.32, 0.52),
        floatPhase: 0.8,
        floatSpeed: 1.3,
        rotSpeedY: 0.22,
        currentScale: 1,
      },
      {
        id: 'cloud',
        group: buildCloudNode(mats, disposables),
        basePos: new THREE.Vector3(2.02, 1.28, -0.32),
        floatPhase: 1.9,
        floatSpeed: 1.1,
        rotSpeedY: -0.18,
        currentScale: 1,
      },
      {
        id: 'analytics',
        group: buildAnalyticsNode(mats, disposables),
        basePos: new THREE.Vector3(2.3, -0.22, 0.68),
        floatPhase: 2.7,
        floatSpeed: 1.25,
        rotSpeedY: -0.16,
        currentScale: 1,
      },
      {
        id: 'security',
        group: buildSecurityNode(mats, disposables),
        basePos: new THREE.Vector3(1.58, -1.52, -0.35),
        floatPhase: 3.6,
        floatSpeed: 1.18,
        rotSpeedY: 0.2,
        currentScale: 1,
      },
      {
        id: 'infra',
        group: buildInfrastructureNode(mats, disposables),
        basePos: new THREE.Vector3(-1.7, -1.48, 0.45),
        floatPhase: 4.5,
        floatSpeed: 1.22,
        rotSpeedY: 0.18,
        currentScale: 1,
      },
      {
        id: 'transformation',
        group: buildTransformationNode(mats, disposables),
        basePos: new THREE.Vector3(-2.34, -0.1, -0.48),
        floatPhase: 5.4,
        floatSpeed: 1.12,
        rotSpeedY: -0.24,
        currentScale: 1,
      },
    ];

    const nodeMap = new Map<string, NodeInstance>();
    nodes.forEach((n) => {
      n.group.position.copy(n.basePos);
      if (n.id !== 'hub') {
        stageGroup.add(n.group);
      }
      nodeMap.set(n.id, n);
    });

    // Interconnected Curved 3D Conduits + Traveling Glowing Data Particles & Light Pulses
    const connectionPairs: [string, string, number][] = [
      ['hub', 'ai', 0.48],
      ['hub', 'cloud', 0.45],
      ['hub', 'analytics', -0.44],
      ['hub', 'security', -0.42],
      ['hub', 'infra', -0.46],
      ['hub', 'transformation', 0.42],
      // Peer-to-peer cross-system connections
      ['ai', 'transformation', 0.36],
      ['cloud', 'analytics', 0.38],
      ['security', 'infra', -0.34],
    ];

    const particleGeo = new THREE.SphereGeometry(0.058, 16, 16);
    const haloGeo = new THREE.SphereGeometry(0.115, 16, 16);
    disposables.geometries.push(particleGeo, haloGeo);

    const particleCyanMat = new THREE.MeshBasicMaterial({ color: 0x22b8cf });
    const particleBlueMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x22b8cf,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    disposables.materials.push(particleCyanMat, particleBlueMat, haloMat);

    const conduits: ConduitInstance[] = connectionPairs.map(([fromId, toId, arcLift], idx) => {
      const pStart = nodeMap.get(fromId)!.basePos.clone();
      const pEnd = nodeMap.get(toId)!.basePos.clone();
      const mid = _vMid.addVectors(pStart, pEnd).multiplyScalar(0.5);
      mid.y += arcLift;
      mid.z += idx % 2 === 0 ? 0.32 : -0.28;

      const curve = new THREE.CatmullRomCurve3([pStart, mid.clone(), pEnd]);
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.018, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x93c5fd : 0x7dd3fc,
        transparent: true,
        opacity: 0.55,
      });
      disposables.geometries.push(tubeGeo);
      disposables.materials.push(tubeMat);

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      stageGroup.add(tubeMesh);

      // Two traveling particles per conduit (bidirectional exchange)
      const particles = [0, 1].map((pIdx) => {
        const mesh = new THREE.Mesh(
          particleGeo,
          (idx + pIdx) % 2 === 0 ? particleCyanMat : particleBlueMat,
        );
        const pulseHalo = new THREE.Mesh(haloGeo, haloMat);
        stageGroup.add(mesh);
        stageGroup.add(pulseHalo);
        return {
          mesh,
          pulseHalo,
          progress: (idx * 0.17 + pIdx * 0.52) % 1,
          speed: 0.22 + (idx % 3) * 0.04,
          direction: (pIdx === 0 ? 1 : -1) as 1 | -1,
        };
      });

      return { curve, tubeMat, particles };
    });

    const applyThemeToScene = (cfg: typeof themeConfig) => {
      mats.primaryBlueClay.color.setHex(cfg.three.primaryHex);
      mats.primaryBlueClay.emissive.setHex(cfg.three.emissivePrimaryHex);
      mats.cyanClay.color.setHex(cfg.three.secondaryHex);
      mats.cyanClay.emissive.setHex(cfg.three.emissiveSecondaryHex);
      mats.skyBlueClay.color.setHex(cfg.three.softTintHex);
      mats.lavenderClay.color.setHex(cfg.three.lavenderTintHex);
      particleBlueMat.color.setHex(cfg.three.primaryHex);
      particleCyanMat.color.setHex(cfg.three.secondaryHex);
      haloMat.color.setHex(cfg.three.accentHex);
      fillLight.color.setHex(cfg.three.softTintHex);
      rimLight.color.setHex(cfg.three.lavenderTintHex);
      conduits.forEach((conduit, idx) => {
        conduit.tubeMat.color.setHex(
          idx % 2 === 0 ? cfg.three.softTintHex : cfg.three.accentHex,
        );
      });
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };
    applyThemeToScene(themeConfigRef.current);
    applyThemeRef.current = applyThemeToScene;

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting & Smooth Pointer Parallax
    const raycaster = new THREE.Raycaster();
    let targetTiltX = 0;
    let targetTiltY = 0;
    let lastRaycastTime = 0;
    const interactiveMeshes = nodes.map((n) => n.group);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetTiltY = nx * 0.14;
      targetTiltX = -ny * 0.09;

      // Throttled raycast (<= 20fps)
      const now = performance.now();
      if (now - lastRaycastTime < 50) return;
      lastRaycastTime = now;

      _mouse.set(nx, ny);
      raycaster.setFromCamera(_mouse, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, true);
      const hitNodeId = (hits[0]?.object?.userData?.nodeId as string | undefined) ?? 'hub';
      if (hitNodeId !== activeNodeRef.current) {
        activeNodeRef.current = hitNodeId;
        setActiveNodeId(hitNodeId);
      }
      canvasEl.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    const handlePointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      if (activeNodeRef.current !== 'hub') {
        activeNodeRef.current = 'hub';
        setActiveNodeId('hub');
      }
      canvasEl.style.cursor = 'grab';
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    // Responsive sizing
    const handleResize = () => {
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.position.z = w < 420 ? 10.2 : 8.6;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // Pause animation when off-screen for clean resource efficiency
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };
    canvasEl.addEventListener('webglcontextlost', handleContextLost);

    let frameId = 0;
    let disposed = false;
    let prevTime = performance.now();
    let elapsed = 0;

    const updateSceneState = (dt: number) => {
      // Stage pointer parallax
      stageGroup.rotation.x = THREE.MathUtils.damp(stageGroup.rotation.x, targetTiltX, 4.5, dt);
      stageGroup.rotation.y = THREE.MathUtils.damp(stageGroup.rotation.y, targetTiltY, 4.5, dt);

      // Node gentle floating, slow rotation, and hover scale
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const bobY = Math.sin(elapsed * node.floatSpeed + node.floatPhase) * 0.1;
        const bobZ = Math.cos(elapsed * node.floatSpeed * 0.7 + node.floatPhase) * 0.05;
        node.group.position.set(
          node.basePos.x,
          node.basePos.y + bobY,
          node.basePos.z + bobZ,
        );

        if (node.id === 'hub') {
          node.group.rotation.y = Math.sin(elapsed * 0.45) * 0.12;
        } else {
          node.group.rotation.y = Math.sin(elapsed * 0.6 + node.floatPhase) * 0.24;
          node.group.rotation.z = Math.cos(elapsed * 0.5 + node.floatPhase) * 0.06;
        }

        // Analytics bar gentle vertical wave
        if (node.id === 'analytics' && Array.isArray(node.group.userData.bars)) {
          const bars = node.group.userData.bars as THREE.Mesh[];
          for (let b = 0; b < bars.length; b++) {
            const bar = bars[b];
            const phase = bar.userData.phase as number;
            const baseY = bar.userData.baseY as number;
            const pulse = 1 + Math.sin(elapsed * 2.1 + phase) * 0.14;
            bar.scale.y = pulse;
            bar.position.y = baseY + (pulse - 1) * 0.12;
          }
        }

        const targetScale = activeNodeRef.current === node.id ? 1.12 : 1.0;
        node.currentScale = THREE.MathUtils.damp(node.currentScale, targetScale, 8, dt);
        node.group.scale.setScalar(node.currentScale);
      }

      // Update glowing data particles & pulse halos along curved conduits
      for (let c = 0; c < conduits.length; c++) {
        const conduit = conduits[c];
        conduit.tubeMat.opacity = 0.42 + 0.18 * Math.sin(elapsed * 1.6 + c * 0.8);

        for (let p = 0; p < conduit.particles.length; p++) {
          const pt = conduit.particles[p];
          pt.progress = ((pt.progress + pt.direction * pt.speed * dt) % 1 + 1) % 1;
          conduit.curve.getPointAt(pt.progress, _vA);
          _vB.copy(_vA);
          pt.mesh.position.copy(_vA);
          pt.pulseHalo.position.copy(_vB);

          const haloScale = 0.85 + 0.45 * Math.sin(elapsed * 4.5 + c + p * 2);
          pt.pulseHalo.scale.setScalar(haloScale);
        }
      }
    };

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
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

    // Initial render frame
    updateSceneState(0.016);
    renderer.render(scene, camera);

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      if (isVisible) {
        elapsed += dt;
        updateSceneState(dt);
        renderer.render(scene, camera);
      }

      if (!prefersReducedMotion) {
        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }
    };

    if (!prefersReducedMotion) {
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    return () => {
      disposed = true;
      applyThemeRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);

      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      envRT.dispose();
      renderer.dispose();
    };
  }, []);

  const activeMeta = NODE_METADATA[activeNodeId] ?? NODE_METADATA.hub;

  if (webglFallback) {
    return (
      <div className="relative flex h-[400px] w-full flex-col items-center justify-center sm:h-[460px] lg:h-[500px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-8 rounded-full blur-2xl"
          style={{
            background:
              'radial-gradient(circle, var(--color-glow-soft) 0%, var(--color-glow-secondary) 46%, transparent 72%)',
          }}
        />
        <svg viewBox="0 0 420 340" className="relative h-full w-full max-w-[440px]">
          <path d="M210 170 Q130 110 95 75" stroke={themeConfig.borderTint} strokeWidth="3" fill="none" />
          <path d="M210 170 Q290 110 325 80" stroke={themeConfig.borderTint} strokeWidth="3" fill="none" />
          <path d="M210 170 Q300 165 340 190" stroke={themeConfig.borderTint} strokeWidth="3" fill="none" />
          <path d="M210 170 Q260 240 295 275" stroke={themeConfig.borderTint} strokeWidth="3" fill="none" />
          <path d="M210 170 Q145 235 110 270" stroke={themeConfig.borderTint} strokeWidth="3" fill="none" />
          <path d="M210 170 Q115 170 72 175" stroke={themeConfig.borderTint} strokeWidth="3" fill="none" />
          <circle cx="210" cy="170" r="46" fill="#FFFFFF" stroke={themeConfig.borderTint} strokeWidth="3" />
          <circle cx="210" cy="170" r="16" fill={themeConfig.primaryStrong} />
          <circle cx="95" cy="75" r="24" fill={themeConfig.surfaceTint} />
          <circle cx="325" cy="80" r="24" fill={themeConfig.borderTint} />
          <circle cx="340" cy="190" r="24" fill={themeConfig.surfaceSoft} />
          <circle cx="295" cy="275" r="24" fill={themeConfig.primaryStrong} />
          <circle cx="110" cy="270" r="24" fill={themeConfig.secondary} />
          <circle cx="72" cy="175" r="24" fill={themeConfig.borderTint} />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex h-[390px] w-full items-center justify-center sm:h-[450px] lg:h-[500px]">
        {/* Soft Ambient Theme Glow Behind Ecosystem */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-6 rounded-full blur-2xl"
          style={{
            background:
              'radial-gradient(circle, var(--color-glow-soft) 0%, var(--color-glow-secondary) 44%, transparent 72%)',
          }}
        />
        <div
          ref={mountRef}
          aria-label="Interactive 3D Claymorphism technology ecosystem connecting AI, Cloud, Data Analytics, Cybersecurity, Infrastructure, and Digital Transformation"
          className="relative h-full w-full"
        />
      </div>

      {/* Subtle Unboxed Dynamic Node Readout Below 3D Scene */}
      <div className="mt-1 text-center px-4 min-h-[2.75rem]">
        <p
          className="font-display text-xs font-bold tracking-wide"
          style={{ color: 'var(--color-primary-strong)' }}
        >
          {activeMeta.label}
        </p>
        <p className="mt-0.5 text-xs text-[#64748B]">{activeMeta.subtitle}</p>
      </div>
    </div>
  );
}
