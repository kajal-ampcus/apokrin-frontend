import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface ArrowConfig {
  id: string;
  color: number;
  emissive: number;
  direction: 1 | -1;
  speed: number; // cycles per second
  arcLength: number; // fraction of full closed orbit (0..1)
  initialPhase: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  rx: number;
  ry: number;
  rz: number;
  waveAmpY: number;
  waveAmpZ: number;
  waveFreq: number;
}

const ARROW_CONFIGS: ArrowConfig[] = [
  {
    id: 'orange',
    color: 0xf97316,
    emissive: 0x9a3412,
    direction: 1,
    speed: 0.185,
    arcLength: 0.34,
    initialPhase: 0.08,
    tiltX: 0.38,
    tiltY: 0.22,
    tiltZ: 0.62,
    rx: 2.02,
    ry: 1.56,
    rz: 1.85,
    waveAmpY: 0.28,
    waveAmpZ: 0.34,
    waveFreq: 2,
  },
  {
    id: 'green',
    color: 0x10b981,
    emissive: 0x065f46,
    direction: -1, // Counter-rotating direction for genuine intertwining
    speed: 0.155,
    arcLength: 0.33,
    initialPhase: 0.44,
    tiltX: -0.34,
    tiltY: -0.28,
    tiltZ: -0.74,
    rx: 1.92,
    ry: 1.78,
    rz: 1.65,
    waveAmpY: 0.32,
    waveAmpZ: 0.38,
    waveFreq: 2,
  },
  {
    id: 'blue',
    color: 0x2563eb,
    emissive: 0x1e3a8a,
    direction: 1,
    speed: 0.132,
    arcLength: 0.35,
    initialPhase: 0.77,
    tiltX: 0.88,
    tiltY: -0.15,
    tiltZ: 0.22,
    rx: 1.86,
    ry: 1.48,
    rz: 2.08,
    waveAmpY: 0.24,
    waveAmpZ: 0.28,
    waveFreq: 3,
  },
];

// Reusable math scratch objects (zero GC inside animation loop)
const _p0 = new THREE.Vector3();
const _p1 = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _binormal = new THREE.Vector3();
const _vert = new THREE.Vector3();
const _basisMat = new THREE.Matrix4();
const _headPos = new THREE.Vector3();
const _headTan = new THREE.Vector3();
const _headNorm = new THREE.Vector3();
const _headBin = new THREE.Vector3();

// Chamfered beveled rectangular cross-section (8 vertices in local [binormal, normal] plane)
const BASE_PROFILE: [number, number][] = [
  [-0.12, 0.042],
  [-0.085, 0.072],
  [0.085, 0.072],
  [0.12, 0.042],
  [0.12, -0.042],
  [0.085, -0.072],
  [-0.085, -0.072],
  [-0.12, -0.042],
];
const PROFILE_COUNT = BASE_PROFILE.length;
const RIBBON_SEGMENTS = 38;

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

function buildOrbitCurve(cfg: ArrowConfig): THREE.CatmullRomCurve3 {
  const sampleCount = 48;
  const pts: THREE.Vector3[] = [];
  const euler = new THREE.Euler(cfg.tiltX, cfg.tiltY, cfg.tiltZ, 'XYZ');

  for (let i = 0; i < sampleCount; i++) {
    const theta = (i / sampleCount) * Math.PI * 2;
    const x = Math.cos(theta) * cfg.rx;
    const y = Math.sin(theta) * cfg.ry + Math.sin(theta * cfg.waveFreq) * cfg.waveAmpY;
    const z = Math.sin(theta + 0.55) * cfg.rz + Math.cos(theta * cfg.waveFreq) * cfg.waveAmpZ;
    const v = new THREE.Vector3(x, y, z).applyEuler(euler);

    // Guarantee clearance around the stationary center robot so arrows weave cleanly over/under
    const minRadius = 1.44;
    if (v.length() < minRadius) {
      v.setLength(minRadius);
    }
    pts.push(v);
  }

  return new THREE.CatmullRomCurve3(pts, true, 'centripetal', 0.5);
}

function createRibbonBufferGeometry(): THREE.BufferGeometry {
  const ringCount = RIBBON_SEGMENTS + 1;
  const vertexCount = ringCount * PROFILE_COUNT + 2; // +2 for end caps
  const positions = new Float32Array(vertexCount * 3);
  const indices: number[] = [];

  for (let s = 0; s < RIBBON_SEGMENTS; s++) {
    const rowA = s * PROFILE_COUNT;
    const rowB = (s + 1) * PROFILE_COUNT;
    for (let k = 0; k < PROFILE_COUNT; k++) {
      const nextK = (k + 1) % PROFILE_COUNT;
      const a = rowA + k;
      const b = rowA + nextK;
      const c = rowB + nextK;
      const d = rowB + k;
      indices.push(a, d, c);
      indices.push(a, c, b);
    }
  }

  // Tail cap & head-join cap
  const tailCapIdx = ringCount * PROFILE_COUNT;
  const headCapIdx = tailCapIdx + 1;
  for (let k = 0; k < PROFILE_COUNT; k++) {
    const nextK = (k + 1) % PROFILE_COUNT;
    indices.push(tailCapIdx, k, nextK);
    const lastRow = RIBBON_SEGMENTS * PROFILE_COUNT;
    indices.push(headCapIdx, lastRow + nextK, lastRow + k);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setIndex(indices);
  return geo;
}

function updateRibbonGeometry(
  geo: THREE.BufferGeometry,
  curve: THREE.CatmullRomCurve3,
  headU: number,
  arcLength: number,
  direction: 1 | -1,
) {
  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;
  const ringCount = RIBBON_SEGMENTS + 1;

  for (let s = 0; s < ringCount; s++) {
    const frac = s / RIBBON_SEGMENTS; // 0 = trailing tail tip, 1 = junction at arrowhead
    const offset = (1 - frac) * arcLength;
    const u = ((headU - direction * offset) % 1 + 1) % 1;
    const uAhead = ((u + direction * 0.004) % 1 + 1) % 1;

    curve.getPointAt(u, _p0);
    curve.getPointAt(uAhead, _p1);
    _tangent.subVectors(_p1, _p0).normalize();

    // Radial outward normal from robot center so the ribbon flat face always wraps cleanly around robot
    _normal.copy(_p0).normalize();
    _binormal.crossVectors(_normal, _tangent).normalize();
    if (_binormal.lengthSq() < 0.001) {
      _binormal.set(1, 0, 0);
    }
    _normal.crossVectors(_tangent, _binormal).normalize();

    // Smooth organic width & thickness taper along the ribbon body
    const widthScale = 0.22 + 0.88 * Math.pow(frac, 0.55);
    const thickScale = 0.35 + 0.65 * Math.pow(frac, 0.5);

    for (let k = 0; k < PROFILE_COUNT; k++) {
      const [bx, by] = BASE_PROFILE[k];
      _vert
        .copy(_p0)
        .addScaledVector(_binormal, bx * widthScale)
        .addScaledVector(_normal, by * thickScale);
      const idx = (s * PROFILE_COUNT + k) * 3;
      arr[idx] = _vert.x;
      arr[idx + 1] = _vert.y;
      arr[idx + 2] = _vert.z;
    }
  }

  // Update cap center vertices
  const tailCapIdx = ringCount * PROFILE_COUNT * 3;
  const uTail = ((headU - direction * arcLength) % 1 + 1) % 1;
  curve.getPointAt(uTail, _p0);
  arr[tailCapIdx] = _p0.x;
  arr[tailCapIdx + 1] = _p0.y;
  arr[tailCapIdx + 2] = _p0.z;

  const headCapIdx = (ringCount * PROFILE_COUNT + 1) * 3;
  const uHeadNorm = ((headU % 1) + 1) % 1;
  curve.getPointAt(uHeadNorm, _p0);
  arr[headCapIdx] = _p0.x;
  arr[headCapIdx + 1] = _p0.y;
  arr[headCapIdx + 2] = _p0.z;

  posAttr.needsUpdate = true;
  geo.computeVertexNormals();
}

function createBeveledArrowHeadGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  // Pointing along +Y in 2D shape (we'll rotate so +Z is forward along tangent)
  shape.moveTo(0, 0.34);
  shape.lineTo(0.24, -0.09);
  shape.lineTo(0.11, -0.055);
  shape.lineTo(0.11, -0.12);
  shape.lineTo(-0.11, -0.12);
  shape.lineTo(-0.11, -0.055);
  shape.lineTo(-0.24, -0.09);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.11,
    bevelEnabled: true,
    bevelThickness: 0.038,
    bevelSize: 0.032,
    bevelSegments: 4,
    curveSegments: 8,
  });

  // Center thickness on Z, then orient so tip points along +Z and flat face faces +Y (radial normal)
  geo.translate(0, 0, -0.055);
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function createStationaryRobotGroup(disposables: {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
}): THREE.Group {
  const robot = new THREE.Group();

  // Materials with clear roughness/metalness contrast for studio realism
  const ceramicWhiteMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.12,
    clearcoat: 0.88,
    clearcoatRoughness: 0.12,
  });
  const satinSilverMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.36,
    metalness: 0.58,
  });
  const titaniumDarkMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.48,
    metalness: 0.78,
  });
  const visorGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0b1224,
    roughness: 0.08,
    metalness: 0.25,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });
  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 1.9,
    roughness: 0.2,
    metalness: 0.1,
  });
  const blueAccentMat = new THREE.MeshPhysicalMaterial({
    color: 0x2563eb,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.55,
    roughness: 0.22,
    metalness: 0.3,
    clearcoat: 0.8,
  });

  disposables.materials.push(
    ceramicWhiteMat,
    satinSilverMat,
    titaniumDarkMat,
    visorGlassMat,
    cyanGlowMat,
    blueAccentMat,
  );

  // 1. Sculpted beveled torso chassis (Primary silhouette)
  const torsoShape = new THREE.Shape();
  torsoShape.moveTo(-0.34, -0.44);
  torsoShape.quadraticCurveTo(0, -0.52, 0.34, -0.44);
  torsoShape.quadraticCurveTo(0.46, -0.1, 0.42, 0.28);
  torsoShape.quadraticCurveTo(0, 0.38, -0.42, 0.28);
  torsoShape.quadraticCurveTo(-0.46, -0.1, -0.34, -0.44);

  const torsoGeo = new THREE.ExtrudeGeometry(torsoShape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 5,
    curveSegments: 20,
  });
  torsoGeo.translate(0, -0.48, -0.21);
  disposables.geometries.push(torsoGeo);

  const torsoMesh = new THREE.Mesh(torsoGeo, ceramicWhiteMat);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  robot.add(torsoMesh);

  // 2. Lower chassis waist & stabilizer base
  const waistGeo = new THREE.CylinderGeometry(0.32, 0.22, 0.24, 32);
  disposables.geometries.push(waistGeo);
  const waistMesh = new THREE.Mesh(waistGeo, titaniumDarkMat);
  waistMesh.position.set(0, -1.03, 0);
  waistMesh.castShadow = true;
  robot.add(waistMesh);

  // 3. Chest recessed core bezel & luminous AI core ring
  const coreBezelGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.08, 32);
  coreBezelGeo.rotateX(Math.PI / 2);
  disposables.geometries.push(coreBezelGeo);
  const coreBezel = new THREE.Mesh(coreBezelGeo, titaniumDarkMat);
  coreBezel.position.set(0, -0.46, 0.29);
  robot.add(coreBezel);

  const coreRingGeo = new THREE.TorusGeometry(0.11, 0.025, 16, 36);
  disposables.geometries.push(coreRingGeo);
  const coreRing = new THREE.Mesh(coreRingGeo, cyanGlowMat);
  coreRing.position.set(0, -0.46, 0.335);
  robot.add(coreRing);

  const coreDotGeo = new THREE.SphereGeometry(0.055, 24, 24);
  disposables.geometries.push(coreDotGeo);
  const coreDot = new THREE.Mesh(coreDotGeo, blueAccentMat);
  coreDot.position.set(0, -0.46, 0.33);
  robot.add(coreDot);

  // 4. Shoulder pauldrons & upper arm joints
  const pauldronGeo = new THREE.SphereGeometry(0.21, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.65);
  const armStubGeo = new THREE.CapsuleGeometry(0.11, 0.34, 8, 18);
  disposables.geometries.push(pauldronGeo, armStubGeo);

  [-1, 1].forEach((side) => {
    const pauldron = new THREE.Mesh(pauldronGeo, satinSilverMat);
    pauldron.position.set(side * 0.54, -0.31, 0);
    pauldron.rotation.z = -side * 0.45;
    pauldron.castShadow = true;
    robot.add(pauldron);

    const arm = new THREE.Mesh(armStubGeo, titaniumDarkMat);
    arm.position.set(side * 0.59, -0.62, 0.02);
    arm.rotation.z = side * 0.14;
    arm.castShadow = true;
    robot.add(arm);
  });

  // 5. Articulated neck collar
  const neckGeo = new THREE.CylinderGeometry(0.17, 0.21, 0.22, 28);
  const collarRingGeo = new THREE.TorusGeometry(0.22, 0.032, 14, 32);
  collarRingGeo.rotateX(Math.PI / 2);
  disposables.geometries.push(neckGeo, collarRingGeo);

  const neck = new THREE.Mesh(neckGeo, titaniumDarkMat);
  neck.position.set(0, -0.04, 0);
  robot.add(neck);

  const collarRing = new THREE.Mesh(collarRingGeo, satinSilverMat);
  collarRing.position.set(0, -0.12, 0);
  robot.add(collarRing);

  // 6. Sculpted AI Head Helmet (Primary Upper Silhouette)
  const headShape = new THREE.Shape();
  headShape.moveTo(-0.42, -0.24);
  headShape.quadraticCurveTo(0, -0.32, 0.42, -0.24);
  headShape.quadraticCurveTo(0.54, 0.05, 0.42, 0.34);
  headShape.quadraticCurveTo(0, 0.48, -0.42, 0.34);
  headShape.quadraticCurveTo(-0.54, 0.05, -0.42, -0.24);

  const headGeo = new THREE.ExtrudeGeometry(headShape, {
    depth: 0.44,
    bevelEnabled: true,
    bevelThickness: 0.13,
    bevelSize: 0.1,
    bevelSegments: 6,
    curveSegments: 24,
  });
  headGeo.translate(0, 0.42, -0.22);
  disposables.geometries.push(headGeo);

  const headMesh = new THREE.Mesh(headGeo, ceramicWhiteMat);
  headMesh.castShadow = true;
  headMesh.receiveShadow = true;
  robot.add(headMesh);

  // 7. Curved Dark Optical Visor Faceplate
  const visorShape = new THREE.Shape();
  visorShape.moveTo(-0.35, -0.14);
  visorShape.quadraticCurveTo(0, -0.19, 0.35, -0.14);
  visorShape.quadraticCurveTo(0.41, 0.04, 0.34, 0.2);
  visorShape.quadraticCurveTo(0, 0.26, -0.34, 0.2);
  visorShape.quadraticCurveTo(-0.41, 0.04, -0.35, -0.14);

  const visorGeo = new THREE.ExtrudeGeometry(visorShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 4,
    curveSegments: 20,
  });
  visorGeo.translate(0, 0.44, 0.28);
  disposables.geometries.push(visorGeo);

  const visorMesh = new THREE.Mesh(visorGeo, visorGlassMat);
  robot.add(visorMesh);

  // 8. Dual Glowing Optical AI Eyes inside the visor
  const eyeGeo = new THREE.CapsuleGeometry(0.052, 0.08, 8, 16);
  disposables.geometries.push(eyeGeo);

  [-1, 1].forEach((side) => {
    const eye = new THREE.Mesh(eyeGeo, cyanGlowMat);
    eye.position.set(side * 0.165, 0.46, 0.375);
    eye.rotation.z = side * 0.12;
    robot.add(eye);
  });

  // 9. Side Ear Telemetry Pods
  const earRingGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 28);
  earRingGeo.rotateZ(Math.PI / 2);
  const earCapGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.11, 24);
  earCapGeo.rotateZ(Math.PI / 2);
  disposables.geometries.push(earRingGeo, earCapGeo);

  [-1, 1].forEach((side) => {
    const earRing = new THREE.Mesh(earRingGeo, satinSilverMat);
    earRing.position.set(side * 0.56, 0.45, 0);
    earRing.castShadow = true;
    robot.add(earRing);

    const earCap = new THREE.Mesh(earCapGeo, blueAccentMat);
    earCap.position.set(side * 0.575, 0.45, 0);
    robot.add(earCap);
  });

  // 10. Sleek Crown Crest Fin
  const crestGeo = new THREE.BoxGeometry(0.1, 0.14, 0.46);
  disposables.geometries.push(crestGeo);
  const crest = new THREE.Mesh(crestGeo, satinSilverMat);
  crest.position.set(0, 0.96, -0.02);
  crest.castShadow = true;
  robot.add(crest);

  return robot;
}

export function Apokrin3DLogo() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFallback, setWebglFallback] = useState(false);

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

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 480;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
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

    // Procedural Studio Reflection Environment (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0.25, 7.6);
    camera.lookAt(0, -0.05, 0);

    // 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xf0f9ff, 0xcbd5e1, 1.05);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.1);
    keyLight.position.set(3.8, 5.2, 4.6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    const shadowBound = 3.2;
    keyLight.shadow.camera.left = -shadowBound;
    keyLight.shadow.camera.right = shadowBound;
    keyLight.shadow.camera.top = shadowBound;
    keyLight.shadow.camera.bottom = -shadowBound;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.95);
    fillLight.position.set(-4.5, 1.8, 3.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.15);
    rimLight.position.set(-1.5, 3.0, -5.0);
    scene.add(rimLight);

    const disposables: {
      geometries: THREE.BufferGeometry[];
      materials: THREE.Material[];
      textures: THREE.Texture[];
    } = { geometries: [], materials: [], textures: [] };

    // Subtle ground contact shadow plane (blends transparently onto light hero surface)
    const groundGeo = new THREE.PlaneGeometry(7, 7);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.position.y = -2.15;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);
    disposables.geometries.push(groundGeo);
    disposables.materials.push(groundMat);

    // Master stage group for subtle pointer parallax without moving the robot off center
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // 1. Stationary Central Futuristic AI Robot
    const robotGroup = createStationaryRobotGroup(disposables);
    stageGroup.add(robotGroup);

    // 2. Three Independent Intertwined 3D Beveled Glossy Arrows
    const sharedHeadGeo = createBeveledArrowHeadGeometry();
    disposables.geometries.push(sharedHeadGeo);

    const arrowRuntime = ARROW_CONFIGS.map((cfg) => {
      const curve = buildOrbitCurve(cfg);
      const ribbonGeo = createRibbonBufferGeometry();
      const mat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: 0.12,
        roughness: 0.17,
        metalness: 0.34,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
      });

      const ribbonMesh = new THREE.Mesh(ribbonGeo, mat);
      ribbonMesh.castShadow = true;
      ribbonMesh.receiveShadow = true;

      const headMesh = new THREE.Mesh(sharedHeadGeo, mat);
      headMesh.castShadow = true;
      headMesh.receiveShadow = true;

      stageGroup.add(ribbonMesh);
      stageGroup.add(headMesh);

      disposables.geometries.push(ribbonGeo);
      disposables.materials.push(mat);

      return {
        cfg,
        curve,
        ribbonGeo,
        headMesh,
        phase: cfg.initialPhase,
      };
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer hover parallax target
    let targetTiltX = 0;
    let targetTiltY = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetTiltY = nx * 0.16;
      targetTiltX = ny * 0.1;
    };
    const handlePointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    // ResizeObserver for crisp responsive sizing on desktop, tablet, and mobile
    const handleResize = () => {
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      // Pull camera slightly back on narrow viewports so full orbit stays unclipped
      camera.position.z = w < 380 ? 8.8 : 7.6;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // Update all 3 intertwined arrow geometries for a given elapsed time
    const updateArrows = (elapsed: number) => {
      for (let i = 0; i < arrowRuntime.length; i++) {
        const item = arrowRuntime[i];
        const { cfg, curve, ribbonGeo, headMesh } = item;

        // Smooth continuous orbital movement with subtle natural harmonic easing
        const baseAdvance = elapsed * cfg.speed;
        const harmonicEase = 0.025 * Math.sin((baseAdvance + cfg.initialPhase) * Math.PI * 2);
        const headU = ((cfg.initialPhase + cfg.direction * (baseAdvance + harmonicEase)) % 1 + 1) % 1;

        updateRibbonGeometry(ribbonGeo, curve, headU, cfg.arcLength, cfg.direction);

        // Align 3D beveled arrowhead at exact tip along tangent + outward radial normal
        const uAhead = ((headU + cfg.direction * 0.005) % 1 + 1) % 1;
        curve.getPointAt(headU, _headPos);
        curve.getPointAt(uAhead, _p1);
        _headTan.subVectors(_p1, _headPos).normalize();
        _headNorm.copy(_headPos).normalize();
        _headBin.crossVectors(_headNorm, _headTan).normalize();
        _headNorm.crossVectors(_headTan, _headBin).normalize();

        _basisMat.makeBasis(_headBin, _headNorm, _headTan);
        headMesh.position.copy(_headPos);
        headMesh.quaternion.setFromRotationMatrix(_basisMat);
      }
    };

    // Context lost/restored handlers
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

    // Initial render frame
    updateArrows(0);
    renderer.render(scene, camera);

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      elapsed += dt;

      // Smooth pointer parallax damping on the outer stage (robot remains centered)
      stageGroup.rotation.x = THREE.MathUtils.damp(stageGroup.rotation.x, targetTiltX, 4.5, dt);
      stageGroup.rotation.y = THREE.MathUtils.damp(stageGroup.rotation.y, targetTiltY, 4.5, dt);

      updateArrows(elapsed);
      renderer.render(scene, camera);

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
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);

      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      disposables.textures.forEach((t) => t.dispose());
      envRT.dispose();
      renderer.dispose();
    };
  }, []);

  if (webglFallback) {
    return (
      <div
        className="relative flex h-[380px] w-full items-center justify-center sm:h-[440px] lg:h-[500px]"
        aria-label="Apokrin 3D AI Robot and Intertwined Orbital Arrows"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-10 rounded-full blur-2xl"
          style={{
            background:
              'radial-gradient(circle, var(--color-glow) 0%, var(--color-glow-secondary) 45%, transparent 72%)',
          }}
        />
        <svg viewBox="0 0 360 360" className="relative h-full w-full max-w-[420px]">
          <ellipse cx="180" cy="180" rx="145" ry="62" transform="rotate(-34 180 180)" fill="none" stroke="#F97316" strokeWidth="14" strokeLinecap="round" />
          <ellipse cx="180" cy="180" rx="145" ry="62" transform="rotate(38 180 180)" fill="none" stroke="#10B981" strokeWidth="14" strokeLinecap="round" />
          <ellipse cx="180" cy="180" rx="135" ry="54" transform="rotate(6 180 180)" fill="none" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" />
          <rect x="132" y="106" width="96" height="74" rx="26" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="4" />
          <rect x="146" y="122" width="68" height="38" rx="14" fill="#0F172A" />
          <circle cx="166" cy="141" r="6" fill="#22D3EE" />
          <circle cx="194" cy="141" r="6" fill="#22D3EE" />
          <rect x="140" y="188" width="80" height="72" rx="20" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="4" />
          <circle cx="180" cy="222" r="11" fill="#06B6D4" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative flex h-[380px] w-full items-center justify-center sm:h-[440px] lg:h-[520px]">
      {/* Soft ambient glow blending naturally into the light hero background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(circle, var(--color-glow) 0%, var(--color-glow-secondary) 42%, transparent 72%)',
        }}
      />
      <div
        ref={mountRef}
        aria-label="Interactive 3D Apokrin AI Robot surrounded by orange, green, and blue intertwined arrows"
        className="relative h-full w-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
