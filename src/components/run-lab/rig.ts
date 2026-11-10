import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { looks, type CharacterId } from "../../data/characters";
import { createHeartGeometry, createToonGradient } from "../three-shared";

export type { CharacterId };

const up = new THREE.Vector3(0, 1, 0);
let gradient: THREE.DataTexture | null = null;
export const toon = (color: string) => new THREE.MeshToonMaterial({ color, gradientMap: (gradient ??= createToonGradient()) });

// Layer-1 objects are only drawn inside the x-ray lens (stencil value 1).
export function lensOnly<T extends THREE.Material>(material: T): T {
  material.stencilWrite = true;
  material.stencilRef = 1;
  material.stencilFunc = THREE.EqualStencilFunc;
  material.stencilFail = material.stencilZFail = material.stencilZPass = THREE.KeepStencilOp;
  return material;
}

function xray<T extends THREE.Object3D>(object: T): T {
  object.traverse((child) => child.layers.set(1));
  return object;
}

// Screen-space inverted hull: constant-width cartoon outline that follows skinning.
function outlineMaterial() {
  const material = new THREE.MeshBasicMaterial({ color: "#3b2618", side: THREE.BackSide });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", `#include <project_vertex>
      vec2 outlineDir = normalize((projectionMatrix * vec4(transformedNormal, 0.0)).xy + 1e-5);
      gl_Position.xy += outlineDir * 0.007 * gl_Position.w;`);
  };
  return material;
}

export type Flow = { mesh: THREE.Mesh; length: number; direction: 1 | -1; offset: number };
export type Drop = { mesh: THREE.Mesh; base: THREE.Vector3; down: THREE.Vector3; offset: number; size: number };

export type Rig = {
  root: THREE.Group;
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  base: string;
  oneShot: THREE.AnimationAction | null;
  cueSeen: number;
  head: THREE.Bone;
  neck: THREE.Bone;
  torso: THREE.Bone;
  skinMats: THREE.MeshToonMaterial[];
  skinBase: THREE.Color;
  faceMat: THREE.MeshToonMaterial | null;
  faceBase: THREE.Color;
  cheekMat: THREE.MeshBasicMaterial;
  drops: Drop[];
  heart: THREE.Mesh;
  lungs: THREE.Mesh[];
  muscleMat: THREE.MeshToonMaterial;
  flows: Flow[];
  flowClock: number;
  nextBlink: number;
  gaze: THREE.Vector2;
  /** Last animated head/neck pose. three's mixer skips bones whose value didn't change, so offsets must be undone manually. */
  headPose: THREE.Quaternion;
  neckPose: THREE.Quaternion;
  /** The clips key Head.scale to 1, so this is re-applied after every mixer update. */
  headScale: number;
};

// Both characters share one model file, so each gets its own skinned clone.
const cache = new WeakMap<GLTF, Map<CharacterId, Rig>>();

export function getRig(gltf: GLTF, character: CharacterId): Rig {
  const rigs = cache.get(gltf) ?? new Map<CharacterId, Rig>();
  cache.set(gltf, rigs);
  const cached = rigs.get(character);
  if (cached) return cached;
  const rig = buildRig(gltf, character);
  rigs.set(character, rig);
  return rig;
}

// The Face mesh holds the eyes (lower part) and eyebrows (top), so its box frames where the lenses go.
function addGlasses(head: THREE.Bone, face: THREE.Box3) {
  const width = face.max.x - face.min.x;
  const ring = width * 0.18;
  const y = face.min.y + (face.max.y - face.min.y) * 0.35;
  const z = face.max.z + ring * 0.2;
  const frame = toon("#24242c");
  const glasses = new THREE.Group();
  for (const side of [1, -1]) {
    const lens = new THREE.Mesh(new THREE.TorusGeometry(ring, ring * 0.16, 8, 28), frame);
    lens.position.set(side * width * 0.3, y, z);
    glasses.add(lens);
  }
  const bridge = new THREE.Mesh(new THREE.CylinderGeometry(ring * 0.12, ring * 0.12, width * 0.6 - ring * 2, 6), frame);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, y + ring * 0.2, z);
  glasses.add(bridge);
  head.attach(glasses);
}

function buildRig(gltf: GLTF, character: CharacterId): Rig {
  const model = cloneSkinned(gltf.scene);
  const root = new THREE.Group();
  root.add(model);
  const look = looks[character];
  const palette: Record<string, string> = look.palette;
  const meshes: THREE.SkinnedMesh[] = [];
  model.traverse((object) => {
    if ((object as THREE.SkinnedMesh).isSkinnedMesh) meshes.push(object as THREE.SkinnedMesh);
  });

  const outline = outlineMaterial();
  const ghost = lensOnly(new THREE.MeshBasicMaterial({ color: "#5fb8ff", transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending }));
  const skinMats: THREE.MeshToonMaterial[] = [];
  let faceMat: THREE.MeshToonMaterial | null = null;
  let skinMesh: THREE.SkinnedMesh | null = null;
  let faceMesh: THREE.SkinnedMesh | null = null;
  for (const mesh of meshes) {
    const name = (mesh.material as THREE.Material).name;
    const material = toon(palette[name] ?? "#cccccc");
    mesh.material = material;
    mesh.frustumCulled = false;
    if (name === "Skin") {
      skinMats.push(material);
      skinMesh = mesh;
    }
    if (name === "Face") {
      faceMat = material;
      faceMesh = mesh;
    }
    const hull = mesh.clone();
    hull.material = outline;
    mesh.parent?.add(hull);
    if (name === "Hair" || name === "Face") continue;
    const xrayBody = xray(mesh.clone());
    xrayBody.material = ghost;
    mesh.parent?.add(xrayBody);
  }

  const mixer = new THREE.AnimationMixer(model);
  const actions: Record<string, THREE.AnimationAction> = {};
  for (const clip of gltf.animations) actions[clip.name] = mixer.clipAction(clip);
  actions.Idle.play();
  mixer.update(0);
  model.getObjectByName("Head")?.scale.setScalar(look.headScale);
  model.updateMatrixWorld(true);
  for (const mesh of meshes) mesh.skeleton.update();
  const rawBox = new THREE.Box3().setFromObject(model);
  const scale = look.height / (rawBox.max.y - rawBox.min.y);
  model.scale.setScalar(scale);
  model.position.y = -rawBox.min.y * scale;
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);

  const bone = (name: string) => {
    const found = model.getObjectByName(name);
    if (!found) throw new Error(`角色骨骼缺失：${name}`);
    return found as THREE.Bone;
  };
  const at = (name: string) => bone(name).getWorldPosition(new THREE.Vector3());
  const head = bone("Head");
  const neck = bone("Neck");
  const torso = bone("Torso");
  const headPos = at("Head");
  const headH = box.max.y - headPos.y;
  const headCenter = headPos.clone().addScaledVector(up, headH * 0.5);
  const chestW = at("UpperArmL").distanceTo(at("UpperArmR")) * 0.8;
  const ray = new THREE.Raycaster();
  const surface = (origin: THREE.Vector3, direction: THREE.Vector3, targets: THREE.Object3D[], fallback: THREE.Vector3) => {
    ray.set(origin, direction.normalize());
    return ray.intersectObjects(targets, false)[0]?.point ?? fallback;
  };

  // Blush on both cheeks, glued to the head bone.
  const cheekMat = new THREE.MeshBasicMaterial({ color: "#ff6f86", transparent: true, opacity: 0.2, depthWrite: false });
  const skinTargets = skinMesh ? [skinMesh] : meshes;
  for (const side of [1, -1]) {
    const y = headPos.y + headH * 0.3;
    const x = side * headH * 0.3;
    const point = surface(new THREE.Vector3(x, y, box.max.z + 1), new THREE.Vector3(0, 0, -1), skinTargets,
      new THREE.Vector3(x, y, headCenter.z + headH * 0.45));
    const out = point.clone().sub(headCenter).normalize();
    const cheek = new THREE.Mesh(new THREE.CircleGeometry(headH * 0.085, 24), cheekMat);
    cheek.scale.set(1.25, 0.8, 1);
    cheek.position.copy(point).addScaledVector(out, headH * 0.012);
    cheek.lookAt(point.clone().addScaledVector(out, 1));
    cheek.renderOrder = 2;
    head.attach(cheek);
  }

  if (look.glasses && faceMesh) addGlasses(head, new THREE.Box3().setFromObject(faceMesh));

  // Sweat drops that slide down the temples when warm.
  const dropMat = toon("#8fdcff");
  const dropGeometry = new THREE.SphereGeometry(1, 12, 10);
  dropGeometry.scale(0.7, 1, 0.7);
  const headScale = head.getWorldScale(new THREE.Vector3()).x;
  const drops: Drop[] = [];
  for (const [side, height, offset] of [[1, 0.62, 0], [-1, 0.55, 0.45], [1, 0.45, 0.7]] as const) {
    const y = headPos.y + headH * height;
    const point = surface(new THREE.Vector3(side * 5, y, headCenter.z + headH * 0.12), new THREE.Vector3(-side, 0, 0), meshes,
      new THREE.Vector3(side * headH * 0.55, y, headCenter.z));
    const drop = new THREE.Mesh(dropGeometry, dropMat);
    drop.position.copy(point).addScaledVector(new THREE.Vector3(side, 0, 0.3).normalize(), headH * 0.04);
    head.attach(drop);
    const base = drop.position.clone();
    const downWorld = head.localToWorld(base.clone()).addScaledVector(up, -headH * 0.35);
    drops.push({ mesh: drop, base, down: head.worldToLocal(downWorld).sub(base), offset, size: (headH * 0.045) / headScale });
    drop.scale.setScalar(0);
  }

  // X-ray organs: heart, lungs, leg muscles and blood vessels with flowing cells.
  const chest = at("Torso").lerp(at("Neck"), 0.5);
  const heartMat = lensOnly(toon("#ff3d5e"));
  heartMat.emissive = new THREE.Color("#7a0018");
  const heart = xray(new THREE.Mesh(createHeartGeometry(), heartMat));
  heart.position.copy(chest).add(new THREE.Vector3(chestW * 0.1, -chestW * 0.05, chestW * 0.16));
  heart.rotation.z = 0.35;
  heart.scale.setScalar(chestW * 0.26);
  torso.attach(heart);
  heart.userData.base = heart.scale.clone();

  const lungMat = lensOnly(toon("#ffb3c6"));
  const lungs = [1, -1].map((side) => {
    const lung = xray(new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), lungMat));
    lung.position.copy(chest).add(new THREE.Vector3(side * chestW * 0.27, chestW * 0.06, -chestW * 0.02));
    lung.scale.set(chestW * 0.22, chestW * 0.36, chestW * 0.17);
    torso.attach(lung);
    lung.userData.base = lung.scale.clone();
    return lung;
  });

  const muscleMat = lensOnly(toon("#ff9f6b"));
  const redMat = lensOnly(new THREE.MeshBasicMaterial({ color: "#ff2d4f" }));
  const blueMat = lensOnly(new THREE.MeshBasicMaterial({ color: "#3d7bff" }));
  const cellGeometry = new THREE.SphereGeometry(chestW * 0.035, 10, 8);
  const flows: Flow[] = [];

  const segment = (parent: THREE.Bone, start: THREE.Vector3, end: THREE.Vector3, muscle: boolean) => {
    const length = start.distanceTo(end);
    const group = new THREE.Group();
    group.position.copy(start);
    group.quaternion.setFromUnitVectors(up, end.clone().sub(start).normalize());
    if (muscle) {
      const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(chestW * 0.11, length * 0.6, 4, 12), muscleMat);
      capsule.position.y = length * 0.5;
      group.add(capsule);
    }
    for (const [direction, material, x] of [[1, redMat, chestW * 0.035], [-1, blueMat, -chestW * 0.035]] as const) {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(chestW * 0.012, chestW * 0.012, length, 6), material);
      tube.position.set(x, length / 2, chestW * 0.13);
      group.add(tube);
      for (let i = 0; i < 3; i += 1) {
        const cell = new THREE.Mesh(cellGeometry, material);
        cell.position.set(x, 0, chestW * 0.13);
        group.add(cell);
        flows.push({ mesh: cell, length, direction, offset: i / 3 + (direction < 0 ? 0.17 : 0) });
      }
    }
    xray(group);
    parent.attach(group);
  };

  for (const side of ["L", "R"]) {
    segment(bone(`UpperArm${side}`), at(`UpperArm${side}`), at(`LowerArm${side}`), false);
    segment(bone(`LowerArm${side}`), at(`LowerArm${side}`), at(`Fist${side}`), false);
    segment(bone(`UpperLeg${side}`), at(`UpperLeg${side}`), at(`LowerLeg${side}`), true);
    const lowerLeg = bone(`LowerLeg${side}`);
    segment(lowerLeg, at(`LowerLeg${side}`), lowerLeg.localToWorld(new THREE.Vector3(0, lowerLeg.position.length() * 0.9, 0)), true);
  }
  segment(torso, heart.getWorldPosition(new THREE.Vector3()), at("Hips"), false);

  return {
    root, mixer, actions, base: "Idle", oneShot: null, cueSeen: 0, head, neck, torso,
    skinMats, skinBase: skinMats[0]?.color.clone() ?? new THREE.Color(), faceMat, faceBase: faceMat?.color.clone() ?? new THREE.Color(),
    cheekMat, drops, heart, lungs, muscleMat, flows, flowClock: 0, nextBlink: 2, gaze: new THREE.Vector2(),
    headPose: head.quaternion.clone(), neckPose: neck.quaternion.clone(), headScale: look.headScale
  };
}
