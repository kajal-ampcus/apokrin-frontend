import { useEffect, useRef, useState } from 'react';
import { BarChart3, Layers, PieChart, Sparkles, TrendingUp } from 'lucide-react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useTheme } from '../theme/themeConfig';

export type AnalyticsFocusMode = 'overview' | 'charts' | 'core';

interface AnalyticsShowcase3DProps {
  focusMode: AnalyticsFocusMode;
  prefersReducedMotion: boolean;
}

interface Disposables {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
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

function createRoundedPlateGeometry(
  width: number,
  depth: number,
  radius: number,
  thickness: number,
): THREE.ExtrudeGeometry {
  const w = width / 2 - radius;
  const d = depth / 2 - radius;
  const shape = new THREE.Shape();
  shape.moveTo(-w, -depth / 2);
  shape.lineTo(w, -depth / 2);
  shape.quadraticCurveTo(width / 2, -depth / 2, width / 2, -d);
  shape.lineTo(width / 2, d);
  shape.quadraticCurveTo(width / 2, depth / 2, w, depth / 2);
  shape.lineTo(-w, depth / 2);
  shape.quadraticCurveTo(-width / 2, depth / 2, -width / 2, d);
  shape.lineTo(-width / 2, -d);
  shape.quadraticCurveTo(-width / 2, -depth / 2, -w, -depth / 2);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  });
  geo.rotateX(-Math.PI / 2);
  geo.center();
  return geo;
}

export function AnalyticsShowcase3D({
  focusMode,
  prefersReducedMotion,
}: AnalyticsShowcase3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const focusModeRef = useRef<AnalyticsFocusMode>(focusMode);
  const { themeConfig } = useTheme();
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    focusModeRef.current = focusMode;
  }, [focusMode]);

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
      renderer.toneMappingExposure = 1.12;
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
      );
      renderer.shadowMap.enabled = false;
      renderer.setClearColor(0x000000, 0);

      const width = Math.max(container.clientWidth, 320);
      const height = Math.max(container.clientHeight, 320);
      renderer.setSize(width, height);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      const disposables: Disposables = { geometries: [], materials: [] };
      const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
        disposables.geometries.push(g);
        return g;
      };
      const trackMat = <T extends THREE.Material>(m: T): T => {
        disposables.materials.push(m);
        return m;
      };

      const scene = new THREE.Scene();

      // Studio environment reflections for crisp glassmorphic surfaces
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      pmremGenerator.dispose();

      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
      camera.position.set(0.2, 3.6, 8.6);
      camera.lookAt(0, 0.45, 0);

      // Lighting rig tuned for light Apokrin slate/glass aesthetic + blue/purple/cyan highlights
      scene.add(new THREE.AmbientLight(0xeef6ff, 0.95));

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
      keyLight.position.set(4.5, 7.5, 6);
      scene.add(keyLight);

      const blueRimLight = new THREE.PointLight(0x2563eb, 3.2, 16);
      blueRimLight.position.set(-4.2, 2.8, 3.2);
      scene.add(blueRimLight);

      const purpleRimLight = new THREE.PointLight(0x7c3aed, 2.8, 16);
      purpleRimLight.position.set(4.0, 2.5, -2.5);
      scene.add(purpleRimLight);

      const cyanFillLight = new THREE.PointLight(0x06b6d4, 2.4, 14);
      cyanFillLight.position.set(0.5, 4.2, 3.8);
      scene.add(cyanFillLight);

      // Theme-aware primary & accent color harmonizing with Blue/Purple/Cyan holographic palette
      const primaryColor = new THREE.Color(themeConfig.primary);
      const secondaryColor = new THREE.Color(themeConfig.secondary);
      const purpleAccent = new THREE.Color(0x7c3aed);
      const cyanAccent = new THREE.Color(0x06b6d4);

      // Materials
      const glassDeckMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xf8fbff,
          roughness: 0.12,
          metalness: 0.05,
          transparent: true,
          opacity: isSoftwareGl ? 0.78 : 0.68,
          clearcoat: 0.9,
          clearcoatRoughness: 0.1,
          ior: 1.48,
        }),
      );

      const glassTrimMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xdbeafe,
          emissive: primaryColor,
          emissiveIntensity: 0.14,
          roughness: 0.25,
          metalness: 0.35,
          transparent: true,
          opacity: 0.85,
        }),
      );

      const darkSlatePanelMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0x0f172a,
          roughness: 0.35,
          metalness: 0.25,
          clearcoat: 0.5,
        }),
      );

      const holographicCoreMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          emissive: primaryColor,
          emissiveIntensity: 0.62,
          roughness: 0.18,
          metalness: 0.3,
          transparent: true,
          opacity: 0.84,
        }),
      );

      const holographicWireMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: 0xa855f7,
          wireframe: true,
          transparent: true,
          opacity: 0.52,
        }),
      );

      const ringBlueMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: primaryColor,
          emissive: primaryColor,
          emissiveIntensity: 0.55,
          roughness: 0.22,
          metalness: 0.45,
        }),
      );

      const ringCyanMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: cyanAccent,
          emissive: cyanAccent,
          emissiveIntensity: 0.65,
          roughness: 0.22,
          metalness: 0.45,
        }),
      );

      const ringPurpleMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: purpleAccent,
          emissive: purpleAccent,
          emissiveIntensity: 0.55,
          roughness: 0.22,
          metalness: 0.45,
        }),
      );

      // Root floating dashboard group
      const dashboardRoot = new THREE.Group();
      scene.add(dashboardRoot);

      // 1. Central Glassmorphic Base Slab + Glow Frame + Subtle Grid Lines
      const baseDeckGeo = trackGeo(createRoundedPlateGeometry(5.6, 3.4, 0.28, 0.14));
      const baseDeck = new THREE.Mesh(baseDeckGeo, glassDeckMat);
      baseDeck.position.set(0, -0.35, 0);
      dashboardRoot.add(baseDeck);

      const trimGeo = trackGeo(createRoundedPlateGeometry(5.76, 3.56, 0.32, 0.04));
      const trimDeck = new THREE.Mesh(trimGeo, glassTrimMat);
      trimDeck.position.set(0, -0.44, 0);
      dashboardRoot.add(trimDeck);

      // Subtle holographic grid overlay lines on glass plate
      const gridMat = trackMat(
        new THREE.LineBasicMaterial({
          color: 0x93c5fd,
          transparent: true,
          opacity: 0.42,
        }),
      );
      const gridPoints: THREE.Vector3[] = [];
      for (let gx = -2.4; gx <= 2.41; gx += 0.6) {
        gridPoints.push(new THREE.Vector3(gx, -0.22, -1.45));
        gridPoints.push(new THREE.Vector3(gx, -0.22, 1.45));
      }
      for (let gz = -1.2; gz <= 1.21; gz += 0.6) {
        gridPoints.push(new THREE.Vector3(-2.5, -0.22, gz));
        gridPoints.push(new THREE.Vector3(2.5, -0.22, gz));
      }
      const gridGeo = trackGeo(new THREE.BufferGeometry().setFromPoints(gridPoints));
      const gridLines = new THREE.LineSegments(gridGeo, gridMat);
      dashboardRoot.add(gridLines);

      // 2. Animated 3D Bar Charts (Left Tier)
      const barsGroup = new THREE.Group();
      barsGroup.position.set(-1.55, -0.22, 0.35);
      dashboardRoot.add(barsGroup);

      // Dark glass sub-tray for 3D bar chart
      const barTrayGeo = trackGeo(createRoundedPlateGeometry(2.1, 1.35, 0.14, 0.06));
      const barTray = new THREE.Mesh(barTrayGeo, darkSlatePanelMat);
      barTray.position.set(0, 0.02, 0);
      barsGroup.add(barTray);

      interface AnimatedBar {
        mesh: THREE.Mesh;
        baseHeight: number;
        phase: number;
        speed: number;
      }
      const animatedBars: AnimatedBar[] = [];
      const barColors = [
        0x2563eb,
        0x3b82f6,
        0x6366f1,
        0x7c3aed,
        0x0ea5e9,
        0x06b6d4,
        0x38bdf8,
      ];
      const barUnitGeo = trackGeo(new THREE.BoxGeometry(0.18, 1, 0.18));
      // Pivot at bottom center so scale.y grows upward flush from tray
      barUnitGeo.translate(0, 0.5, 0);

      for (let i = 0; i < 7; i++) {
        const bMat = trackMat(
          new THREE.MeshPhysicalMaterial({
            color: barColors[i % barColors.length],
            emissive: barColors[i % barColors.length],
            emissiveIntensity: 0.34,
            roughness: 0.2,
            metalness: 0.18,
            clearcoat: 0.7,
          }),
        );
        const barMesh = new THREE.Mesh(barUnitGeo, bMat);
        const xOffset = -0.82 + i * 0.27;
        const baseHeight = 0.45 + ((i * 0.19) % 0.85);
        barMesh.position.set(xOffset, 0.07, 0);
        barMesh.scale.y = baseHeight;
        barsGroup.add(barMesh);
        animatedBars.push({
          mesh: barMesh,
          baseHeight,
          phase: i * 0.75,
          speed: 1.2 + (i % 3) * 0.3,
        });
      }

      // 3. Floating 3D Pie Chart (Front-Right Tier)
      const pieGroup = new THREE.Group();
      pieGroup.position.set(1.65, 0.28, 0.55);
      pieGroup.rotation.x = 0.42;
      dashboardRoot.add(pieGroup);

      const pieSlices = [
        { start: 0, angle: Math.PI * 0.68, color: 0x2563eb, lift: 0.05 },
        { start: Math.PI * 0.72, angle: Math.PI * 0.52, color: 0x7c3aed, lift: 0.0 },
        { start: Math.PI * 1.28, angle: Math.PI * 0.42, color: 0x06b6d4, lift: 0.03 },
        { start: Math.PI * 1.74, angle: Math.PI * 0.22, color: 0x38bdf8, lift: 0.0 },
      ];

      pieSlices.forEach((slice) => {
        const sliceGeo = trackGeo(
          new THREE.CylinderGeometry(0.68, 0.68, 0.18, 28, 1, false, slice.start, slice.angle),
        );
        const sliceMat = trackMat(
          new THREE.MeshPhysicalMaterial({
            color: slice.color,
            emissive: slice.color,
            emissiveIntensity: 0.28,
            roughness: 0.24,
            metalness: 0.22,
            clearcoat: 0.65,
          }),
        );
        const mesh = new THREE.Mesh(sliceGeo, sliceMat);
        const midAngle = slice.start + slice.angle / 2;
        mesh.position.set(Math.sin(midAngle) * 0.04, slice.lift, Math.cos(midAngle) * 0.04);
        pieGroup.add(mesh);
      });

      // Center cap ring for floating pie
      const pieRingGeo = trackGeo(new THREE.TorusGeometry(0.24, 0.03, 12, 32));
      const pieRing = new THREE.Mesh(pieRingGeo, ringCyanMat);
      pieRing.rotation.x = Math.PI / 2;
      pieRing.position.y = 0.11;
      pieGroup.add(pieRing);

      // 4. Floating 3D Line Graph + Glowing Data Points & Vertical Drop Lines (Back Tier)
      const lineGraphGroup = new THREE.Group();
      lineGraphGroup.position.set(0, 0.15, -0.82);
      dashboardRoot.add(lineGraphGroup);

      // Translucent floating glass chart backdrop
      const backGlassGeo = trackGeo(createRoundedPlateGeometry(4.4, 0.08, 0.04, 1.35));
      // Rotate so it stands upright as a slim floating backdrop screen
      backGlassGeo.rotateX(Math.PI / 2);
      const backGlass = new THREE.Mesh(backGlassGeo, glassDeckMat);
      backGlass.position.set(0, 0.72, -0.14);
      lineGraphGroup.add(backGlass);

      const curveVectors = [
        new THREE.Vector3(-1.9, 0.24, 0.02),
        new THREE.Vector3(-1.15, 0.56, 0.06),
        new THREE.Vector3(-0.38, 0.42, 0.03),
        new THREE.Vector3(0.42, 0.94, 0.08),
        new THREE.Vector3(1.18, 0.78, 0.04),
        new THREE.Vector3(1.92, 1.18, 0.06),
      ];
      const lineCurve = new THREE.CatmullRomCurve3(curveVectors);
      const lineTubeGeo = trackGeo(new THREE.TubeGeometry(lineCurve, 56, 0.032, 10, false));
      const lineTubeMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x06b6d4,
          emissiveIntensity: 0.78,
          roughness: 0.18,
          metalness: 0.3,
        }),
      );
      const lineTube = new THREE.Mesh(lineTubeGeo, lineTubeMat);
      lineGraphGroup.add(lineTube);

      // Glowing data nodes + drop connector lines
      const nodeGeo = trackGeo(new THREE.SphereGeometry(0.078, 16, 16));
      const nodeHaloGeo = trackGeo(new THREE.SphereGeometry(0.13, 14, 14));
      const nodeHaloMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.26,
        }),
      );
      const dropLineMat = trackMat(
        new THREE.LineBasicMaterial({
          color: 0x60a5fa,
          transparent: true,
          opacity: 0.55,
        }),
      );

      const glowingNodes: THREE.Mesh[] = [];
      curveVectors.forEach((pt, idx) => {
        const nMat = trackMat(
          new THREE.MeshStandardMaterial({
            color: idx % 2 === 0 ? 0xffffff : 0x38bdf8,
            emissive: idx % 2 === 0 ? primaryColor : cyanAccent,
            emissiveIntensity: 0.95,
            roughness: 0.1,
          }),
        );
        const node = new THREE.Mesh(nodeGeo, nMat);
        node.position.copy(pt);
        lineGraphGroup.add(node);
        glowingNodes.push(node);

        const halo = new THREE.Mesh(nodeHaloGeo, nodeHaloMat);
        halo.position.copy(pt);
        lineGraphGroup.add(halo);

        const dropGeo = trackGeo(
          new THREE.BufferGeometry().setFromPoints([pt, new THREE.Vector3(pt.x, -0.32, pt.z)]),
        );
        const dropLine = new THREE.Line(dropGeo, dropLineMat);
        lineGraphGroup.add(dropLine);
      });

      // 5. Central Holographic Analytics Core (Slow Rotating Multi-Ring & Prism Core)
      const holoGroup = new THREE.Group();
      holoGroup.position.set(0.05, 0.85, 0.35);
      dashboardRoot.add(holoGroup);

      const coreOctaGeo = trackGeo(new THREE.OctahedronGeometry(0.42, 0));
      const coreMesh = new THREE.Mesh(coreOctaGeo, holographicCoreMat);
      holoGroup.add(coreMesh);

      const outerWireGeo = trackGeo(new THREE.IcosahedronGeometry(0.58, 0));
      const outerWireMesh = new THREE.Mesh(outerWireGeo, holographicWireMat);
      holoGroup.add(outerWireMesh);

      const holoRing1Geo = trackGeo(new THREE.TorusGeometry(0.76, 0.022, 12, 56));
      const holoRing1 = new THREE.Mesh(holoRing1Geo, ringCyanMat);
      holoRing1.rotation.x = Math.PI * 0.38;
      holoGroup.add(holoRing1);

      const holoRing2Geo = trackGeo(new THREE.TorusGeometry(0.92, 0.018, 12, 64));
      const holoRing2 = new THREE.Mesh(holoRing2Geo, ringPurpleMat);
      holoRing2.rotation.y = Math.PI * 0.3;
      holoRing2.rotation.x = -Math.PI * 0.25;
      holoGroup.add(holoRing2);

      // Pedestal ring directly beneath holographic core
      const pedestalGeo = trackGeo(new THREE.TorusGeometry(0.58, 0.024, 12, 48));
      const pedestalRing = new THREE.Mesh(pedestalGeo, ringBlueMat);
      pedestalRing.rotation.x = Math.PI / 2;
      pedestalRing.position.set(0.05, -0.2, 0.35);
      dashboardRoot.add(pedestalRing);

      // 6. Subtle Orbiting Data Particles & Connecting Orbital Arcs
      const orbitGroup = new THREE.Group();
      orbitGroup.position.set(0, 0.45, 0);
      dashboardRoot.add(orbitGroup);

      interface OrbitParticle {
        mesh: THREE.Mesh;
        radiusX: number;
        radiusZ: number;
        yBase: number;
        speed: number;
        phase: number;
      }
      const orbitParticles: OrbitParticle[] = [];
      const particleGeo = trackGeo(new THREE.SphereGeometry(0.048, 10, 10));
      const particleColors = [0x2563eb, 0x06b6d4, 0x7c3aed, 0x38bdf8];

      for (let p = 0; p < 22; p++) {
        const pColor = particleColors[p % particleColors.length];
        const pMat = trackMat(
          new THREE.MeshBasicMaterial({
            color: pColor,
            transparent: true,
            opacity: 0.85,
          }),
        );
        const pMesh = new THREE.Mesh(particleGeo, pMat);
        const scale = 0.65 + (p % 4) * 0.22;
        pMesh.scale.setScalar(scale);
        orbitGroup.add(pMesh);

        orbitParticles.push({
          mesh: pMesh,
          radiusX: 2.75 + (p % 5) * 0.34,
          radiusZ: 1.85 + (p % 4) * 0.32,
          yBase: -0.4 + ((p % 7) - 3) * 0.24,
          speed: 0.22 + (p % 4) * 0.08,
          phase: (p / 22) * Math.PI * 2,
        });
      }

      // Pointer parallax state (subtle interactive tilt without heavy motion)
      let targetRotY = -0.14;
      let targetRotX = 0.05;
      let currentRotY = targetRotY;
      let currentRotX = targetRotX;

      const onPointerMove = (e: PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetRotY = -0.14 + nx * 0.22;
        targetRotX = 0.05 + ny * 0.1;
      };

      const onPointerLeave = () => {
        targetRotY = -0.14;
        targetRotX = 0.05;
      };

      container.addEventListener('pointermove', onPointerMove, { passive: true });
      container.addEventListener('pointerleave', onPointerLeave, { passive: true });

      // Resize observer for crisp responsiveness across desktop, tablet & mobile
      const updateSize = () => {
        const w = Math.max(container.clientWidth, 280);
        const h = Math.max(container.clientHeight, 260);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(container);

      const updateSceneAtTime = (elapsed: number, delta: number) => {
        // Camera focus preset interpolation
        const mode = focusModeRef.current;
        const camGoal =
          mode === 'charts'
            ? { x: -0.75, y: 3.15, z: 7.45 }
            : mode === 'core'
              ? { x: 0.35, y: 2.65, z: 6.5 }
              : { x: 0.15, y: 3.55, z: 8.5 };

        camera.position.x += (camGoal.x - camera.position.x) * Math.min(1, delta * 3.5);
        camera.position.y += (camGoal.y - camera.position.y) * Math.min(1, delta * 3.5);
        camera.position.z += (camGoal.z - camera.position.z) * Math.min(1, delta * 3.5);
        camera.lookAt(0, 0.38, 0);

        // Gentle vertical float for entire glassmorphic dashboard
        dashboardRoot.position.y = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.15) * 0.13;

        // Smooth pointer parallax
        currentRotY += (targetRotY - currentRotY) * Math.min(1, delta * 4);
        currentRotX += (targetRotX - currentRotX) * Math.min(1, delta * 4);
        dashboardRoot.rotation.y = currentRotY + (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.4) * 0.05);
        dashboardRoot.rotation.x = currentRotX;

        // Animated 3D bars rising and shifting gently
        animatedBars.forEach((bar) => {
          const offset = prefersReducedMotion
            ? 0
            : Math.sin(elapsed * bar.speed + bar.phase) * 0.24;
          bar.mesh.scale.y = Math.max(0.22, bar.baseHeight + offset);
        });

        // Floating pie slow spin & subtle bob
        if (!prefersReducedMotion) {
          pieGroup.rotation.y = elapsed * 0.32;
          pieGroup.position.y = 0.28 + Math.sin(elapsed * 1.4 + 0.8) * 0.06;
        }

        // Glowing line graph node pulse
        glowingNodes.forEach((node, idx) => {
          const pulse = prefersReducedMotion
            ? 1
            : 1 + Math.sin(elapsed * 2.2 + idx * 0.85) * 0.16;
          node.scale.setScalar(pulse);
        });

        // Slow holographic core & orbital ring rotation
        if (!prefersReducedMotion) {
          coreMesh.rotation.y = elapsed * 0.55;
          coreMesh.rotation.z = Math.sin(elapsed * 0.6) * 0.18;
          outerWireMesh.rotation.y = -elapsed * 0.35;
          outerWireMesh.rotation.x = elapsed * 0.22;
          holoRing1.rotation.z = elapsed * 0.45;
          holoRing2.rotation.z = -elapsed * 0.38;
        }

        // Orbiting data particles
        orbitParticles.forEach((p) => {
          const angle = p.phase + (prefersReducedMotion ? 0 : elapsed * p.speed);
          p.mesh.position.set(
            Math.cos(angle) * p.radiusX,
            p.yBase + (prefersReducedMotion ? 0 : Math.sin(elapsed * 1.1 + p.phase) * 0.12),
            Math.sin(angle) * p.radiusZ,
          );
        });
      };

      // Software WebGL GPU-command pacing helper per Three.js skill guidelines
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
        updateSceneAtTime(0, 1);
        renderer.render(scene, camera);
      } else {
        const tick = () => {
          if (disposed) return;
          const delta = Math.min(clock.getDelta(), 0.08);
          const elapsed = clock.getElapsedTime();
          updateSceneAtTime(elapsed, delta);
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
        cancelAnimationFrame(frameId);
        window.clearTimeout(frameId);
        resizeObserver.disconnect();
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
        envTex.dispose();
        disposables.geometries.forEach((g) => g.dispose());
        disposables.materials.forEach((m) => m.dispose());
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
    /* Crisp CSS 3D Glassmorphic Fallback when WebGL is unavailable */
    return (
      <div className="relative flex h-full w-full items-center justify-center p-6">
        <div
          className="relative flex w-full max-w-lg flex-col gap-4 rounded-[2rem] border border-white/90 bg-white/80 p-6 shadow-2xl backdrop-blur-xl"
          style={{
            transform: 'perspective(1000px) rotateX(8deg) rotateY(-8deg)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold text-[#0A1128]">
              Analytics Engine Preview
            </span>
            <Sparkles className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex h-28 items-end gap-1.5 rounded-2xl bg-[#0F172A] p-3">
              {[48, 72, 62, 88, 94].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md"
                  style={{ height: `${h}%`, background: 'var(--color-btn-gradient)' }}
                />
              ))}
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-3">
              <PieChart className="h-9 w-9 text-[#7C3AED]" />
              <span className="mt-2 text-[11px] font-semibold text-[#475569]">
                Segment Mix
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-3">
              <TrendingUp className="h-9 w-9 text-[#06B6D4]" />
              <span className="mt-2 text-[11px] font-semibold text-[#475569]">
                Live Trends
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full select-none">
      {/* Three.js WebGL 3D Glassmorphic Canvas */}
      <div
        ref={containerRef}
        aria-label="Interactive 3D floating glassmorphic analytics dashboard featuring animated 3D bar charts, floating pie chart, glowing trend curve, rotating holographic core, and orbiting data particles"
        className="h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating Glassmorphic KPI Cards Framing the 3D Stage */}
      <div
        aria-hidden="true"
        className="apokrin-clay-bob-0 pointer-events-none absolute left-3 top-3 hidden items-center gap-2.5 rounded-2xl border border-white/90 bg-white/80 px-3.5 py-2.5 shadow-[0_14px_30px_-10px_rgba(37,99,235,0.18)] backdrop-blur-md sm:flex md:left-6 md:top-6"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
        >
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display text-xs font-bold text-[#0A1128]">Live Signal Streams</p>
          <p className="text-[11px] text-[#64748B]">Real-Time Multi-Source Ingestion</p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="apokrin-clay-bob-1 pointer-events-none absolute right-3 top-3 hidden items-center gap-2.5 rounded-2xl border border-white/90 bg-white/80 px-3.5 py-2.5 shadow-[0_14px_30px_-10px_rgba(124,58,237,0.18)] backdrop-blur-md sm:flex md:right-6 md:top-6"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
        >
          <PieChart className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display text-xs font-bold text-[#0A1128]">Predictive Modeling</p>
          <p className="text-[11px] text-[#64748B]">AI Pattern &amp; Trend Intelligence</p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="apokrin-clay-bob-2 pointer-events-none absolute bottom-3 left-3 hidden items-center gap-2.5 rounded-2xl border border-white/90 bg-white/80 px-3.5 py-2.5 shadow-[0_14px_30px_-10px_rgba(6,182,212,0.18)] backdrop-blur-md sm:flex md:bottom-6 md:left-6"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            color: 'var(--color-primary-strong)',
          }}
        >
          <Layers className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display text-xs font-bold text-[#0A1128]">Executive Clarity</p>
          <p className="text-[11px] text-[#64748B]">Interactive Decision Dashboards</p>
        </div>
      </div>
    </div>
  );
}
