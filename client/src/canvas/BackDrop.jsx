import React, { useRef } from 'react'
import {easing} from 'maath'
import {useFrame} from '@react-three/drei'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'
const BackDrop = () => {
  const shadows = useRef();
  return (
    <AccumulativeShadows
    ref= {shadows}
    temporal
    frames = {60}
    alphaTest={0.85}
    scae = {10}
    rotation={[Math.PI / 2,0, 0]}
     position={[0,0, -0.14]}>
      <RandomizedLight
      amount = {4}
      radius={4}
      intensity={1.5}
      ambient={0.4}
      position={[5,5,-10]}
      />
      <RandomizedLight
      amount = {4}
      radius={5}
      intensity={0.5}
      ambient={0.6}
      position={[5,5,-10]}
      />
    </AccumulativeShadows>
  )
}

export default BackDrop