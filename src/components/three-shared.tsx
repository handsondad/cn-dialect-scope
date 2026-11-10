import { useEffect, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createToonGradient(): THREE.DataTexture {
  const tones = new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
  const texture = new THREE.DataTexture(tones, 3, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

// Cartoon heart about 2 units wide, point facing down, centered on the origin.
export function createHeartGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(5, 5);
  shape.bezierCurveTo(5, 5, 4, 0, 0, 0);
  shape.bezierCurveTo(-6, 0, -6, 7, -6, 7);
  shape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
  shape.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
  shape.bezierCurveTo(16, 7, 16, 0, 10, 0);
  shape.bezierCurveTo(7, 0, 5, 5, 5, 5);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 4,
    bevelEnabled: true,
    bevelSegments: 10,
    bevelSize: 2,
    bevelThickness: 4,
    curveSegments: 32
  });
  geometry.center();
  geometry.rotateZ(Math.PI);
  geometry.scale(0.08, 0.08, 0.08);
  geometry.computeVertexNormals();
  return geometry;
}

type KidOrbitLimits = {
  minDistance: number;
  maxDistance: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minAzimuthAngle?: number;
  maxAzimuthAngle?: number;
};

// Child-friendly orbit: rotate and limited zoom only, no panning, re-render on demand.
export function KidOrbitControls({ controlsRef, limits }: { controlsRef: MutableRefObject<OrbitControls | null>; limits: KidOrbitLimits }) {
  const camera = useThree((state) => state.camera);
  const domElement = useThree((state) => state.gl.domElement);
  const invalidate = useThree((state) => state.invalidate);
  const { minDistance, maxDistance, minPolarAngle = Math.PI / 4, maxPolarAngle = (Math.PI * 3) / 4,
    minAzimuthAngle = -Infinity, maxAzimuthAngle = Infinity } = limits;

  useEffect(() => {
    const controls = new OrbitControls(camera, domElement);
    controls.enablePan = false;
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.minPolarAngle = minPolarAngle;
    controls.maxPolarAngle = maxPolarAngle;
    controls.minAzimuthAngle = minAzimuthAngle;
    controls.maxAzimuthAngle = maxAzimuthAngle;
    controls.saveState();
    const rerender = () => invalidate();
    controls.addEventListener("change", rerender);
    controlsRef.current = controls;
    return () => {
      controls.removeEventListener("change", rerender);
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, domElement, invalidate, controlsRef, minDistance, maxDistance, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle]);

  return null;
}

export type { OrbitControls };
