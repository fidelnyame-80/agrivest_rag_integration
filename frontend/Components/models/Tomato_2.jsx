
import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Tomato_2(props) {
  const { nodes, materials } = useGLTF('/models/tomato_2-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_2.geometry} material={materials.material_0} position={[0, -1.579, 1.163]} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_7.geometry} material={materials.GeneratedMat1} position={[0, -1.579, 1.163]} rotation={[-Math.PI, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/models/tomato_2-transformed.glb')
