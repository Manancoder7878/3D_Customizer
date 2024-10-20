import React , {useRef}from 'react'
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';
const CameraRig = ({children}) => {
  const group = useRef()
  const snap = useSnapshot(state)
  useFrame((state,delta) => {
    const isBreak = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;
    //set intial position
    let targetpos =  [-0.4,0,1];
    if(snap.intro){
      if(isBreak) targetpos = [0,0, 1.3];
      if(isMobile) targetpos = [0, 0.2, 1.5];
    } else{
      if(isMobile) targetpos = [0, 0, 1.5];
      else targetpos = [0, 0 , 1];
    }

    //set model camera pos
    easing.damp3(state.camera.position, targetpos, 0.25, delta)
    //rotate logic
    easing.dampE(
      group.current.rotation,
      [state.pointer.y/10, -state.pointer.x/5, 0],
      0.25,
      delta
    )
  })

  return <group ref = {group}>{children}</group>
}

export default CameraRig