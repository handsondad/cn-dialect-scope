import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { breathFill, createBodyState, exertionOf, heartSqueeze, motionFor, type BodyState } from "../lib/run-lab";
import { getRig, type CharacterId, type Rig } from "./run-lab/rig";
import { runFacing, World } from "./run-lab/world";

export type { CharacterId };
export type LensState = { on: boolean; follow: boolean; x: number; y: number; r: number };
export type RunLabCue = { id: number; clip: "Jump" | "Victory" };

type RunLab3DProps = {
  character: CharacterId;
  /** A second character standing beside the first, idling and looking at them. */
  partner?: CharacterId;
  bodyRef: MutableRefObject<BodyState>;
  lensRef: MutableRefObject<LensState>;
  cueRef: MutableRefObject<RunLabCue>;
  reducedMotion: boolean;
  active: boolean;
  label: string;
  onCharacterTap: () => void;
  onReady: () => void;
};

const idleFacing = 0.35;
const lookTarget = new THREE.Vector3(0, 0.95, 0);
const flush = new THREE.Color("#ff9a8a");
const damp = (from: number, to: number, rate: number, dt: number) => to + (from - to) * Math.exp(-rate * dt);

export const modelUrl = `${import.meta.env.BASE_URL}models/character.glb`;

function playOnce(rig: Rig, clip: string) {
  const action = rig.actions[clip];
  if (!action) return;
  rig.oneShot?.fadeOut(0.1);
  action.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.15).play();
  action.clampWhenFinished = true;
  rig.actions[rig.base].fadeOut(0.15);
  rig.oneShot = action;
}

type CharacterProps = Omit<RunLab3DProps, "active" | "label" | "partner"> & { x: number; facing: number; tracksLens: boolean };

function Character({ character, bodyRef, lensRef, cueRef, reducedMotion, onCharacterTap, x, facing, tracksLens }: Omit<CharacterProps, "onReady">) {
  const gltf = useLoader(GLTFLoader, modelUrl);
  const rig = useMemo(() => getRig(gltf, character), [gltf, character]);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const scratch = useMemo(() => ({ v: new THREE.Vector3(), c: new THREE.Color() }), []);

  useLayoutEffect(() => {
    const rest = bodyRef.current.effort <= 0.12;
    const initRot = rest ? facing : runFacing;
    rig.root.rotation.y = initRot;
    const gx = rest ? THREE.MathUtils.clamp(0.1 - initRot, -0.75, 0.75) : 0;
    const gy = rest ? 0.12 : 0;
    rig.gaze.set(gx, gy);
    rig.head.quaternion.copy(rig.headPose);
    rig.neck.quaternion.copy(rig.neckPose);
    rig.mixer.update(0);
    rig.head.scale.setScalar(rig.headScale);
    rig.headPose.copy(rig.head.quaternion);
    rig.neckPose.copy(rig.neck.quaternion);
    rig.neck.rotateY(gx * 0.35);
    rig.head.rotateY(gx * 0.65);
    rig.head.rotateX(-gy);
    rig.torso.scale.set(1, 1, 1);
    rig.neck.scale.set(1, 1, 1);
    rig.faceMat?.color.copy(rig.faceBase);
  }, [rig, facing, bodyRef]);

  useEffect(() => {
    const onFinished = (event: { action: THREE.AnimationAction }) => {
      if (event.action !== rig.oneShot) return;
      rig.oneShot.fadeOut(0.3);
      rig.oneShot = null;
      rig.actions[rig.base].reset().fadeIn(0.3).play();
    };
    rig.mixer.addEventListener("finished", onFinished);
    return () => rig.mixer.removeEventListener("finished", onFinished);
  }, [rig]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.1);
    const time = state.clock.elapsedTime;
    const body = bodyRef.current;
    const exertion = exertionOf(body);

    if (cueRef.current.id !== rig.cueSeen) {
      rig.cueSeen = cueRef.current.id;
      playOnce(rig, cueRef.current.clip);
    }
    const motion = motionFor(body.effort);
    if (motion.clip !== rig.base) {
      const previous = rig.actions[rig.base];
      rig.base = motion.clip;
      if (!rig.oneShot) {
        previous.fadeOut(0.35);
        rig.actions[rig.base].reset().fadeIn(0.35).play();
      }
    }
    rig.actions[rig.base].timeScale = motion.timeScale * (reducedMotion ? 0.7 : 1);
    rig.head.quaternion.copy(rig.headPose);
    rig.neck.quaternion.copy(rig.neckPose);
    rig.mixer.update(dt);
    rig.head.scale.setScalar(rig.headScale);
    rig.headPose.copy(rig.head.quaternion);
    rig.neckPose.copy(rig.neck.quaternion);

    rig.root.rotation.y = damp(rig.root.rotation.y, body.effort > 0.12 ? runFacing : facing, 5, dt);

    // Look toward the child (and their finger) while resting; mostly ahead while running.
    const weight = 1 - 0.8 * body.effort;
    const pointerX = reducedMotion ? 0 : state.pointer.x;
    const pointerY = reducedMotion ? 0 : state.pointer.y;
    rig.gaze.x = damp(rig.gaze.x, THREE.MathUtils.clamp((0.1 - rig.root.rotation.y + pointerX * 0.6) * weight, -0.75, 0.75), 6, dt);
    // Never tilt down: the child's finger is often on the button below, and a lowered head hides the face.
    rig.gaze.y = damp(rig.gaze.y, THREE.MathUtils.clamp((pointerY * 0.15 + 0.12) * weight, 0, 0.3), 6, dt);
    rig.neck.rotateY(rig.gaze.x * 0.35);
    rig.head.rotateY(rig.gaze.x * 0.65);
    rig.head.rotateX(-rig.gaze.y);

    const chest = 1 + (0.025 + 0.05 * exertion) * breathFill(body.breathPhase);
    rig.torso.scale.set(chest, 1, chest);
    rig.neck.scale.set(1 / chest, 1, 1 / chest);

    if (time > rig.nextBlink + 0.12) rig.nextBlink = time + 2 + Math.random() * 3;
    rig.faceMat?.color.copy(time > rig.nextBlink ? rig.skinMats[0]?.color ?? rig.faceBase : rig.faceBase);

    rig.cheekMat.opacity = 0.18 + 0.55 * exertion;
    scratch.c.copy(rig.skinBase).lerp(flush, exertion * 0.2);
    for (const material of rig.skinMats) material.color.copy(scratch.c);

    const sweat = THREE.MathUtils.smoothstep(body.warmth, 0.3, 0.6);
    for (const drop of rig.drops) {
      const t = (time * 0.7 + drop.offset) % 1;
      drop.mesh.position.copy(drop.base).addScaledVector(drop.down, reducedMotion ? 0.2 : t);
      drop.mesh.scale.setScalar(drop.size * sweat * (reducedMotion ? 1 : Math.min(1, (1 - t) * 3, t * 8)));
    }

    const lens = lensRef.current;
    const heartBase = rig.heart.userData.base as THREE.Vector3;
    rig.heart.scale.copy(heartBase).multiplyScalar(1.06 - 0.14 * heartSqueeze(body.beatPhase));
    for (const lung of rig.lungs) {
      const lungBase = lung.userData.base as THREE.Vector3;
      const fill = 1 + (0.06 + 0.12 * exertion) * breathFill(body.breathPhase);
      lung.scale.set(lungBase.x * fill, lungBase.y * (1 + (fill - 1) * 0.6), lungBase.z * fill);
    }
    rig.muscleMat.emissive.setRGB(0.9, 0.25, 0.05).multiplyScalar(0.05 + 0.5 * body.effort * (0.8 + 0.2 * heartSqueeze(body.beatPhase)));
    rig.flowClock += dt * (body.bpm / 60) * 0.55 * (reducedMotion ? 0.4 : 1);
    for (const flow of rig.flows) {
      const t = (rig.flowClock + flow.offset) % 1;
      flow.mesh.position.y = (flow.direction > 0 ? t : 1 - t) * flow.length;
    }

    if (!tracksLens) return;
    rig.heart.getWorldPosition(scratch.v).project(camera);
    lens.r = Math.min(size.width, size.height) * (size.width < 480 ? 0.26 : 0.2);
    if (lens.follow) {
      lens.x = damp(lens.x, ((scratch.v.x + 1) / 2) * size.width, 8, dt);
      lens.y = damp(lens.y, ((1 - scratch.v.y) / 2) * size.height, 8, dt);
    }
  });

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    playOnce(rig, "Jump");
    onCharacterTap();
  };

  return (
    <primitive object={rig.root} position={[x, 0.05, 0]} onClick={onClick}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }} />
  );
}

/** `lift` raises the framing so the characters sit lower, leaving room for speech bubbles above their heads. */
function CameraRig({ reducedMotion, lift }: { reducedMotion: boolean; lift: number }) {
  const target = useMemo(() => lookTarget.clone().setY(lookTarget.y + lift), [lift]);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    const portrait = size.width < size.height * 0.85;
    camera.position.set(0.6, 1.5 + lift + (portrait ? 0.25 : 0), portrait ? 7.3 : 6.2);
    camera.lookAt(target);
  }, [camera, size.width, size.height, lift, target]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.1);
    const portrait = state.size.width < state.size.height * 0.85;
    const distance = portrait ? 7.3 : 6.2;
    const x = 0.6 + (reducedMotion ? 0 : state.pointer.x * 0.3);
    const y = 1.5 + lift + (reducedMotion ? 0 : state.pointer.y * 0.15) + (portrait ? 0.25 : 0);
    state.camera.position.set(damp(state.camera.position.x, x, 3, dt), damp(state.camera.position.y, y, 3, dt), distance);
    state.camera.lookAt(target);
  });
  return null;
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate]);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady();
  }, 2);
  return null;
}

// Draws the world, then a stencil-masked circle where only layer-1 (x-ray) objects are visible.
function XrayCompositor({ lensRef }: { lensRef: MutableRefObject<LensState> }) {
  const mask = useMemo(() => {
    const scene = new THREE.Scene();
    const material = new THREE.MeshBasicMaterial({ color: "#10264d", transparent: true, opacity: 0.9, depthTest: false, depthWrite: false });
    material.stencilWrite = true;
    material.stencilRef = 1;
    material.stencilFunc = THREE.AlwaysStencilFunc;
    material.stencilZPass = THREE.ReplaceStencilOp;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 64), material);
    scene.add(disc);
    return { scene, disc, camera: new THREE.OrthographicCamera(0, 1, 0, -1, -1, 1) };
  }, []);

  useFrame(({ gl, scene, camera, size }) => {
    gl.autoClear = false;
    gl.clear(true, true, true);
    camera.layers.set(0);
    gl.render(scene, camera);
    const lens = lensRef.current;
    if (!lens.on) return;
    mask.camera.right = size.width;
    mask.camera.bottom = -size.height;
    mask.camera.updateProjectionMatrix();
    mask.disc.position.set(lens.x, -lens.y, 0);
    mask.disc.scale.setScalar(lens.r);
    gl.clearDepth();
    gl.render(mask.scene, mask.camera);
    camera.layers.set(1);
    gl.render(scene, camera);
    camera.layers.set(0);
  }, 1);
  return null;
}

function Lights() {
  const enableXray = (light: THREE.Light | null) => light?.layers.enable(1);
  return (
    <>
      <hemisphereLight ref={enableXray} args={["#ffffff", "#ffd9b0", 1.6]} />
      <directionalLight ref={enableXray} position={[3, 6, 5]} intensity={2.1} />
    </>
  );
}

const restingBody = { current: createBodyState() };
const idleLens = { current: { on: false, follow: false, x: 0, y: 0, r: 0 } };

export default function RunLab3D({ active, label, partner, onReady, ...props }: RunLab3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lift = partner ? 0.35 : 0;
  return (
    <div ref={ref} className="run-lab-canvas" role="img" aria-label={label}>
      <Canvas flat dpr={[1, 2]} frameloop={active ? "always" : "never"} resize={{ offsetSize: true }}
        gl={{ antialias: true, alpha: true, stencil: true }}
        camera={{ fov: 30, near: 0.1, far: 60, position: [0.6, 1.5 + lift, 6.2] }}>
        <Lights />
        <CameraRig reducedMotion={props.reducedMotion} lift={lift} />
        <World bodyRef={props.bodyRef} reducedMotion={props.reducedMotion} />
        <Suspense fallback={null}>
          <Character {...props} x={partner ? 0.5 : 0} facing={partner ? -0.25 : idleFacing} tracksLens />
          {partner && (
            <Character {...props} character={partner} bodyRef={restingBody} lensRef={idleLens}
              x={-0.6} facing={0.55} tracksLens={false} />
          )}
          <ReadySignal onReady={onReady} />
        </Suspense>
        <XrayCompositor lensRef={props.lensRef} />
      </Canvas>
    </div>
  );
}
