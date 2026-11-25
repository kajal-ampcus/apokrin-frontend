import { useEffect, useRef, useState } from 'react';
import { BarChart3, Cpu, Database, Layers } from 'lucide-react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useTheme } from '../theme/themeConfig';

export type DiagramLayerPreset = 'overview' | 'ingestion' | 'engine' | 'insights';

interface DataAnalyticsDiagram3DProps {
  prefersReducedMotion: boolean;
}

interface Disposables {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
}

const LAYER_PRESETS: { id: DiagramLayerPreset; label: string }[] = [
  { id: 'overview', label: 'Full Architecture' },
  { id: 'ingestion', label: 'Data Sources' },
  { id: 'engine', label: 'Analytics Core' },
  { id: 'insights', label: 'BI & Insights' },
];

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

    // Rounded architectural pill plate
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

    // Accent bar inside label
    ctx.fillStyle = accentHex;
    ctx.fillRect(36, 40, 8, 68);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 34px "Plus Jakarta Sans", system-ui, sans-serif';
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

export function DataAnalyticsDiagram3D({ prefersReducedMotion }: DataAnalyticsDiagram3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activePresetRef = useRef<DiagramLayerPreset>('overview');
  const renderStaticRef = useRef<(() => void) | null>(null);
  const { themeConfig } = useTheme();
  const [activePreset, setActivePreset] = useState<DiagramLayerPreset>('overview');
  const [webglFailed, setWebglFailed] = useState(false);

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

      // Studio environment reflections for crisp metallic & glass surfaces
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTex = trackTex(pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture);
      scene.environment = envTex;
      pmremGenerator.dispose();

      const camera = new THREE.PerspectiveCamera(34, initialW / initialH, 0.1, 60);
      camera.position.set(0.35, 3.8, 9.2);
      camera.lookAt(0, 0.35, 0);

      // Theme-aligned PBR color palette
      const primaryColor = new THREE.Color(themeConfig.primary);
      const primaryStrongColor = new THREE.Color(themeConfig.primaryStrong);
      const secondaryColor = new THREE.Color(themeConfig.secondary);
      const accentColor = new THREE.Color(themeConfig.accent);

      // Warm key + cool sky/ground HemisphereLight + subtle theme rim light
      const hemiLight = new THREE.HemisphereLight(0xf0f7ff, 0xcbd5e1, 1.1);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.65);
      keyLight.position.set(5.5, 8.5, 6.5);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(primaryColor, 1.25);
      rimLight.position.set(-5.5, 4.0, -4.5);
      scene.add(rimLight);

      const accentFill = new THREE.PointLight(secondaryColor, 2.2, 16);
      accentFill.position.set(3.5, 3.2, 4.0);
      scene.add(accentFill);

      // Shared PBR materials with distinct roughness/metalness hierarchy
      const darkNavyChassisMat = trackMat(
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

      const frostedPlatformMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xf8fbff,
          roughness: 0.16,
          metalness: 0.08,
          transparent: true,
          opacity: isSoftwareGl ? 0.84 : 0.74,
          clearcoat: 0.9,
          clearcoatRoughness: 0.12,
        }),
      );

      const platformTrimMat = trackMat(
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
          emissiveIntensity: 0.55,
          roughness: 0.18,
          metalness: 0.28,
          clearcoat: 0.7,
        }),
      );

      const secondaryGlowMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: secondaryColor,
          emissive: secondaryColor,
          emissiveIntensity: 0.62,
          roughness: 0.18,
          metalness: 0.28,
          clearcoat: 0.7,
        }),
      );

      const accentGlowMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: accentColor,
          emissive: accentColor,
          emissiveIntensity: 0.7,
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

      // Root diagram sculpture group
      const diagramRoot = new THREE.Group();
      scene.add(diagramRoot);

      // Soft Contact Grounding Shadow Plane directly beneath base
      const shadowTex = trackTex(createContactShadowTexture());
      const shadowGeo = trackGeo(new THREE.PlaneGeometry(7.8, 5.4));
      const shadowMat = trackMat(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          depthWrite: false,
          opacity: 0.85,
        }),
      );
      const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.set(0, -1.35, 0);
      diagramRoot.add(shadowPlane);

      // =====================================================================
      // ARCHITECTURAL BASE PLINTH (Multi-part stepped slab + grid overlay)
      // =====================================================================
      const baseGroup = new THREE.Group();
      baseGroup.position.set(0, -0.82, 0);
      diagramRoot.add(baseGroup);

      const lowerBaseGeo = trackGeo(createRoundedSlabGeometry(6.1, 3.8, 0.32, 0.12));
      const lowerBase = new THREE.Mesh(lowerBaseGeo, darkNavyChassisMat);
      lowerBase.position.y = -0.14;
      baseGroup.add(lowerBase);

      const trimSlabGeo = trackGeo(createRoundedSlabGeometry(5.92, 3.62, 0.28, 0.04));
      const trimSlab = new THREE.Mesh(trimSlabGeo, platformTrimMat);
      trimSlab.position.y = -0.04;
      baseGroup.add(trimSlab);

      const upperDeckGeo = trackGeo(createRoundedSlabGeometry(5.78, 3.48, 0.26, 0.11));
      const upperDeck = new THREE.Mesh(upperDeckGeo, frostedPlatformMat);
      upperDeck.position.y = 0.05;
      baseGroup.add(upperDeck);

      // Architectural blueprint hairline grid on upper deck (offset Y to avoid Z-fighting)
      const gridMat = trackMat(
        new THREE.LineBasicMaterial({
          color: primaryStrongColor,
          transparent: true,
          opacity: 0.18,
        }),
      );
      const gridPts: THREE.Vector3[] = [];
      for (let x = -2.5; x <= 2.51; x += 0.5) {
        gridPts.push(new THREE.Vector3(x, 0.15, -1.45), new THREE.Vector3(x, 0.15, 1.45));
      }
      for (let z = -1.4; z <= 1.41; z += 0.466) {
        gridPts.push(new THREE.Vector3(-2.55, 0.15, z), new THREE.Vector3(2.55, 0.15, z));
      }
      const gridGeo = trackGeo(new THREE.BufferGeometry().setFromPoints(gridPts));
      const gridLines = new THREE.LineSegments(gridGeo, gridMat);
      baseGroup.add(gridLines);

      // =====================================================================
      // STAGE 1 (LEFT): MULTI-SOURCE DATA INGESTION STACKS (4 Composite Nodes)
      // =====================================================================
      const ingestionGroup = new THREE.Group();
      diagramRoot.add(ingestionGroup);

      const sourcePositions: [number, number][] = [
        [-2.15, -0.82], // Marketing
        [-2.15, 0.0],   // CRM
        [-2.15, 0.82],  // Risk & Audit
        [-1.32, 0.95],  // Social / Web
      ];

      const discBaseGeo = trackGeo(new THREE.CylinderGeometry(0.29, 0.32, 0.08, 28));
      const discBodyGeo = trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 28));
      const discCollarGeo = trackGeo(new THREE.CylinderGeometry(0.21, 0.21, 0.05, 24));
      const discRingGeo = trackGeo(new THREE.TorusGeometry(0.26, 0.016, 10, 32));
      const sourceNodes: THREE.Group[] = [];
      const sourceTopPoints: THREE.Vector3[] = [];

      sourcePositions.forEach(([sx, sz], idx) => {
        const stack = new THREE.Group();
        stack.position.set(sx, -0.66, sz);

        // Metallic mounting plinth
        const plinth = new THREE.Mesh(discBaseGeo, brushedSlateMat);
        plinth.position.y = 0.04;
        stack.add(plinth);

        // 3 stacked database platter discs with glowing accent collars
        for (let tier = 0; tier < 3; tier++) {
          const y = 0.14 + tier * 0.16;
          const platter = new THREE.Mesh(
            discBodyGeo,
            tier === 2 ? (idx % 2 === 0 ? primaryGlowMat : secondaryGlowMat) : darkNavyChassisMat,
          );
          platter.position.y = y;
          stack.add(platter);

          if (tier < 2) {
            const collar = new THREE.Mesh(discCollarGeo, brushedSilverMat);
            collar.position.y = y + 0.08;
            stack.add(collar);
          }

          const haloRing = new THREE.Mesh(
            discRingGeo,
            idx % 2 === 0 ? secondaryGlowMat : accentGlowMat,
          );
          haloRing.rotation.x = Math.PI / 2;
          haloRing.position.y = y + 0.052;
          stack.add(haloRing);
        }

        ingestionGroup.add(stack);
        sourceNodes.push(stack);
        sourceTopPoints.push(new THREE.Vector3(sx, -0.14, sz));
      });

      // =====================================================================
      // STAGE 2 (CENTER): ANALYTICS & PREDICTIVE PROCESSING ENGINE
      // =====================================================================
      const engineGroup = new THREE.Group();
      engineGroup.position.set(-0.08, -0.66, -0.04);
      diagramRoot.add(engineGroup);

      // Composite Machined Pedestal (3 tiers)
      const pedFootGeo = trackGeo(new THREE.CylinderGeometry(0.76, 0.88, 0.14, 36));
      const pedFoot = new THREE.Mesh(pedFootGeo, darkNavyChassisMat);
      pedFoot.position.y = 0.07;
      engineGroup.add(pedFoot);

      const pedRimGeo = trackGeo(new THREE.TorusGeometry(0.79, 0.024, 12, 48));
      const pedRim = new THREE.Mesh(pedRimGeo, primaryGlowMat);
      pedRim.rotation.x = Math.PI / 2;
      pedRim.position.y = 0.15;
      engineGroup.add(pedRim);

      const pedColGeo = trackGeo(new THREE.CylinderGeometry(0.46, 0.62, 0.24, 36));
      const pedCol = new THREE.Mesh(pedColGeo, brushedSlateMat);
      pedCol.position.y = 0.25;
      engineGroup.add(pedCol);

      const pedCapRingGeo = trackGeo(new THREE.TorusGeometry(0.48, 0.022, 12, 42));
      const pedCapRing = new THREE.Mesh(pedCapRingGeo, secondaryGlowMat);
      pedCapRing.rotation.x = Math.PI / 2;
      pedCapRing.position.y = 0.38;
      engineGroup.add(pedCapRing);

      // Suspended Composite Analytics Core Assembly
      const coreAssembly = new THREE.Group();
      coreAssembly.position.set(0, 1.24, 0);
      engineGroup.add(coreAssembly);

      const innerCoreGeo = trackGeo(new THREE.OctahedronGeometry(0.46, 0));
      const innerCore = new THREE.Mesh(innerCoreGeo, primaryGlowMat);
      coreAssembly.add(innerCore);

      const coreCageGeo = trackGeo(new THREE.IcosahedronGeometry(0.64, 0));
      const coreCage = new THREE.Mesh(coreCageGeo, wireCageMat);
      coreAssembly.add(coreCage);

      const gyroRing1Geo = trackGeo(new THREE.TorusGeometry(0.84, 0.025, 14, 60));
      const gyroRing1 = new THREE.Mesh(gyroRing1Geo, secondaryGlowMat);
      gyroRing1.rotation.x = Math.PI * 0.36;
      coreAssembly.add(gyroRing1);

      const gyroRing2Geo = trackGeo(new THREE.TorusGeometry(1.02, 0.019, 14, 64));
      const gyroRing2 = new THREE.Mesh(gyroRing2Geo, brushedSilverMat);
      gyroRing2.rotation.y = Math.PI * 0.28;
      gyroRing2.rotation.x = -Math.PI * 0.24;
      coreAssembly.add(gyroRing2);

      // 4 Micro-Satellite Compute Nodes orbiting the Engine
      const satGeo = trackGeo(new THREE.OctahedronGeometry(0.08, 0));
      const satellites: THREE.Mesh[] = [];
      for (let i = 0; i < 4; i++) {
        const sat = new THREE.Mesh(satGeo, i % 2 === 0 ? accentGlowMat : secondaryGlowMat);
        coreAssembly.add(sat);
        satellites.push(sat);
      }

      const engineCenterWorld = new THREE.Vector3(-0.08, 0.58, -0.04);

      // =====================================================================
      // STAGE 3 (RIGHT): ELEVATED BI & VISUAL INTELLIGENCE STAGE
      // =====================================================================
      const insightsGroup = new THREE.Group();
      insightsGroup.position.set(1.88, -0.18, 0.02);
      diagramRoot.add(insightsGroup);

      // Support pillar connecting base slab to elevated BI stage
      const stagePillarGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.18, 0.48, 24));
      const stagePillar = new THREE.Mesh(stagePillarGeo, brushedSlateMat);
      stagePillar.position.set(0, -0.24, 0);
      insightsGroup.add(stagePillar);

      // Elevated frosted BI platform + dark tray
      const biDeckGeo = trackGeo(createRoundedSlabGeometry(1.92, 2.38, 0.2, 0.08));
      const biDeck = new THREE.Mesh(biDeckGeo, darkNavyChassisMat);
      biDeck.position.set(0, 0.04, 0);
      insightsGroup.add(biDeck);

      const biAccentBorderGeo = trackGeo(createRoundedSlabGeometry(1.98, 2.44, 0.22, 0.025));
      const biAccentBorder = new THREE.Mesh(biAccentBorderGeo, secondaryGlowMat);
      biAccentBorder.position.set(0, -0.005, 0);
      insightsGroup.add(biAccentBorder);

      // 3D Sculptural Rising Bar Chart Columns (Back half of BI deck)
      const barUnitGeo = trackGeo(new THREE.BoxGeometry(0.17, 1, 0.17));
      barUnitGeo.translate(0, 0.5, 0);

      interface InsightBar {
        mesh: THREE.Mesh;
        baseHeight: number;
        phase: number;
      }
      const insightBars: InsightBar[] = [];
      const barHeights = [0.38, 0.62, 0.52, 0.88, 0.76, 1.12];

      barHeights.forEach((h, i) => {
        const mat = trackMat(
          new THREE.MeshPhysicalMaterial({
            color: i >= 4 ? secondaryColor : i >= 2 ? primaryColor : accentColor,
            emissive: i >= 4 ? secondaryColor : primaryColor,
            emissiveIntensity: 0.28 + i * 0.05,
            roughness: 0.22,
            metalness: 0.22,
            clearcoat: 0.75,
          }),
        );
        const bar = new THREE.Mesh(barUnitGeo, mat);
        bar.position.set(-0.65 + i * 0.26, 0.11, -0.45);
        bar.scale.y = h;
        insightsGroup.add(bar);
        insightBars.push({ mesh: bar, baseHeight: h, phase: i * 0.65 });
      });

      // 3D Predictive Signal Spline floating cleanly above bars
      const signalPts = [
        new THREE.Vector3(-0.68, 0.66, -0.45),
        new THREE.Vector3(-0.4, 0.92, -0.45),
        new THREE.Vector3(-0.12, 0.82, -0.45),
        new THREE.Vector3(0.16, 1.18, -0.45),
        new THREE.Vector3(0.42, 1.08, -0.45),
        new THREE.Vector3(0.68, 1.42, -0.45),
      ];
      const signalCurve = new THREE.CatmullRomCurve3(signalPts);
      const signalTubeGeo = trackGeo(new THREE.TubeGeometry(signalCurve, 44, 0.026, 10, false));
      const signalTube = new THREE.Mesh(signalTubeGeo, accentGlowMat);
      insightsGroup.add(signalTube);

      const signalDotGeo = trackGeo(new THREE.SphereGeometry(0.055, 14, 14));
      signalPts.forEach((pt) => {
        const dot = new THREE.Mesh(signalDotGeo, brushedSilverMat);
        dot.position.copy(pt);
        insightsGroup.add(dot);
      });

      // 3D Segmented Cohort Ring (Front half of BI deck)
      const cohortGroup = new THREE.Group();
      cohortGroup.position.set(0, 0.26, 0.56);
      cohortGroup.rotation.x = 0.24;
      insightsGroup.add(cohortGroup);

      const cohortSlices = [
        { start: 0, len: Math.PI * 0.78, mat: primaryGlowMat, y: 0.03 },
        { start: Math.PI * 0.84, len: Math.PI * 0.56, mat: secondaryGlowMat, y: 0 },
        { start: Math.PI * 1.46, len: Math.PI * 0.46, mat: accentGlowMat, y: 0.015 },
      ];
      cohortSlices.forEach((s) => {
        const arcGeo = trackGeo(
          new THREE.CylinderGeometry(0.48, 0.48, 0.11, 28, 1, false, s.start, s.len),
        );
        const sliceMesh = new THREE.Mesh(arcGeo, s.mat);
        const mid = s.start + s.len / 2;
        sliceMesh.position.set(Math.sin(mid) * 0.03, s.y, Math.cos(mid) * 0.03);
        cohortGroup.add(sliceMesh);
      });

      const cohortHubGeo = trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 24));
      const cohortHub = new THREE.Mesh(cohortHubGeo, darkNavyChassisMat);
      cohortGroup.add(cohortHub);

      // =====================================================================
      // 3D GLOWING DATA PIPELINE CONDUITS + STREAMING PACKETS
      // =====================================================================
      interface StreamPacket {
        mesh: THREE.Mesh;
        curve: THREE.CatmullRomCurve3;
        speed: number;
        offset: number;
      }

      const conduitCurves: THREE.CatmullRomCurve3[] = [];

      // 4 Ingestion -> Core conduits
      sourceTopPoints.forEach((startPt, idx) => {
        const midPt = new THREE.Vector3(
          (startPt.x + engineCenterWorld.x) * 0.5,
          0.32 + (idx % 2) * 0.22,
          (startPt.z + engineCenterWorld.z) * 0.55,
        );
        const endPt = new THREE.Vector3(
          engineCenterWorld.x - 0.52,
          engineCenterWorld.y - 0.12 + (idx - 1.5) * 0.09,
          engineCenterWorld.z + (idx - 1.5) * 0.12,
        );
        conduitCurves.push(new THREE.CatmullRomCurve3([startPt, midPt, endPt]));
      });

      // 2 Core -> BI Insights output conduits
      const biTargets = [
        new THREE.Vector3(0.95, 0.02, -0.35),
        new THREE.Vector3(0.95, 0.02, 0.45),
      ];
      biTargets.forEach((endPt, idx) => {
        const startPt = new THREE.Vector3(
          engineCenterWorld.x + 0.52,
          engineCenterWorld.y + (idx === 0 ? 0.14 : -0.1),
          engineCenterWorld.z + (idx === 0 ? -0.16 : 0.16),
        );
        const midPt = new THREE.Vector3(
          (startPt.x + endPt.x) * 0.5,
          0.74 - idx * 0.26,
          (startPt.z + endPt.z) * 0.5,
        );
        conduitCurves.push(new THREE.CatmullRomCurve3([startPt, midPt, endPt]));
      });

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

      const packetGeo = trackGeo(new THREE.SphereGeometry(0.056, 12, 12));
      const streamPackets: StreamPacket[] = [];

      conduitCurves.forEach((curve, idx) => {
        const tubeGeo = trackGeo(new THREE.TubeGeometry(curve, 36, 0.017, 8, false));
        const tube = new THREE.Mesh(tubeGeo, conduitMat);
        diagramRoot.add(tube);

        // Two packets traveling continuously along each conduit
        for (let k = 0; k < 2; k++) {
          const pMesh = new THREE.Mesh(
            packetGeo,
            idx >= 4 ? accentGlowMat : k === 0 ? secondaryGlowMat : primaryGlowMat,
          );
          diagramRoot.add(pMesh);
          streamPackets.push({
            mesh: pMesh,
            curve,
            speed: 0.26 + (idx % 3) * 0.05,
            offset: (k * 0.5 + idx * 0.17) % 1,
          });
        }
      });

      // =====================================================================
      // DIEGETIC 3D ARCHITECTURAL CALLOUT PLATES (Procedural CanvasTextures)
      // =====================================================================
      const labelSpecs: {
        title: string;
        subtitle: string;
        pos: [number, number, number];
        accent: string;
      }[] = [
        {
          title: 'DATA SOURCES',
          subtitle: 'Marketing · CRM · Risk',
          pos: [-2.05, 0.56, 1.15],
          accent: themeConfig.primary,
        },
        {
          title: 'ANALYTICS CORE',
          subtitle: 'Modeling & Governance',
          pos: [-0.08, 2.02, -0.05],
          accent: themeConfig.secondary,
        },
        {
          title: 'VISUAL INSIGHTS',
          subtitle: 'Real-Time BI & Cohorts',
          pos: [1.92, 1.72, -0.35],
          accent: themeConfig.accent,
        },
      ];

      const labelSprites: THREE.Sprite[] = [];
      labelSpecs.forEach((spec) => {
        const tex = trackTex(
          createDiagramLabelTexture(spec.title, spec.subtitle, spec.accent, maxAniso),
        );
        const mat = trackMat(
          new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            depthTest: true,
            depthWrite: false,
          }),
        );
        const sprite = new THREE.Sprite(mat);
        sprite.position.set(...spec.pos);
        sprite.scale.set(1.78, 0.51, 1);
        diagramRoot.add(sprite);
        labelSprites.push(sprite);
      });

      // =====================================================================
      // INTERACTIVE POINTER DRAG + GENTLE TILT PARALLAX
      // =====================================================================
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let baseYaw = -0.22;
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

      const lookTarget = new THREE.Vector3(0, 0.35, 0);

      const updateScene = (elapsed: number, delta: number) => {
        const preset = activePresetRef.current;

        const camGoals: Record<
          DiagramLayerPreset,
          { px: number; py: number; pz: number; lx: number; ly: number; lz: number }
        > = {
          overview: { px: 0.35, py: 3.65, pz: 8.85, lx: 0.0, ly: 0.32, lz: 0.0 },
          ingestion: { px: -2.65, py: 2.85, pz: 5.7, lx: -1.75, ly: 0.05, lz: 0.25 },
          engine: { px: 0.15, py: 2.7, pz: 5.4, lx: -0.08, ly: 0.65, lz: -0.04 },
          insights: { px: 2.85, py: 2.8, pz: 5.85, lx: 1.75, ly: 0.52, lz: 0.0 },
        };

        const goal = camGoals[preset];
        camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.px, 4.2, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.py, 4.2, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.pz, 4.2, delta);
        lookTarget.x = THREE.MathUtils.damp(lookTarget.x, goal.lx, 4.2, delta);
        lookTarget.y = THREE.MathUtils.damp(lookTarget.y, goal.ly, 4.2, delta);
        lookTarget.z = THREE.MathUtils.damp(lookTarget.z, goal.lz, 4.2, delta);
        camera.lookAt(lookTarget);

        // Smooth interactive rotation & gentle architectural breathing
        currentYaw = THREE.MathUtils.damp(currentYaw, targetYaw, 5.0, delta);
        currentPitch = THREE.MathUtils.damp(currentPitch, targetPitch, 5.0, delta);
        diagramRoot.rotation.y =
          currentYaw + (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.36) * 0.045);
        diagramRoot.rotation.x = currentPitch;
        diagramRoot.position.y = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.05) * 0.06;

        // Subtle source cylinder pulse
        sourceNodes.forEach((node, idx) => {
          node.position.y =
            -0.66 + (prefersReducedMotion ? 0 : Math.sin(elapsed * 1.4 + idx * 0.9) * 0.028);
        });

        // Engine core & gyro rotations
        if (!prefersReducedMotion) {
          innerCore.rotation.y = elapsed * 0.62;
          innerCore.rotation.x = Math.sin(elapsed * 0.5) * 0.22;
          coreCage.rotation.y = -elapsed * 0.35;
          coreCage.rotation.z = elapsed * 0.2;
          gyroRing1.rotation.z = elapsed * 0.48;
          gyroRing2.rotation.z = -elapsed * 0.34;
        }

        // Orbiting compute micro-satellites
        satellites.forEach((sat, i) => {
          const angle = (i / satellites.length) * Math.PI * 2 + (prefersReducedMotion ? 0 : elapsed * 0.65);
          sat.position.set(
            Math.cos(angle) * 0.92,
            Math.sin(angle * 2) * 0.16,
            Math.sin(angle) * 0.92,
          );
        });

        // BI bars subtle dynamic modulation
        insightBars.forEach((bar) => {
          const wave = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.5 + bar.phase) * 0.14;
          bar.mesh.scale.y = Math.max(0.24, bar.baseHeight + wave);
        });

        // Cohort ring slow spin
        if (!prefersReducedMotion) {
          cohortGroup.rotation.y = elapsed * 0.34;
        }

        // Data packets flowing seamlessly along 3D conduits
        streamPackets.forEach((pkt) => {
          const t = (pkt.offset + (prefersReducedMotion ? 0.35 : elapsed * pkt.speed)) % 1;
          pkt.curve.getPointAt(t, _tmpVec);
          pkt.mesh.position.copy(_tmpVec);
        });

        // Gentle vertical hover on diegetic label sprites
        labelSprites.forEach((sp, i) => {
          sp.position.y =
            labelSpecs[i].pos[1] +
            (prefersReducedMotion ? 0 : Math.sin(elapsed * 1.1 + i * 1.2) * 0.04);
        });
      };

      // Pre-warm shaders on hardware GPU
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
  }, [themeConfig, prefersReducedMotion]);

  if (webglFailed) {
    return (
      <div className="flex h-[380px] w-full flex-col items-center justify-center rounded-[2rem] border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:h-[440px]">
        <div className="grid w-full max-w-md grid-cols-3 gap-4 text-center">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <Database
              className="mx-auto h-7 w-7"
              style={{ color: themeConfig.primaryStrong }}
              aria-hidden="true"
            />
            <p className="mt-2 font-display text-xs font-bold text-[#0A1128]">Data Sources</p>
            <p className="mt-1 text-[11px] text-[#64748B]">Marketing · CRM · Risk</p>
          </div>
          <div className="rounded-2xl bg-[#0A1128] p-4 text-white shadow-md">
            <Cpu
              className="mx-auto h-7 w-7"
              style={{ color: themeConfig.accent }}
              aria-hidden="true"
            />
            <p className="mt-2 font-display text-xs font-bold">Analytics Core</p>
            <p className="mt-1 text-[11px] text-slate-300">Predictive Engine</p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <BarChart3
              className="mx-auto h-7 w-7"
              style={{ color: themeConfig.secondaryText }}
              aria-hidden="true"
            />
            <p className="mt-2 font-display text-xs font-bold text-[#0A1128]">BI &amp; Insights</p>
            <p className="mt-1 text-[11px] text-[#64748B]">Executive Clarity</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col items-center select-none">
      {/* Unobstructed 3D Architectural Diagram Stage */}
      <div className="relative h-[360px] w-full sm:h-[420px] lg:h-[460px]">
        <div
          ref={containerRef}
          role="img"
          aria-label="Interactive 3D Data Analytics architecture diagram showing multi-source data ingestion stacks streaming into a central predictive analytics core and elevated visual intelligence charts"
          className="h-full w-full cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Unified Compact Bottom Layer Dock (Zero Canvas Occlusion, No backdrop-filter over WebGL) */}
      <div
        role="tablist"
        aria-label="Inspect 3D data analytics architecture stage"
        className="mt-2 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-[#E2E8F0] bg-white p-1 shadow-[0_10px_28px_-14px_rgba(15,23,42,0.14)]"
      >
        <span className="hidden items-center gap-1.5 pl-3 pr-1.5 text-[11px] font-semibold text-[#64748B] sm:inline-flex">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          <span>View</span>
        </span>
        {LAYER_PRESETS.map((preset) => {
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
