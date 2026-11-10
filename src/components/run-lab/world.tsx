import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { BodyState } from "../../lib/run-lab";
import { toon } from "./rig";

export const planetRadius = 5;
export const runFacing = 0.9;
const up = new THREE.Vector3(0, 1, 0);
const runDirection = new THREE.Vector3(Math.sin(runFacing), 0, Math.cos(runFacing));
// The planet spins about this fixed axis so the path always passes under the runner's feet.
const spinAxis = new THREE.Vector3().crossVectors(up, runDirection).normalize();

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function onSurface(object: THREE.Object3D, angle: number, side: number, lift = 0) {
  const normal = up.clone().multiplyScalar(Math.cos(angle)).addScaledVector(runDirection, Math.sin(angle)).addScaledVector(spinAxis, side).normalize();
  object.position.copy(normal).multiplyScalar(planetRadius + lift);
  object.quaternion.setFromUnitVectors(up, normal);
  return object;
}

function buildPlanet(): THREE.Group {
  const random = seeded(7);
  const planet = new THREE.Group();
  planet.add(new THREE.Mesh(new THREE.SphereGeometry(planetRadius, 64, 40), toon("#8ed46b")));
  const path = new THREE.Mesh(new THREE.TorusGeometry(planetRadius - 0.94, 1, 10, 160), toon("#f6dca4"));
  path.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), spinAxis);
  planet.add(path);

  const trunkMat = toon("#a8714a");
  const leafMats = ["#4fb35a", "#6cc56a", "#3f9e57"].map(toon);
  const flowerMats = ["#ff7aa2", "#ffd23f", "#ffffff", "#b38cff"].map(toon);
  const capMat = toon("#ff5a4f");
  const dotMat = toon("#fff7ec");
  const stemMat = toon("#fff0d6");
  const pebbleMat = toon("#d9c08a");

  for (let i = 0; i < 16; i += 1) {
    const tree = new THREE.Group();
    const height = 0.45 + random() * 0.35;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, height, 8), trunkMat);
    trunk.position.y = height / 2;
    tree.add(trunk);
    const leaves = leafMats[i % leafMats.length];
    if (random() > 0.4) {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38 + random() * 0.18, 1), leaves);
      crown.position.y = height + 0.25;
      tree.add(crown);
    } else {
      for (let k = 0; k < 3; k += 1) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.42 - k * 0.1, 0.5, 9), leaves);
        cone.position.y = height + 0.1 + k * 0.28;
        tree.add(cone);
      }
    }
    tree.scale.setScalar(0.9 + random() * 0.6);
    planet.add(onSurface(tree, (i / 16) * Math.PI * 2 + random() * 0.2, 0.32 + random() * 0.5));
  }

  for (let i = 0; i < 7; i += 1) {
    const mushroom = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.16, 8), stemMat);
    stem.position.y = 0.08;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
    cap.position.y = 0.15;
    mushroom.add(stem, cap);
    for (let k = 0; k < 3; k += 1) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), dotMat);
      const a = (k / 3) * Math.PI * 2;
      dot.position.set(Math.cos(a) * 0.08, 0.26, Math.sin(a) * 0.08);
      mushroom.add(dot);
    }
    planet.add(onSurface(mushroom, random() * Math.PI * 2, (random() > 0.5 ? 1 : -1) * (0.2 + random() * 0.15)));
  }

  for (let i = 0; i < 36; i += 1) {
    const flower = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 4), leafMats[0]);
    stem.position.y = 0.07;
    const bloom = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05, 0), flowerMats[i % flowerMats.length]);
    bloom.position.y = 0.15;
    flower.add(stem, bloom);
    const side = (random() > 0.45 ? 1 : -1) * (0.13 + random() * 0.5);
    planet.add(onSurface(flower, random() * Math.PI * 2, side));
  }

  for (let i = 0; i < 18; i += 1) {
    const pebble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.05 + random() * 0.04, 0), pebbleMat);
    pebble.scale.y = 0.45;
    planet.add(onSurface(pebble, random() * Math.PI * 2, (random() - 0.5) * 0.12, 0.04));
  }
  return planet;
}

function buildCloud(random: () => number): THREE.Group {
  const cloud = new THREE.Group();
  const material = toon("#ffffff");
  for (let i = 0; i < 4; i += 1) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.45 + random() * 0.3, 16, 12), material);
    puff.position.set(i * 0.55 - 0.8, (i % 2) * 0.2, random() * 0.2);
    cloud.add(puff);
  }
  return cloud;
}

export function World({ bodyRef, reducedMotion }: { bodyRef: MutableRefObject<BodyState>; reducedMotion: boolean }) {
  const planet = useMemo(buildPlanet, []);
  const clouds = useMemo(() => {
    const random = seeded(11);
    return [[-5, 3.6, -9], [1, 4.4, -11], [6, 3.2, -10], [-1.5, 2.6, -8]].map(([x, y, z]) => {
      const cloud = buildCloud(random);
      cloud.position.set(x, y, z);
      return cloud;
    });
  }, []);
  const spin = useRef(new THREE.Quaternion());

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1);
    const { effort } = bodyRef.current;
    const speed = effort * 2.3 * (reducedMotion ? 0.35 : 1);
    planet.quaternion.premultiply(spin.current.setFromAxisAngle(spinAxis, (-speed * delta) / planetRadius));
    for (const cloud of clouds) {
      cloud.position.x -= delta * (0.08 + effort * (reducedMotion ? 0.1 : 0.5));
      if (cloud.position.x < -9) cloud.position.x = 9;
    }
  });

  return (
    <group>
      <group position={[0, -planetRadius, 0]}>
        <primitive object={planet} />
      </group>
      {clouds.map((cloud, index) => <primitive key={index} object={cloud} />)}
      <mesh position={[-4.5, 4.6, -14]}>
        <circleGeometry args={[1.1, 40]} />
        <meshBasicMaterial color="#ffe27a" />
      </mesh>
      <mesh position={[-4.5, 4.6, -14.1]}>
        <circleGeometry args={[1.6, 40]} />
        <meshBasicMaterial color="#fff3c4" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial color="#2f5a1f" transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </group>
  );
}
