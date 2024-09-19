import React, { useRef, useMemo } from 'react';
import { Text3D, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

//Iridescent shader taken from https://codesandbox.io/p/sandbox/iridescent-shader-material-l1vdv

const font = import('./font.json');

export const GameWin = () => {
  const $mesh = useRef();
  const opts = useMemo(
    () => ({
      red: -0.5,
      green: 0.62,
      blue: -0.22,
      shade: 10,
      animate: true
    }),
    []
  );

  useFrame(() => {
    if (opts.animate) {
      $mesh.current.material.uniforms.uTime.value += 0.02;
    }
    $mesh.current.material.uniforms.uColor.value = new THREE.Vector3(opts.red, opts.green, opts.blue);
    $mesh.current.material.uniforms.uShade.value = opts.shade;
  });

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Vector3(opts.red, opts.green, opts.blue) }, // Color Correction
        uShade: { value: opts.shade }
      },
      vertexShader: /*glsl*/ `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            } 
          `,
      fragmentShader: /*glsl*/ `
            varying vec3 vNormal;
            uniform float uTime;
            uniform float uShade;
            uniform vec3 uColor;
            void main() {
              gl_FragColor = vec4(vNormal * (sin(vNormal.z * uShade + uTime * 3.) * .5 + .5) + uColor, 1.);
            } 
          `
    }),
    [opts]
  );
  useFrame((state, delta) => {
    state.camera.position.lerp(new THREE.Vector3(0, -5, 5), delta);
    state.camera.updateProjectionMatrix();
  });
  return (
    <Center position={[0, -2, 0]} rotateX={90}>
      <Text3D ref={$mesh} castShadow scale={0.5} height={2} font={font} bevelEnabled bevelSize={0.1} anchorX="center" anchorY="middle">
        YOU WIN!
        <shaderMaterial args={[shaderArgs]} />
      </Text3D>
    </Center>
  );
};
