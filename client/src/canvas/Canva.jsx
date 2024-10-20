import React from 'react'
import {Canvas} from '@react-three/fiber';
import { Environment, Center} from '@react-three/drei';
import Shirt from './Shirt';
import CameraRig from './CameraRig';
import BackDrop from './BackDrop';
const Canva = () => {
  
  return (
    <Canvas
    shadows
    camera={{position:[0,0,1.2], fov: 50}}
    gl = {{preserveDrawingBuffer:true}}
    className='w-full max-w-full h-full transition-all ease-in'
    style={{width:'100vw', height: '100vh'}}>
        <ambientLight intensity={1}/>
        <Environment preset = "city"/>
        <CameraRig>
        <BackDrop/>
        <Center >
          <Shirt />
        </Center>
        </CameraRig>
    </Canvas>
  )
}

export default Canva