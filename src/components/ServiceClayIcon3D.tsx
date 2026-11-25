import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useTheme } from '../theme/themeConfig';

export type ServiceId = 'staffing' | 'mobility' | 'hrms';

interface ServiceClayIcon3DProps {
  activeService: ServiceId;
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

interface Disposables {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
}

function buildClayMaterials(disposables: Disposables) {
  const mats = {
    white: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.34,
      metalness: 0.04,
      clearcoat: 0.48,
      clearcoatRoughness: 0.28,
    }),
    softBlue: new THREE.MeshPhysicalMaterial({
      color: 0xeaf1fa,
      roughness: 0.4,
      metalness: 0.05,
      clearcoat: 0.38,
      clearcoatRoughness: 0.32,
    }),
    skyBlue: new THREE.MeshPhysicalMaterial({
      color: 0xb9dcff,
      roughness: 0.35,
      metalness: 0.06,
      clearcoat: 0.45,
      clearcoatRoughness: 0.28,
    }),
    lavender: new THREE.MeshPhysicalMaterial({
      color: 0xe9e7ff,
      roughness: 0.38,
      metalness: 0.05,
      clearcoat: 0.42,
      clearcoatRoughness: 0.3,
    }),
    primaryBlue: new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.08,
      roughness: 0.28,
      metalness: 0.1,
      clearcoat: 0.58,
      clearcoatRoughness: 0.2,
    }),
    cyan: new THREE.MeshPhysicalMaterial({
      color: 0x22b8cf,
      emissive: 0x0891b2,
      emissiveIntensity: 0.12,
      roughness: 0.26,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    }),
    darkScreen: new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.14,
      metalness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    }),
  };

  Object.values(mats).forEach((m) => disposables.materials.push(m));
  return mats;
}

type Mats = ReturnType<typeof buildClayMaterials>;

// 1. Staffing: 3D Connected Human / Team Symbol
function buildStaffingGroup(mats: Mats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();

  // Cushioned orbital base ring connecting the team
  const ringGeo = new THREE.TorusGeometry(1.12, 0.065, 16, 48);
  ringGeo.rotateX(Math.PI / 2);
  disposables.geometries.push(ringGeo);
  const ring = new THREE.Mesh(ringGeo, mats.skyBlue);
  ring.position.y = -0.62;
  ring.castShadow = true;
  group.add(ring);

  const buildPerson = (
    x: number,
    y: number,
    z: number,
    scale: number,
    torsoMat: THREE.Material,
    headMat: THREE.Material,
  ) => {
    const pGroup = new THREE.Group();
    const headGeo = new THREE.SphereGeometry(0.28 * scale, 28, 22);
    const bodyGeo = new THREE.CapsuleGeometry(0.28 * scale, 0.36 * scale, 12, 24);
    disposables.geometries.push(headGeo, bodyGeo);

    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.44 * scale;
    head.castShadow = true;
    pGroup.add(head);

    const body = new THREE.Mesh(bodyGeo, torsoMat);
    body.position.y = -0.14 * scale;
    body.castShadow = true;
    pGroup.add(body);

    pGroup.position.set(x, y, z);
    return pGroup;
  };

  // Central Lead + Two Flanking Team Members
  group.add(buildPerson(0, 0.16, 0.18, 1.15, mats.primaryBlue, mats.white));
  group.add(buildPerson(-0.88, -0.06, -0.22, 0.88, mats.cyan, mats.softBlue));
  group.add(buildPerson(0.88, -0.06, -0.22, 0.88, mats.lavender, mats.white));

  // Floating connection nodes between team members
  const nodeGeo = new THREE.SphereGeometry(0.11, 20, 20);
  disposables.geometries.push(nodeGeo);
  [
    [-0.46, 0.56, 0.04, mats.cyan],
    [0.46, 0.56, 0.04, mats.primaryBlue],
  ].forEach(([x, y, z, mat]) => {
    const n = new THREE.Mesh(nodeGeo, mat as THREE.Material);
    n.position.set(x as number, y as number, z as number);
    n.castShadow = true;
    group.add(n);
  });

  // Curved connection arc linking the team overhead
  const arcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.88, 0.42, -0.18),
    new THREE.Vector3(0, 0.92, 0.15),
    new THREE.Vector3(0.88, 0.42, -0.18),
  ]);
  const arcGeo = new THREE.TubeGeometry(arcCurve, 32, 0.04, 12, false);
  disposables.geometries.push(arcGeo);
  const arc = new THREE.Mesh(arcGeo, mats.skyBlue);
  group.add(arc);

  return group;
}

// 2. Mobility: 3D Smartphone with Connected Digital Devices
function buildMobilityGroup(mats: Mats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();

  // Rounded Clay Smartphone Chassis
  const phoneShape = new THREE.Shape();
  phoneShape.moveTo(-0.56, -0.98);
  phoneShape.quadraticCurveTo(0, -1.04, 0.56, -0.98);
  phoneShape.quadraticCurveTo(0.64, 0, 0.56, 0.98);
  phoneShape.quadraticCurveTo(0, 1.04, -0.56, 0.98);
  phoneShape.quadraticCurveTo(-0.64, 0, -0.56, -0.98);

  const phoneGeo = new THREE.ExtrudeGeometry(phoneShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 5,
    curveSegments: 18,
  });
  phoneGeo.translate(0, 0, -0.07);
  disposables.geometries.push(phoneGeo);

  const phoneBody = new THREE.Mesh(phoneGeo, mats.white);
  phoneBody.castShadow = true;
  group.add(phoneBody);

  // Dark Glass Display Screen
  const screenShape = new THREE.Shape();
  screenShape.moveTo(-0.46, -0.84);
  screenShape.quadraticCurveTo(0, -0.88, 0.46, -0.84);
  screenShape.quadraticCurveTo(0.5, 0, 0.46, 0.84);
  screenShape.quadraticCurveTo(0, 0.88, -0.46, 0.84);
  screenShape.quadraticCurveTo(-0.5, 0, -0.46, -0.84);

  const screenGeo = new THREE.ExtrudeGeometry(screenShape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 14,
  });
  screenGeo.translate(0, 0, 0.095);
  disposables.geometries.push(screenGeo);

  const screen = new THREE.Mesh(screenGeo, mats.darkScreen);
  group.add(screen);

  // Raised UI App Tiles on Screen
  const tileGeo = new THREE.BoxGeometry(0.32, 0.24, 0.04);
  const pillGeo = new THREE.CapsuleGeometry(0.06, 0.46, 8, 14);
  pillGeo.rotateZ(Math.PI / 2);
  disposables.geometries.push(tileGeo, pillGeo);

  const tile1 = new THREE.Mesh(tileGeo, mats.primaryBlue);
  tile1.position.set(-0.18, 0.34, 0.15);
  group.add(tile1);

  const tile2 = new THREE.Mesh(tileGeo, mats.cyan);
  tile2.position.set(0.2, 0.34, 0.15);
  group.add(tile2);

  const bar1 = new THREE.Mesh(pillGeo, mats.skyBlue);
  bar1.position.set(0, -0.04, 0.15);
  group.add(bar1);

  const bar2 = new THREE.Mesh(pillGeo, mats.lavender);
  bar2.position.set(0, -0.32, 0.15);
  group.add(bar2);

  // Connected Satellite Smartwatch / IoT Node (Top Right)
  const watchGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.12, 24);
  watchGeo.rotateX(Math.PI / 2);
  const watchFaceGeo = new THREE.SphereGeometry(0.14, 20, 20);
  disposables.geometries.push(watchGeo, watchFaceGeo);

  const watchGroup = new THREE.Group();
  const watchBody = new THREE.Mesh(watchGeo, mats.lavender);
  const watchFace = new THREE.Mesh(watchFaceGeo, mats.cyan);
  watchFace.position.z = 0.05;
  watchGroup.add(watchBody, watchFace);
  watchGroup.position.set(0.95, 0.54, 0.24);
  watchGroup.rotation.y = -0.35;
  group.add(watchGroup);

  // Connected Tablet / Edge Node (Bottom Left)
  const edgeGeo = new THREE.BoxGeometry(0.56, 0.4, 0.1);
  disposables.geometries.push(edgeGeo);
  const edgeNode = new THREE.Mesh(edgeGeo, mats.skyBlue);
  edgeNode.position.set(-0.92, -0.45, 0.26);
  edgeNode.rotation.y = 0.4;
  edgeNode.castShadow = true;
  group.add(edgeNode);

  // Wireless Signal Arc connecting Devices
  const sigCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.78, -0.22, 0.22),
    new THREE.Vector3(0, 0.25, 0.48),
    new THREE.Vector3(0.84, 0.36, 0.22),
  ]);
  const sigGeo = new THREE.TubeGeometry(sigCurve, 32, 0.032, 10, false);
  disposables.geometries.push(sigGeo);
  const sig = new THREE.Mesh(sigGeo, mats.cyan);
  group.add(sig);

  return group;
}

// 3. HRMS: 3D Briefcase with Human Resources & Network Elements
function buildHrmsGroup(mats: Mats, disposables: Disposables): THREE.Group {
  const group = new THREE.Group();

  // Rounded Clay Briefcase Body
  const caseShape = new THREE.Shape();
  caseShape.moveTo(-0.82, -0.54);
  caseShape.quadraticCurveTo(0, -0.6, 0.82, -0.54);
  caseShape.quadraticCurveTo(0.9, 0, 0.82, 0.52);
  caseShape.quadraticCurveTo(0, 0.58, -0.82, 0.52);
  caseShape.quadraticCurveTo(-0.9, 0, -0.82, -0.54);

  const caseGeo = new THREE.ExtrudeGeometry(caseShape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 5,
    curveSegments: 18,
  });
  caseGeo.translate(0, -0.1, -0.21);
  disposables.geometries.push(caseGeo);

  const caseMesh = new THREE.Mesh(caseGeo, mats.primaryBlue);
  caseMesh.castShadow = true;
  group.add(caseMesh);

  // Top Flap Band
  const flapGeo = new THREE.BoxGeometry(1.74, 0.34, 0.58);
  disposables.geometries.push(flapGeo);
  const flap = new THREE.Mesh(flapGeo, mats.skyBlue);
  flap.position.set(0, 0.24, 0.03);
  flap.castShadow = true;
  group.add(flap);

  // Arched Briefcase Handle
  const handleGeo = new THREE.TorusGeometry(0.32, 0.065, 14, 28, Math.PI);
  disposables.geometries.push(handleGeo);
  const handle = new THREE.Mesh(handleGeo, mats.white);
  handle.position.set(0, 0.48, 0);
  handle.castShadow = true;
  group.add(handle);

  // Center Clasp Badge
  const claspGeo = new THREE.CapsuleGeometry(0.11, 0.12, 8, 16);
  disposables.geometries.push(claspGeo);
  const clasp = new THREE.Mesh(claspGeo, mats.white);
  clasp.position.set(0, 0.08, 0.34);
  group.add(clasp);

  const claspDotGeo = new THREE.SphereGeometry(0.06, 16, 16);
  disposables.geometries.push(claspDotGeo);
  const claspDot = new THREE.Mesh(claspDotGeo, mats.cyan);
  claspDot.position.set(0, 0.08, 0.42);
  group.add(claspDot);

  // Orbiting HR Network Profile Nodes
  const orbNodeGeo = new THREE.SphereGeometry(0.16, 22, 22);
  const linkGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.52, 10);
  disposables.geometries.push(orbNodeGeo, linkGeo);

  const satellites: [number, number, number, THREE.Material][] = [
    [-0.95, 0.72, 0.22, mats.cyan],
    [0.96, 0.68, -0.18, mats.lavender],
    [0.86, -0.68, 0.28, mats.white],
  ];

  satellites.forEach(([x, y, z, mat]) => {
    const node = new THREE.Mesh(orbNodeGeo, mat);
    node.position.set(x, y, z);
    node.castShadow = true;
    group.add(node);

    const dir = new THREE.Vector3(x, y, z);
    const link = new THREE.Mesh(linkGeo, mats.softBlue);
    link.position.set(x * 0.55, y * 0.55, z * 0.55);
    link.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    group.add(link);
  });

  return group;
}

export function ServiceClayIcon3D({ activeService }: ServiceClayIcon3DProps) {
  const { themeConfig } = useTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeServiceRef = useRef<ServiceId>(activeService);
  const themeConfigRef = useRef(themeConfig);
  const [webglFallback, setWebglFallback] = useState(false);

  const renderStaticRef = useRef<(() => void) | null>(null);
  const applyThemeRef = useRef<((cfg: typeof themeConfig) => void) | null>(null);

  useEffect(() => {
    activeServiceRef.current = activeService;
  }, [activeService]);

  useEffect(() => {
    themeConfigRef.current = themeConfig;
    applyThemeRef.current?.(themeConfig);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderStaticRef.current?.();
    }
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

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 340;

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

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(0, 0.25, 5.4);
    camera.lookAt(0, 0, 0);

    // Soft Claymorphism Lighting
    const hemi = new THREE.HemisphereLight(0xf8fbff, 0xdbe7f7, 1.35);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfffcf5, 1.9);
    key.position.set(3.5, 4.8, 4.5);
    key.castShadow = !isSoftwareGl;
    key.shadow.mapSize.width = 512;
    key.shadow.mapSize.height = 512;
    key.shadow.bias = -0.0005;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xb9dcff, 0.9);
    fill.position.set(-4, 1.5, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xe9e7ff, 0.85);
    rim.position.set(0, 2.4, -4);
    scene.add(rim);

    const disposables: Disposables = { geometries: [], materials: [] };
    const mats = buildClayMaterials(disposables);

    const applyThemeToScene = (cfg: typeof themeConfig) => {
      mats.primaryBlue.color.setHex(cfg.three.primaryHex);
      mats.primaryBlue.emissive.setHex(cfg.three.emissivePrimaryHex);
      mats.cyan.color.setHex(cfg.three.secondaryHex);
      mats.cyan.emissive.setHex(cfg.three.emissiveSecondaryHex);
      mats.skyBlue.color.setHex(cfg.three.softTintHex);
      mats.lavender.color.setHex(cfg.three.lavenderTintHex);
      fill.color.setHex(cfg.three.softTintHex);
      rim.color.setHex(cfg.three.lavenderTintHex);
    };
    applyThemeToScene(themeConfigRef.current);
    applyThemeRef.current = applyThemeToScene;

    const stage = new THREE.Group();
    scene.add(stage);

    const serviceGroups: Record<ServiceId, THREE.Group> = {
      staffing: buildStaffingGroup(mats, disposables),
      mobility: buildMobilityGroup(mats, disposables),
      hrms: buildHrmsGroup(mats, disposables),
    };

    const scales: Record<ServiceId, number> = {
      staffing: activeServiceRef.current === 'staffing' ? 1 : 0.001,
      mobility: activeServiceRef.current === 'mobility' ? 1 : 0.001,
      hrms: activeServiceRef.current === 'hrms' ? 1 : 0.001,
    };

    (Object.keys(serviceGroups) as ServiceId[]).forEach((id) => {
      const grp = serviceGroups[id];
      grp.scale.setScalar(scales[id]);
      grp.visible = scales[id] > 0.01;
      stage.add(grp);
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.position.z = w < 320 ? 6.2 : 5.4;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

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

    const updateFrame = (dt: number, snap = false) => {
      const activeId = activeServiceRef.current;

      (Object.keys(serviceGroups) as ServiceId[]).forEach((id) => {
        const grp = serviceGroups[id];
        const target = id === activeId ? 1 : 0.001;
        scales[id] = snap ? target : THREE.MathUtils.damp(scales[id], target, 9, dt);
        grp.scale.setScalar(scales[id]);
        grp.visible = scales[id] > 0.02;

        if (grp.visible) {
          grp.position.y = snap ? 0 : Math.sin(elapsed * 1.45) * 0.09;
          grp.rotation.y = snap ? -0.18 : Math.sin(elapsed * 0.65) * 0.28;
          grp.rotation.x = snap ? 0.04 : Math.cos(elapsed * 0.5) * 0.06;
        }
      });
    };

    renderStaticRef.current = () => {
      if (disposed) return;
      updateFrame(0.016, true);
      renderer.render(scene, camera);
    };

    updateFrame(0.016, prefersReducedMotion);
    renderer.render(scene, camera);

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      if (isVisible) {
        elapsed += dt;
        updateFrame(dt);
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
      renderStaticRef.current = null;
      applyThemeRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      envRT.dispose();
      renderer.dispose();
    };
  }, []);

  // Ensure reduced-motion mode still re-renders immediately when activeService changes
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) return;
    renderStaticRef.current?.();
  }, [activeService]);

  if (webglFallback) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center sm:h-[300px]">
        <div className="apokrin-clay-card flex h-44 w-44 items-center justify-center rounded-3xl">
          <span
            className="font-display text-xl font-bold capitalize"
            style={{ color: 'var(--color-primary-strong)' }}
          >
            {activeService}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-[270px] w-full items-center justify-center sm:h-[310px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, var(--color-glow-soft) 0%, var(--color-glow-secondary) 46%, transparent 72%)',
        }}
      />
      <div
        ref={mountRef}
        aria-label={`3D Claymorphism icon for ${activeService}`}
        className="relative h-full w-full"
      />
    </div>
  );
}
