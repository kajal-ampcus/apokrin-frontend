import { useEffect, useRef, useState } from 'react';
import {
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Layers,
  Radio,
  Server,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useTheme } from '../theme/themeConfig';

export type ServiceDiagramVariant = 'app-dev' | 'big-data' | 'database';
type DiagramPresetId = 'overview' | 'stage-1' | 'stage-2' | 'stage-3';

interface ServiceArchitectureDiagram3DProps {
  variant: ServiceDiagramVariant;
  prefersReducedMotion: boolean;
}

interface Disposables {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
}

interface CameraGoal {
  px: number;
  py: number;
  pz: number;
  lx: number;
  ly: number;
  lz: number;
}

interface VariantMeta {
  ariaLabel: string;
  presets: { id: DiagramPresetId; label: string }[];
  cameraGoals: Record<DiagramPresetId, CameraGoal>;
  fallbackStages: { title: string; subtitle: string; icon: typeof Database }[];
}

const VARIANT_META: Record<ServiceDiagramVariant, VariantMeta> = {
  'app-dev': {
    ariaLabel:
      'Interactive 3D Application Development architecture diagram showing multi-platform web and mobile client devices connected to a modular API microservices core and cloud container deployment cluster',
    presets: [
      { id: 'overview', label: 'Full Stack' },
      { id: 'stage-1', label: 'Client Apps' },
      { id: 'stage-2', label: 'API & Services' },
      { id: 'stage-3', label: 'Cloud Deploy' },
    ],
    cameraGoals: {
      overview: { px: 0.3, py: 3.65, pz: 8.95, lx: 0.0, ly: 0.34, lz: 0.0 },
      'stage-1': { px: -2.6, py: 2.75, pz: 5.7, lx: -1.85, ly: 0.25, lz: 0.1 },
      'stage-2': { px: 0.12, py: 2.8, pz: 5.45, lx: -0.05, ly: 0.58, lz: 0.0 },
      'stage-3': { px: 2.75, py: 2.85, pz: 5.75, lx: 1.85, ly: 0.45, lz: 0.0 },
    },
    fallbackStages: [
      { title: 'Client Apps', subtitle: 'Web · iOS · Android', icon: Smartphone },
      { title: 'API & Services', subtitle: 'Microservices Mesh', icon: Code2 },
      { title: 'Cloud Deploy', subtitle: 'CI/CD Containers', icon: Cloud },
    ],
  },
  'big-data': {
    ariaLabel:
      'Interactive 3D Big Data Lakehouse architecture diagram showing high-velocity stream ingestion nodes feeding a 3-tier Bronze Silver Gold data lakehouse core and a 3D AI neural lattice',
    presets: [
      { id: 'overview', label: 'Full Lakehouse' },
      { id: 'stage-1', label: 'Data Streams' },
      { id: 'stage-2', label: 'Lakehouse Core' },
      { id: 'stage-3', label: 'AI & ML Engine' },
    ],
    cameraGoals: {
      overview: { px: 0.35, py: 3.7, pz: 9.0, lx: 0.0, ly: 0.36, lz: 0.0 },
      'stage-1': { px: -2.7, py: 2.8, pz: 5.8, lx: -1.9, ly: 0.12, lz: 0.1 },
      'stage-2': { px: 0.1, py: 2.75, pz: 5.5, lx: -0.05, ly: 0.55, lz: 0.0 },
      'stage-3': { px: 2.8, py: 2.8, pz: 5.8, lx: 1.88, ly: 0.55, lz: 0.0 },
    },
    fallbackStages: [
      { title: 'Data Streams', subtitle: 'Real-Time Ingestion', icon: Radio },
      { title: 'Data Lakehouse', subtitle: 'Bronze · Silver · Gold', icon: Database },
      { title: 'AI & ML Engine', subtitle: 'Predictive Models', icon: BrainCircuit },
    ],
  },
  database: {
    ariaLabel:
      'Interactive 3D Database Management architecture diagram showing a primary high-availability database tower connected through a zero-trust replication shield to multi-region read replicas and encrypted backup vault',
    presets: [
      { id: 'overview', label: 'Full Topology' },
      { id: 'stage-1', label: 'Primary Cluster' },
      { id: 'stage-2', label: 'Security & Sync' },
      { id: 'stage-3', label: 'Replicas & DR' },
    ],
    cameraGoals: {
      overview: { px: 0.3, py: 3.65, pz: 8.95, lx: 0.0, ly: 0.35, lz: 0.0 },
      'stage-1': { px: -2.65, py: 2.8, pz: 5.75, lx: -1.85, ly: 0.35, lz: 0.0 },
      'stage-2': { px: 0.1, py: 2.7, pz: 5.35, lx: 0.0, ly: 0.55, lz: 0.0 },
      'stage-3': { px: 2.8, py: 2.85, pz: 5.8, lx: 1.88, ly: 0.3, lz: 0.0 },
    },
    fallbackStages: [
      { title: 'Primary Cluster', subtitle: 'High-Availability Core', icon: Database },
      { title: 'Security & Sync', subtitle: 'Zero-Trust Replication', icon: ShieldCheck },
      { title: 'Replicas & DR', subtitle: 'Multi-Region Continuity', icon: Server },
    ],
  },
};

const _tmpVec = new THREE.Vector3();

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

function createRoundedSlabGeometry(
  width: number,
  depth: number,
  radius: number,
  thickness: number,
): THREE.ExtrudeGeometry {
  const hw = width / 2;
  const hd = depth / 2;
  const r = Math.min(radius, hw * 0.45, hd * 0.45);
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
  shape.lineTo(hw, hd - r);
  shape.quadraticCurveTo(hw, hd, hw - r, hd);
  shape.lineTo(-hw + r, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
  shape.lineTo(-hw, -hd + r);
  shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
  });
  geo.rotateX(-Math.PI / 2);
  geo.center();
  return geo;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.06,
      size / 2,
      size / 2,
      size * 0.48,
    );
    grad.addColorStop(0, 'rgba(10, 17, 40, 0.24)');
    grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.10)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createDiagramLabelTexture(
  title: string,
  subtitle: string,
  accentHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 148;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = 10;
    const y = 12;
    const w = canvas.width - 20;
    const h = canvas.height - 24;
    const r = 28;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fillStyle = 'rgba(10, 17, 40, 0.92)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.stroke();

    ctx.fillStyle = accentHex;
    ctx.fillRect(36, 40, 8, 68);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 33px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(title, 62, 38);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 22px "DM Sans", system-ui, sans-serif';
    ctx.fillText(subtitle, 62, 84);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(maxAnisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

interface StreamPacket {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  speed: number;
  offset: number;
  reverse?: boolean;
}

interface LabelEntry {
  sprite: THREE.Sprite;
  baseY: number;
}

export function ServiceArchitectureDiagram3D({
  variant,
  prefersReducedMotion,
}: ServiceArchitectureDiagram3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activePresetRef = useRef<DiagramPresetId>('overview');
  const renderStaticRef = useRef<(() => void) | null>(null);
  const { themeConfig } = useTheme();
  const [activePreset, setActivePreset] = useState<DiagramPresetId>('overview');
  const [webglFailed, setWebglFailed] = useState(false);

  const meta = VARIANT_META[variant];

  useEffect(() => {
    setActivePreset('overview');
  }, [variant]);

  useEffect(() => {
    activePresetRef.current = activePreset;
    renderStaticRef.current?.();
  }, [activePreset]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      const isSoftwareGl = detectSoftwareWebGL();
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = false;
      renderer.setClearColor(0x000000, 0);

      const initialW = Math.max(container.clientWidth, 300);
      const initialH = Math.max(container.clientHeight, 320);
      renderer.setSize(initialW, initialH);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      const disposables: Disposables = { geometries: [], materials: [], textures: [] };
      const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
        disposables.geometries.push(g);
        return g;
      };
      const trackMat = <T extends THREE.Material>(m: T): T => {
        disposables.materials.push(m);
        return m;
      };
      const trackTex = <T extends THREE.Texture>(t: T): T => {
        disposables.textures.push(t);
        return t;
      };

      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const scene = new THREE.Scene();

      // Studio PBR reflections
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTex = trackTex(pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture);
      scene.environment = envTex;
      pmremGenerator.dispose();

      const camera = new THREE.PerspectiveCamera(34, initialW / initialH, 0.1, 60);
      const initGoal = VARIANT_META[variant].cameraGoals.overview;
      camera.position.set(initGoal.px, initGoal.py, initGoal.pz);
      camera.lookAt(initGoal.lx, initGoal.ly, initGoal.lz);

      const primaryColor = new THREE.Color(themeConfig.primary);
      const primaryStrongColor = new THREE.Color(themeConfig.primaryStrong);
      const secondaryColor = new THREE.Color(themeConfig.secondary);
      const accentColor = new THREE.Color(themeConfig.accent);

      // Warm key + cool HemisphereLight fill + theme rim
      scene.add(new THREE.HemisphereLight(0xf0f7ff, 0xcbd5e1, 1.12));

      const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.65);
      keyLight.position.set(5.5, 8.5, 6.5);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(primaryColor, 1.3);
      rimLight.position.set(-5.5, 4.2, -4.5);
      scene.add(rimLight);

      const accentFill = new THREE.PointLight(secondaryColor, 2.1, 16);
      accentFill.position.set(3.5, 3.2, 4.0);
      scene.add(accentFill);

      // Shared PBR materials
      const darkNavyMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0x0a1128,
          roughness: 0.32,
          metalness: 0.42,
          clearcoat: 0.45,
        }),
      );
      const brushedSlateMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.42,
          metalness: 0.65,
        }),
      );
      const brushedSilverMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          roughness: 0.22,
          metalness: 0.78,
        }),
      );
      const frostedDeckMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xf8fbff,
          roughness: 0.16,
          metalness: 0.08,
          transparent: true,
          opacity: isSoftwareGl ? 0.85 : 0.74,
          clearcoat: 0.9,
          clearcoatRoughness: 0.12,
        }),
      );
      const trimMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: primaryColor,
          emissive: primaryColor,
          emissiveIntensity: 0.32,
          roughness: 0.28,
          metalness: 0.55,
        }),
      );
      const primaryGlowMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: primaryColor,
          emissive: primaryColor,
          emissiveIntensity: 0.52,
          roughness: 0.18,
          metalness: 0.28,
          clearcoat: 0.7,
        }),
      );
      const secondaryGlowMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: secondaryColor,
          emissive: secondaryColor,
          emissiveIntensity: 0.58,
          roughness: 0.18,
          metalness: 0.28,
          clearcoat: 0.7,
        }),
      );
      const accentGlowMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: accentColor,
          emissive: accentColor,
          emissiveIntensity: 0.68,
          roughness: 0.2,
          metalness: 0.35,
        }),
      );
      const wireCageMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: secondaryColor,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        }),
      );
      const conduitMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: primaryColor,
          emissive: primaryColor,
          emissiveIntensity: 0.28,
          roughness: 0.3,
          metalness: 0.4,
          transparent: true,
          opacity: 0.65,
        }),
      );

      // Root group + contact shadow + stepped architectural plinth
      const diagramRoot = new THREE.Group();
      scene.add(diagramRoot);

      const shadowTex = trackTex(createContactShadowTexture());
      const shadowPlane = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(7.8, 5.4)),
        trackMat(
          new THREE.MeshBasicMaterial({
            map: shadowTex,
            transparent: true,
            depthWrite: false,
            opacity: 0.85,
          }),
        ),
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.set(0, -1.35, 0);
      diagramRoot.add(shadowPlane);

      const baseGroup = new THREE.Group();
      baseGroup.position.set(0, -0.82, 0);
      diagramRoot.add(baseGroup);

      const lowerBase = new THREE.Mesh(
        trackGeo(createRoundedSlabGeometry(6.1, 3.8, 0.32, 0.12)),
        darkNavyMat,
      );
      lowerBase.position.y = -0.14;
      baseGroup.add(lowerBase);

      const trimSlab = new THREE.Mesh(
        trackGeo(createRoundedSlabGeometry(5.92, 3.62, 0.28, 0.04)),
        trimMat,
      );
      trimSlab.position.y = -0.04;
      baseGroup.add(trimSlab);

      const upperDeck = new THREE.Mesh(
        trackGeo(createRoundedSlabGeometry(5.78, 3.48, 0.26, 0.11)),
        frostedDeckMat,
      );
      upperDeck.position.y = 0.05;
      baseGroup.add(upperDeck);

      const gridPts: THREE.Vector3[] = [];
      for (let x = -2.5; x <= 2.51; x += 0.5) {
        gridPts.push(new THREE.Vector3(x, 0.15, -1.45), new THREE.Vector3(x, 0.15, 1.45));
      }
      for (let z = -1.4; z <= 1.41; z += 0.466) {
        gridPts.push(new THREE.Vector3(-2.55, 0.15, z), new THREE.Vector3(2.55, 0.15, z));
      }
      baseGroup.add(
        new THREE.LineSegments(
          trackGeo(new THREE.BufferGeometry().setFromPoints(gridPts)),
          trackMat(
            new THREE.LineBasicMaterial({
              color: primaryStrongColor,
              transparent: true,
              opacity: 0.18,
            }),
          ),
        ),
      );

      // Shared animation collections populated per variant
      const streamPackets: StreamPacket[] = [];
      const labels: LabelEntry[] = [];
      const packetGeo = trackGeo(new THREE.SphereGeometry(0.055, 12, 12));
      const updateCallbacks: ((elapsed: number) => void)[] = [];

      const addConduit = (
        points: THREE.Vector3[],
        packetCount: number,
        speed: number,
        useAccent: boolean,
        bidirectional = false,
      ) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const tube = new THREE.Mesh(
          trackGeo(new THREE.TubeGeometry(curve, 36, 0.017, 8, false)),
          conduitMat,
        );
        diagramRoot.add(tube);

        for (let k = 0; k < packetCount; k++) {
          const mesh = new THREE.Mesh(
            packetGeo,
            useAccent ? accentGlowMat : k % 2 === 0 ? secondaryGlowMat : primaryGlowMat,
          );
          diagramRoot.add(mesh);
          streamPackets.push({
            mesh,
            curve,
            speed,
            offset: (k / packetCount + points[0].z * 0.13 + 1) % 1,
            reverse: bidirectional && k % 2 === 1,
          });
        }
      };

      const addLabel = (
        title: string,
        subtitle: string,
        pos: [number, number, number],
        accentHex: string,
      ) => {
        const tex = trackTex(createDiagramLabelTexture(title, subtitle, accentHex, maxAniso));
        const sprite = new THREE.Sprite(
          trackMat(
            new THREE.SpriteMaterial({
              map: tex,
              transparent: true,
              depthTest: true,
              depthWrite: false,
            }),
          ),
        );
        sprite.position.set(...pos);
        sprite.scale.set(1.78, 0.51, 1);
        diagramRoot.add(sprite);
        labels.push({ sprite, baseY: pos[1] });
      };

      // =====================================================================
      // VARIANT 1: APPLICATION DEVELOPMENT (Client Apps -> API Mesh -> Cloud)
      // =====================================================================
      if (variant === 'app-dev') {
        // STAGE 1 (LEFT): Multi-Platform Client Devices (Web Monitor + Smartphone)
        const clientsGroup = new THREE.Group();
        clientsGroup.position.set(-1.92, -0.66, 0.05);
        diagramRoot.add(clientsGroup);

        // Angled Web Monitor Assembly
        const monitorGroup = new THREE.Group();
        monitorGroup.position.set(-0.08, 0, -0.35);
        monitorGroup.rotation.y = 0.34;
        clientsGroup.add(monitorGroup);

        const monBase = new THREE.Mesh(
          trackGeo(createRoundedSlabGeometry(0.68, 0.42, 0.08, 0.05)),
          brushedSlateMat,
        );
        monBase.position.y = 0.04;
        monitorGroup.add(monBase);

        const monNeck = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.14, 0.32, 0.08)),
          brushedSilverMat,
        );
        monNeck.position.set(0, 0.22, -0.05);
        monitorGroup.add(monNeck);

        const monFrame = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(1.38, 0.88, 0.07)),
          darkNavyMat,
        );
        monFrame.position.set(0, 0.72, 0);
        monitorGroup.add(monFrame);

        const monScreen = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(1.24, 0.74, 0.02)),
          frostedDeckMat,
        );
        monScreen.position.set(0, 0.72, 0.04);
        monitorGroup.add(monScreen);

        // Luminous UI layout blocks hovering slightly in front of web monitor
        const uiBar1 = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(1.06, 0.12, 0.03)),
          primaryGlowMat,
        );
        uiBar1.position.set(0, 0.94, 0.07);
        monitorGroup.add(uiBar1);

        const uiCardL = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.56, 0.42, 0.035)),
          secondaryGlowMat,
        );
        uiCardL.position.set(-0.24, 0.6, 0.08);
        monitorGroup.add(uiCardL);

        const uiCardR = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.42, 0.42, 0.035)),
          brushedSlateMat,
        );
        uiCardR.position.set(0.32, 0.6, 0.075);
        monitorGroup.add(uiCardR);

        // Native Smartphone Assembly (Front-Left)
        const phoneGroup = new THREE.Group();
        phoneGroup.position.set(0.38, 0.44, 0.62);
        phoneGroup.rotation.y = 0.45;
        phoneGroup.rotation.x = -0.1;
        clientsGroup.add(phoneGroup);

        const phoneBody = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.48, 0.86, 0.06)),
          darkNavyMat,
        );
        phoneGroup.add(phoneBody);

        const phoneScreen = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.41, 0.76, 0.02)),
          frostedDeckMat,
        );
        phoneScreen.position.z = 0.035;
        phoneGroup.add(phoneScreen);

        const phoneAccent = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.32, 0.2, 0.03)),
          accentGlowMat,
        );
        phoneAccent.position.set(0, 0.16, 0.055);
        phoneGroup.add(phoneAccent);

        const phoneTile = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.32, 0.28, 0.025)),
          primaryGlowMat,
        );
        phoneTile.position.set(0, -0.15, 0.055);
        phoneGroup.add(phoneTile);

        // STAGE 2 (CENTER): Modular API Gateway & Microservices Mesh
        const meshGroup = new THREE.Group();
        meshGroup.position.set(-0.04, -0.66, -0.02);
        diagramRoot.add(meshGroup);

        const hubBase = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.74, 0.86, 0.14, 6)),
          darkNavyMat,
        );
        hubBase.position.y = 0.07;
        meshGroup.add(hubBase);

        const hubHexRing = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.8, 0.026, 12, 6)),
          primaryGlowMat,
        );
        hubHexRing.rotation.x = Math.PI / 2;
        hubHexRing.position.y = 0.16;
        meshGroup.add(hubHexRing);

        const gatewayRing = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.92, 0.022, 12, 6)),
          secondaryGlowMat,
        );
        gatewayRing.position.set(0, 1.15, 0);
        gatewayRing.rotation.x = Math.PI * 0.34;
        meshGroup.add(gatewayRing);

        // 4 Modular Microservice Cubes arranged in a floating 3D cluster
        const serviceCluster = new THREE.Group();
        serviceCluster.position.set(0, 1.15, 0);
        meshGroup.add(serviceCluster);

        const cubeGeo = trackGeo(new THREE.BoxGeometry(0.32, 0.32, 0.32));
        const cubeOffsets: [number, number, number][] = [
          [-0.24, 0.22, 0.2],
          [0.24, 0.22, -0.2],
          [-0.24, -0.22, -0.2],
          [0.24, -0.22, 0.2],
        ];
        const serviceCubes: THREE.Mesh[] = [];
        cubeOffsets.forEach(([cx, cy, cz], i) => {
          const cube = new THREE.Mesh(
            cubeGeo,
            i === 0
              ? primaryGlowMat
              : i === 1
                ? secondaryGlowMat
                : i === 2
                  ? darkNavyMat
                  : accentGlowMat,
          );
          cube.position.set(cx, cy, cz);
          serviceCluster.add(cube);
          serviceCubes.push(cube);
        });

        const coreLinkCage = new THREE.Mesh(
          trackGeo(new THREE.OctahedronGeometry(0.58, 0)),
          wireCageMat,
        );
        serviceCluster.add(coreLinkCage);

        // STAGE 3 (RIGHT): Cloud Container Cluster & CI/CD Orbit
        const cloudGroup = new THREE.Group();
        cloudGroup.position.set(1.88, -0.2, 0.02);
        diagramRoot.add(cloudGroup);

        const cloudPillar = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.14, 0.18, 0.46, 24)),
          brushedSlateMat,
        );
        cloudPillar.position.y = -0.23;
        cloudGroup.add(cloudPillar);

        const cloudDeck = new THREE.Mesh(
          trackGeo(createRoundedSlabGeometry(1.9, 2.24, 0.22, 0.08)),
          darkNavyMat,
        );
        cloudDeck.position.y = 0.04;
        cloudGroup.add(cloudDeck);

        const cloudTrim = new THREE.Mesh(
          trackGeo(createRoundedSlabGeometry(1.96, 2.3, 0.24, 0.025)),
          secondaryGlowMat,
        );
        cloudTrim.position.y = -0.005;
        cloudGroup.add(cloudTrim);

        // 3 Stepped Container Pods on Cloud Deck
        const podPositions: [number, number, number][] = [
          [-0.46, 0.34, -0.45],
          [0.44, 0.44, -0.22],
          [-0.08, 0.38, 0.52],
        ];
        const pods: THREE.Group[] = [];
        podPositions.forEach(([px, py, pz], idx) => {
          const pod = new THREE.Group();
          pod.position.set(px, py, pz);

          const podBody = new THREE.Mesh(
            trackGeo(new THREE.BoxGeometry(0.68, 0.46, 0.56)),
            brushedSlateMat,
          );
          pod.add(podBody);

          const podCap = new THREE.Mesh(
            trackGeo(new THREE.BoxGeometry(0.7, 0.06, 0.58)),
            idx === 0 ? primaryGlowMat : idx === 1 ? secondaryGlowMat : accentGlowMat,
          );
          podCap.position.y = 0.24;
          pod.add(podCap);

          // Glowing status LED bars on pod front
          for (let s = 0; s < 3; s++) {
            const led = new THREE.Mesh(
              trackGeo(new THREE.BoxGeometry(0.12, 0.04, 0.02)),
              s === 2 ? accentGlowMat : brushedSilverMat,
            );
            led.position.set(-0.18 + s * 0.18, 0.05, 0.29);
            pod.add(led);
          }

          cloudGroup.add(pod);
          pods.push(pod);
        });

        // CI/CD Orbital Release Ring crowning Cloud Cluster
        const deployRing = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.95, 0.02, 12, 56)),
          accentGlowMat,
        );
        deployRing.position.set(0, 1.02, 0);
        deployRing.rotation.x = Math.PI * 0.46;
        cloudGroup.add(deployRing);

        // Glowing Data Conduits between Clients -> API Mesh -> Cloud Containers
        addConduit(
          [
            new THREE.Vector3(-1.32, 0.08, -0.3),
            new THREE.Vector3(-0.78, 0.56, -0.2),
            new THREE.Vector3(-0.46, 0.48, -0.05),
          ],
          2,
          0.28,
          false,
          true,
        );
        addConduit(
          [
            new THREE.Vector3(-1.3, -0.18, 0.65),
            new THREE.Vector3(-0.76, 0.36, 0.42),
            new THREE.Vector3(-0.46, 0.42, 0.1),
          ],
          2,
          0.32,
          true,
          true,
        );
        addConduit(
          [
            new THREE.Vector3(0.42, 0.54, -0.12),
            new THREE.Vector3(0.94, 0.78, -0.22),
            new THREE.Vector3(1.38, 0.28, -0.34),
          ],
          2,
          0.26,
          false,
        );
        addConduit(
          [
            new THREE.Vector3(0.42, 0.42, 0.14),
            new THREE.Vector3(0.96, 0.62, 0.36),
            new THREE.Vector3(1.48, 0.26, 0.46),
          ],
          2,
          0.3,
          true,
        );

        addLabel('CLIENT APPS', 'Web · iOS · Android', [-1.85, 1.15, 0.2], themeConfig.primary);
        addLabel('API & SERVICES', 'Microservices Mesh', [-0.04, 1.85, -0.02], themeConfig.secondary);
        addLabel('CLOUD DEPLOY', 'CI/CD & Containers', [1.9, 1.62, -0.1], themeConfig.accent);

        updateCallbacks.push((elapsed) => {
          phoneGroup.position.y = 0.44 + Math.sin(elapsed * 1.4) * 0.045;
          serviceCluster.rotation.y = elapsed * 0.45;
          gatewayRing.rotation.z = -elapsed * 0.52;
          deployRing.rotation.z = elapsed * 0.42;
          serviceCubes.forEach((c, idx) => {
            c.rotation.x = elapsed * 0.4 + idx;
            c.rotation.y = elapsed * 0.5 + idx;
          });
          pods.forEach((p, idx) => {
            p.position.y = podPositions[idx][1] + Math.sin(elapsed * 1.3 + idx * 1.1) * 0.03;
          });
        });
      }

      // =====================================================================
      // VARIANT 2: BIG DATA (Stream Emitters -> 3-Tier Lakehouse -> AI Lattice)
      // =====================================================================
      if (variant === 'big-data') {
        // STAGE 1 (LEFT): 5 High-Velocity Data Stream Emitter Towers
        const streamsGroup = new THREE.Group();
        diagramRoot.add(streamsGroup);

        const emitterCoords: [number, number, number][] = [
          [-2.25, -0.92, 0.56],
          [-2.35, -0.3, 0.72],
          [-2.25, 0.32, 0.64],
          [-2.15, 0.92, 0.52],
          [-1.58, 0.78, 0.48],
        ];

        const emitterTops: THREE.Vector3[] = [];
        const emitterCaps: THREE.Mesh[] = [];

        emitterCoords.forEach(([ex, ez, h], idx) => {
          const tower = new THREE.Group();
          tower.position.set(ex, -0.66, ez);

          const foot = new THREE.Mesh(
            trackGeo(new THREE.CylinderGeometry(0.18, 0.22, 0.08, 16)),
            brushedSlateMat,
          );
          foot.position.y = 0.04;
          tower.add(foot);

          const shaft = new THREE.Mesh(
            trackGeo(new THREE.CylinderGeometry(0.11, 0.14, h, 16)),
            darkNavyMat,
          );
          shaft.position.y = 0.08 + h / 2;
          tower.add(shaft);

          const cap = new THREE.Mesh(
            trackGeo(new THREE.OctahedronGeometry(0.13, 0)),
            idx % 2 === 0 ? primaryGlowMat : secondaryGlowMat,
          );
          cap.position.y = 0.18 + h;
          tower.add(cap);
          emitterCaps.push(cap);

          const collar = new THREE.Mesh(
            trackGeo(new THREE.TorusGeometry(0.15, 0.015, 8, 24)),
            accentGlowMat,
          );
          collar.rotation.x = Math.PI / 2;
          collar.position.y = 0.08 + h;
          tower.add(collar);

          streamsGroup.add(tower);
          emitterTops.push(new THREE.Vector3(ex, -0.48 + h, ez));
        });

        // STAGE 2 (CENTER): 3-Tier Bronze/Silver/Gold Data Lakehouse Tower + 6 Compute Workers
        const lakeGroup = new THREE.Group();
        lakeGroup.position.set(-0.04, -0.66, -0.02);
        diagramRoot.add(lakeGroup);

        const lakeTiers = [
          { rTop: 0.82, rBot: 0.92, h: 0.26, y: 0.13, ringMat: primaryGlowMat },   // Bronze Raw
          { rTop: 0.64, rBot: 0.72, h: 0.28, y: 0.48, ringMat: secondaryGlowMat }, // Silver Refined
          { rTop: 0.46, rBot: 0.54, h: 0.28, y: 0.84, ringMat: accentGlowMat },    // Gold Curated
        ];

        lakeTiers.forEach((tier) => {
          const drum = new THREE.Mesh(
            trackGeo(new THREE.CylinderGeometry(tier.rTop, tier.rBot, tier.h, 36)),
            darkNavyMat,
          );
          drum.position.y = tier.y;
          lakeGroup.add(drum);

          const glowBand = new THREE.Mesh(
            trackGeo(new THREE.TorusGeometry(tier.rTop + 0.02, 0.024, 12, 48)),
            tier.ringMat,
          );
          glowBand.rotation.x = Math.PI / 2;
          glowBand.position.y = tier.y + tier.h / 2 - 0.01;
          lakeGroup.add(glowBand);
        });

        // Crown Crystal Core atop Gold Tier
        const lakeCrown = new THREE.Mesh(
          trackGeo(new THREE.OctahedronGeometry(0.28, 0)),
          primaryGlowMat,
        );
        lakeCrown.position.y = 1.38;
        lakeGroup.add(lakeCrown);

        // 6 Orbiting Distributed Compute Workers (Spark/Cluster nodes)
        const workerGeo = trackGeo(new THREE.BoxGeometry(0.14, 0.14, 0.14));
        const workers: THREE.Mesh[] = [];
        for (let w = 0; w < 6; w++) {
          const worker = new THREE.Mesh(
            workerGeo,
            w % 2 === 0 ? secondaryGlowMat : brushedSilverMat,
          );
          lakeGroup.add(worker);
          workers.push(worker);
        }

        // STAGE 3 (RIGHT): Elevated 3D AI / ML Neural Lattice Sculpture
        const aiGroup = new THREE.Group();
        aiGroup.position.set(1.88, -0.22, 0.02);
        diagramRoot.add(aiGroup);

        const aiPillar = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.14, 0.18, 0.44, 24)),
          brushedSlateMat,
        );
        aiPillar.position.y = -0.22;
        aiGroup.add(aiPillar);

        const aiDeck = new THREE.Mesh(
          trackGeo(createRoundedSlabGeometry(1.88, 2.26, 0.22, 0.08)),
          darkNavyMat,
        );
        aiDeck.position.y = 0.04;
        aiGroup.add(aiDeck);

        const aiTrim = new THREE.Mesh(
          trackGeo(createRoundedSlabGeometry(1.94, 2.32, 0.24, 0.025)),
          accentGlowMat,
        );
        aiTrim.position.y = -0.005;
        aiGroup.add(aiTrim);

        // 3-Layer 3D Neural Lattice (Input -> Hidden -> Output nodes + Synaptic Beams)
        const latticeGroup = new THREE.Group();
        latticeGroup.position.set(0, 0.72, 0);
        aiGroup.add(latticeGroup);

        const layerNodes: THREE.Vector3[][] = [
          [
            new THREE.Vector3(-0.56, -0.32, -0.45),
            new THREE.Vector3(-0.56, 0.28, -0.45),
            new THREE.Vector3(-0.56, -0.32, 0.45),
            new THREE.Vector3(-0.56, 0.28, 0.45),
          ],
          [
            new THREE.Vector3(0.0, -0.38, 0.0),
            new THREE.Vector3(0.0, 0.0, -0.42),
            new THREE.Vector3(0.0, 0.0, 0.42),
            new THREE.Vector3(0.0, 0.42, 0.0),
          ],
          [
            new THREE.Vector3(0.56, -0.18, -0.28),
            new THREE.Vector3(0.56, 0.26, 0.0),
            new THREE.Vector3(0.56, -0.18, 0.28),
          ],
        ];

        const neuronGeo = trackGeo(new THREE.SphereGeometry(0.095, 16, 16));
        const neuronMeshes: THREE.Mesh[] = [];
        const synapsePts: THREE.Vector3[] = [];

        layerNodes.forEach((layer, lIdx) => {
          layer.forEach((pt) => {
            const neuron = new THREE.Mesh(
              neuronGeo,
              lIdx === 0 ? primaryGlowMat : lIdx === 1 ? secondaryGlowMat : accentGlowMat,
            );
            neuron.position.copy(pt);
            latticeGroup.add(neuron);
            neuronMeshes.push(neuron);
          });

          if (lIdx < layerNodes.length - 1) {
            const nextLayer = layerNodes[lIdx + 1];
            layer.forEach((from) => {
              nextLayer.forEach((to) => {
                synapsePts.push(from, to);
              });
            });
          }
        });

        latticeGroup.add(
          new THREE.LineSegments(
            trackGeo(new THREE.BufferGeometry().setFromPoints(synapsePts)),
            trackMat(
              new THREE.LineBasicMaterial({
                color: accentColor,
                transparent: true,
                opacity: 0.62,
              }),
            ),
          ),
        );

        // Conduits: Streams -> Lakehouse Tiers -> AI Neural Lattice
        emitterTops.forEach((startPt, idx) => {
          const targetY = -0.35 + (idx % 3) * 0.34;
          addConduit(
            [
              startPt,
              new THREE.Vector3((startPt.x - 0.65) * 0.5, targetY + 0.35, startPt.z * 0.65),
              new THREE.Vector3(-0.68, targetY, startPt.z * 0.22),
            ],
            2,
            0.3 + (idx % 3) * 0.05,
            idx % 2 === 1,
          );
        });

        addConduit(
          [
            new THREE.Vector3(0.46, 0.24, -0.18),
            new THREE.Vector3(0.95, 0.65, -0.25),
            new THREE.Vector3(1.32, 0.52, -0.35),
          ],
          2,
          0.32,
          false,
        );
        addConduit(
          [
            new THREE.Vector3(0.46, 0.45, 0.18),
            new THREE.Vector3(0.95, 0.82, 0.25),
            new THREE.Vector3(1.32, 0.52, 0.35),
          ],
          2,
          0.28,
          true,
        );

        addLabel('DATA STREAMS', 'Real-Time Ingestion', [-2.05, 0.85, 0.72], themeConfig.primary);
        addLabel('DATA LAKEHOUSE', 'Bronze · Silver · Gold', [-0.04, 1.82, -0.02], themeConfig.secondary);
        addLabel('AI & ML ENGINE', 'Predictive Intelligence', [1.9, 1.72, -0.05], themeConfig.accent);

        updateCallbacks.push((elapsed) => {
          lakeCrown.rotation.y = elapsed * 0.7;
          lakeCrown.position.y = 1.38 + Math.sin(elapsed * 1.6) * 0.05;
          emitterCaps.forEach((cap, idx) => {
            cap.rotation.y = elapsed * 0.8 + idx;
          });
          workers.forEach((w, idx) => {
            const angle = (idx / workers.length) * Math.PI * 2 + elapsed * 0.55;
            const radius = 1.04;
            w.position.set(
              Math.cos(angle) * radius,
              0.55 + Math.sin(elapsed * 1.4 + idx) * 0.26,
              Math.sin(angle) * radius,
            );
            w.rotation.y = -angle;
          });
          latticeGroup.rotation.y = Math.sin(elapsed * 0.45) * 0.22;
          neuronMeshes.forEach((n, idx) => {
            const s = 1 + Math.sin(elapsed * 2.2 + idx * 0.65) * 0.14;
            n.scale.setScalar(s);
          });
        });
      }

      // =====================================================================
      // VARIANT 3: DATABASE MANAGEMENT (Primary Cluster -> Shield -> Replicas)
      // =====================================================================
      if (variant === 'database') {
        // STAGE 1 (LEFT): Flagship Primary High-Availability Database Tower
        const primaryGroup = new THREE.Group();
        primaryGroup.position.set(-1.86, -0.66, 0.0);
        diagramRoot.add(primaryGroup);

        const pFoot = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.68, 0.76, 0.14, 36)),
          brushedSlateMat,
        );
        pFoot.position.y = 0.07;
        primaryGroup.add(pFoot);

        const platterGeo = trackGeo(new THREE.CylinderGeometry(0.58, 0.58, 0.18, 36));
        const spacerGeo = trackGeo(new THREE.CylinderGeometry(0.46, 0.46, 0.07, 32));
        const rimGeo = trackGeo(new THREE.TorusGeometry(0.6, 0.022, 12, 42));

        for (let t = 0; t < 4; t++) {
          const y = 0.24 + t * 0.28;
          const platter = new THREE.Mesh(
            platterGeo,
            t === 3 ? primaryGlowMat : darkNavyMat,
          );
          platter.position.y = y;
          primaryGroup.add(platter);

          const rim = new THREE.Mesh(rimGeo, t % 2 === 0 ? secondaryGlowMat : accentGlowMat);
          rim.rotation.x = Math.PI / 2;
          rim.position.y = y + 0.08;
          primaryGroup.add(rim);

          if (t < 3) {
            const spacer = new THREE.Mesh(spacerGeo, brushedSilverMat);
            spacer.position.y = y + 0.14;
            primaryGroup.add(spacer);
          }
        }

        // Orbiting Index Query Ring crowning Primary DB
        const indexRing = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.76, 0.02, 12, 52)),
          secondaryGlowMat,
        );
        indexRing.position.y = 1.24;
        indexRing.rotation.x = Math.PI * 0.42;
        primaryGroup.add(indexRing);

        // STAGE 2 (CENTER): Zero-Trust Security & Synchronous Replication Control Core
        const syncGroup = new THREE.Group();
        syncGroup.position.set(0.0, -0.66, 0.0);
        diagramRoot.add(syncGroup);

        const syncPed = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.52, 0.64, 0.18, 6)),
          darkNavyMat,
        );
        syncPed.position.y = 0.09;
        syncGroup.add(syncPed);

        const syncCoreAssembly = new THREE.Group();
        syncCoreAssembly.position.set(0, 1.05, 0);
        syncGroup.add(syncCoreAssembly);

        // Hexagonal Security Shield Ring + Interlocking Sync Gyro + Vault Prism
        const hexShield = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.68, 0.045, 10, 6)),
          primaryGlowMat,
        );
        syncCoreAssembly.add(hexShield);

        const innerVaultPrism = new THREE.Mesh(
          trackGeo(new THREE.OctahedronGeometry(0.36, 0)),
          accentGlowMat,
        );
        syncCoreAssembly.add(innerVaultPrism);

        const syncRingA = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.84, 0.02, 12, 52)),
          secondaryGlowMat,
        );
        syncRingA.rotation.x = Math.PI * 0.35;
        syncCoreAssembly.add(syncRingA);

        const syncRingB = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.96, 0.016, 12, 56)),
          brushedSilverMat,
        );
        syncRingB.rotation.y = Math.PI * 0.35;
        syncRingB.rotation.x = -Math.PI * 0.25;
        syncCoreAssembly.add(syncRingB);

        // STAGE 3 (RIGHT): Multi-Region Read Replicas + Encrypted DR Backup Vault
        const replicaStage = new THREE.Group();
        replicaStage.position.set(1.88, -0.22, 0.02);
        diagramRoot.add(replicaStage);

        const repPillar = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.14, 0.18, 0.44, 24)),
          brushedSlateMat,
        );
        repPillar.position.y = -0.22;
        replicaStage.add(repPillar);

        const repDeck = new THREE.Mesh(
          trackGeo(createRoundedSlabGeometry(1.94, 2.34, 0.22, 0.08)),
          darkNavyMat,
        );
        repDeck.position.y = 0.04;
        replicaStage.add(repDeck);

        const repBorder = new THREE.Mesh(
          trackGeo(createRoundedSlabGeometry(2.0, 2.4, 0.24, 0.025)),
          primaryGlowMat,
        );
        repBorder.position.y = -0.005;
        replicaStage.add(repBorder);

        // 3 Synchronized Read-Replica Cylinder Stacks in a resilient triangle
        const repCoords: [number, number][] = [
          [-0.45, -0.58],
          [0.48, -0.48],
          [-0.42, 0.56],
        ];
        const repDiscGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.1, 28));
        const repRingGeo = trackGeo(new THREE.TorusGeometry(0.25, 0.015, 10, 32));
        const replicaNodes: THREE.Group[] = [];

        repCoords.forEach(([rx, rz], idx) => {
          const stack = new THREE.Group();
          stack.position.set(rx, 0.12, rz);

          for (let tier = 0; tier < 3; tier++) {
            const y = 0.06 + tier * 0.15;
            const disc = new THREE.Mesh(
              repDiscGeo,
              tier === 2 ? secondaryGlowMat : brushedSlateMat,
            );
            disc.position.y = y;
            stack.add(disc);

            const ring = new THREE.Mesh(repRingGeo, idx === 1 ? accentGlowMat : primaryGlowMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = y + 0.05;
            stack.add(ring);
          }

          replicaStage.add(stack);
          replicaNodes.push(stack);
        });

        // Encrypted DR Backup Vault Cube (Front-Right of Replica Deck)
        const vaultGroup = new THREE.Group();
        vaultGroup.position.set(0.46, 0.36, 0.54);
        replicaStage.add(vaultGroup);

        const vaultBody = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.52, 0.44, 0.52)),
          brushedSlateMat,
        );
        vaultGroup.add(vaultBody);

        const vaultLid = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.56, 0.06, 0.56)),
          accentGlowMat,
        );
        vaultLid.position.y = 0.24;
        vaultGroup.add(vaultLid);

        const vaultSeal = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.14, 0.022, 10, 24)),
          brushedSilverMat,
        );
        vaultSeal.position.set(0, 0.02, 0.27);
        vaultGroup.add(vaultSeal);

        // Bidirectional Sync Conduits: Primary <-> Shield <-> Replicas & DR
        addConduit(
          [
            new THREE.Vector3(-1.26, 0.35, -0.18),
            new THREE.Vector3(-0.76, 0.72, -0.22),
            new THREE.Vector3(-0.42, 0.48, -0.12),
          ],
          2,
          0.3,
          false,
          true,
        );
        addConduit(
          [
            new THREE.Vector3(-1.26, 0.02, 0.22),
            new THREE.Vector3(-0.76, 0.42, 0.28),
            new THREE.Vector3(-0.42, 0.34, 0.14),
          ],
          2,
          0.26,
          true,
          true,
        );
        addConduit(
          [
            new THREE.Vector3(0.44, 0.48, -0.16),
            new THREE.Vector3(0.95, 0.76, -0.34),
            new THREE.Vector3(1.42, 0.34, -0.48),
          ],
          2,
          0.28,
          false,
          true,
        );
        addConduit(
          [
            new THREE.Vector3(0.44, 0.34, 0.16),
            new THREE.Vector3(0.96, 0.58, 0.38),
            new THREE.Vector3(1.46, 0.28, 0.52),
          ],
          2,
          0.32,
          true,
        );

        addLabel('PRIMARY CLUSTER', '24/7 HA & Tuning', [-1.86, 1.48, 0.0], themeConfig.primary);
        addLabel('SECURITY & SYNC', 'Encrypted Replication', [0.0, 1.85, 0.0], themeConfig.secondary);
        addLabel('REPLICAS & DR', 'Backup & Failover', [1.9, 1.42, -0.05], themeConfig.accent);

        updateCallbacks.push((elapsed) => {
          indexRing.rotation.z = elapsed * 0.45;
          innerVaultPrism.rotation.y = elapsed * 0.65;
          innerVaultPrism.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
          hexShield.rotation.y = Math.sin(elapsed * 0.55) * 0.35;
          syncRingA.rotation.z = elapsed * 0.42;
          syncRingB.rotation.z = -elapsed * 0.34;
          vaultSeal.rotation.z = elapsed * 0.5;
          replicaNodes.forEach((node, idx) => {
            node.position.y = 0.12 + Math.sin(elapsed * 1.4 + idx * 1.05) * 0.025;
          });
        });
      }

      // =====================================================================
      // INTERACTIVE POINTER DRAG + SUBTLE HOVER TILT
      // =====================================================================
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let baseYaw = -0.2;
      let basePitch = 0.06;
      let targetYaw = baseYaw;
      let targetPitch = basePitch;
      let currentYaw = baseYaw;
      let currentPitch = basePitch;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        container.setPointerCapture?.(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (prefersReducedMotion) return;
        if (isDragging) {
          const dx = e.clientX - dragStartX;
          const dy = e.clientY - dragStartY;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          baseYaw = THREE.MathUtils.clamp(baseYaw + dx * 0.006, -0.95, 0.75);
          basePitch = THREE.MathUtils.clamp(basePitch + dy * 0.004, -0.24, 0.34);
          targetYaw = baseYaw;
          targetPitch = basePitch;
          return;
        }
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetYaw = baseYaw + nx * 0.14;
        targetPitch = basePitch + ny * 0.07;
      };

      const onPointerUp = (e: PointerEvent) => {
        isDragging = false;
        container.releasePointerCapture?.(e.pointerId);
      };

      const onPointerLeave = () => {
        if (!isDragging) {
          targetYaw = baseYaw;
          targetPitch = basePitch;
        }
      };

      container.addEventListener('pointerdown', onPointerDown);
      container.addEventListener('pointermove', onPointerMove, { passive: true });
      container.addEventListener('pointerup', onPointerUp);
      container.addEventListener('pointerleave', onPointerLeave, { passive: true });

      const updateSize = () => {
        const w = Math.max(container.clientWidth, 280);
        const h = Math.max(container.clientHeight, 300);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(container);

      const lookTarget = new THREE.Vector3(initGoal.lx, initGoal.ly, initGoal.lz);

      const updateScene = (elapsed: number, delta: number) => {
        const goal = VARIANT_META[variant].cameraGoals[activePresetRef.current];
        camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.px, 4.2, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.py, 4.2, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.pz, 4.2, delta);
        lookTarget.x = THREE.MathUtils.damp(lookTarget.x, goal.lx, 4.2, delta);
        lookTarget.y = THREE.MathUtils.damp(lookTarget.y, goal.ly, 4.2, delta);
        lookTarget.z = THREE.MathUtils.damp(lookTarget.z, goal.lz, 4.2, delta);
        camera.lookAt(lookTarget);

        currentYaw = THREE.MathUtils.damp(currentYaw, targetYaw, 5.0, delta);
        currentPitch = THREE.MathUtils.damp(currentPitch, targetPitch, 5.0, delta);
        diagramRoot.rotation.y =
          currentYaw + (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.36) * 0.045);
        diagramRoot.rotation.x = currentPitch;
        diagramRoot.position.y = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.05) * 0.055;

        if (!prefersReducedMotion) {
          updateCallbacks.forEach((fn) => fn(elapsed));
        }

        streamPackets.forEach((pkt) => {
          const rawT = (pkt.offset + (prefersReducedMotion ? 0.35 : elapsed * pkt.speed)) % 1;
          const t = pkt.reverse ? 1 - rawT : rawT;
          pkt.curve.getPointAt(t, _tmpVec);
          pkt.mesh.position.copy(_tmpVec);
        });

        labels.forEach((lbl, idx) => {
          lbl.sprite.position.y =
            lbl.baseY + (prefersReducedMotion ? 0 : Math.sin(elapsed * 1.1 + idx * 1.2) * 0.04);
        });
      };

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      let frameId = 0;
      let disposed = false;
      const clock = new THREE.Clock();

      const afterDraw = (cb: () => void) => {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl || typeof gl.fenceSync !== 'function') {
          frameId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
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
      };

      if (prefersReducedMotion) {
        const renderStatic = () => {
          updateScene(0, 10);
          renderer.render(scene, camera);
        };
        renderStaticRef.current = renderStatic;
        renderStatic();
      } else {
        renderStaticRef.current = null;
        const tick = () => {
          if (disposed) return;
          const delta = Math.min(clock.getDelta(), 0.08);
          const elapsed = clock.getElapsedTime();
          updateScene(elapsed, delta);
          renderer.render(scene, camera);
          if (isSoftwareGl) {
            afterDraw(tick);
          } else {
            frameId = requestAnimationFrame(tick);
          }
        };
        tick();
      }

      return () => {
        disposed = true;
        renderStaticRef.current = null;
        cancelAnimationFrame(frameId);
        window.clearTimeout(frameId);
        resizeObserver.disconnect();
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointerleave', onPointerLeave);
        disposables.geometries.forEach((g) => g.dispose());
        disposables.materials.forEach((m) => m.dispose());
        disposables.textures.forEach((t) => t.dispose());
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch {
      setWebglFailed(true);
    }
  }, [variant, themeConfig, prefersReducedMotion]);

  if (webglFailed) {
    return (
      <div className="flex h-[380px] w-full flex-col items-center justify-center rounded-[2rem] border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:h-[440px]">
        <div className="grid w-full max-w-md grid-cols-3 gap-4 text-center">
          {meta.fallbackStages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isCenter = idx === 1;
            return (
              <div
                key={stage.title}
                className={
                  isCenter
                    ? 'rounded-2xl bg-[#0A1128] p-4 text-white shadow-md'
                    : 'rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm'
                }
              >
                <StageIcon
                  className="mx-auto h-7 w-7"
                  style={{
                    color: isCenter
                      ? themeConfig.accent
                      : idx === 0
                        ? themeConfig.primaryStrong
                        : themeConfig.secondaryText,
                  }}
                  aria-hidden="true"
                />
                <p
                  className={`mt-2 font-display text-xs font-bold ${
                    isCenter ? 'text-white' : 'text-[#0A1128]'
                  }`}
                >
                  {stage.title}
                </p>
                <p
                  className={`mt-1 text-[11px] ${
                    isCenter ? 'text-slate-300' : 'text-[#64748B]'
                  }`}
                >
                  {stage.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col items-center select-none">
      {/* Unobstructed 3D Architectural Diagram Viewport */}
      <div className="relative h-[360px] w-full sm:h-[420px] lg:h-[460px]">
        <div
          ref={containerRef}
          role="img"
          aria-label={meta.ariaLabel}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Unified Compact Bottom Layer Dock (Zero Canvas Occlusion) */}
      <div
        role="tablist"
        aria-label="Inspect 3D service architecture stage"
        className="mt-2 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-[#E2E8F0] bg-white p-1 shadow-[0_10px_28px_-14px_rgba(15,23,42,0.14)]"
      >
        <span className="hidden items-center gap-1.5 pl-3 pr-1.5 text-[11px] font-semibold text-[#64748B] sm:inline-flex">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          <span>View</span>
        </span>
        {meta.presets.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActivePreset(preset.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] ${
                isActive ? 'text-white shadow-xs' : 'text-[#475569] hover:text-[#0A1128]'
              }`}
              style={isActive ? { background: 'var(--color-btn-gradient)' } : undefined}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
