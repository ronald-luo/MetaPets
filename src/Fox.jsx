import * as THREE from 'three';
import { useAnimations, useGLTF, Cone } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber';

export default function Fox({...props}) {
    const arrowRef = useRef();
    const foxRef = useRef();
    const fox = useGLTF('./Fox/glTF/Fox.gltf')
    const animations = useAnimations(fox.animations, fox.scene);

    const maxX = 20, minX = -20, maxZ = 20, minZ = -20;  // Boundary coordinates

    const [targetDirection, setTargetDirection] = useState(new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1));
    const [currentDirection, setCurrentDirection] = useState(new THREE.Vector3());
    const [isRunning, setIsRunning] = useState(true);

    const defaultAnimation = animations.names.includes("Walk") ? "Walk" : animations.names[0];

    // hide useControls for now

    const { animationName } = useControls({
        animationName: { options: animations.names, value: defaultAnimation, label: "Animation"}
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setIsRunning(!isRunning);
        }, 5000);
    
        return () => {
            clearInterval(interval);
        };
    }, []);  // Empty dependency array to avoid re-creating the interval

    useEffect(() => {
        const action = isRunning ? animations.actions["Run"] : animations.actions["Walk"];
        action.reset().fadeIn(0.5).play();
    
        return () => {
            action.fadeOut(0.5);
        };
    }, [isRunning]);

    useEffect(() => {
        const action = animations.actions[animationName]
        action.reset().fadeIn(0.5).play()

        return () => {
            action.fadeOut(0.5).stop()
        }

    }, [animationName])

    // Update the target direction every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setTargetDirection(new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useFrame((state, delta) => {
        const speed = 0.05;

        currentDirection.lerp(targetDirection, 0.05);
        currentDirection.normalize();

        const nextPosition = foxRef.current.position.clone().add(currentDirection.clone().multiplyScalar(speed));

        if (nextPosition.x > maxX || nextPosition.x < minX || nextPosition.z > maxZ || nextPosition.z < minZ) {
            setTargetDirection(new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1));
        } else {
            foxRef.current.position.add(currentDirection.clone().multiplyScalar(speed));
            foxRef.current.rotation.y = Math.atan2(currentDirection.x, currentDirection.z);
        }

        const arrow = arrowRef.current;
        arrow.position.x = foxRef.current.position.x;
        arrow.position.z = foxRef.current.position.z;

        // console.log(foxRef.current.position.x)
    });



    return (
        <group>
        <primitive 
            object={ fox.scene } 
            scale={ 0.03 }
            position={ [ 0, -5, 0 ] }
            rotation={ [ 0, 0, 0 ] }
            ref={ foxRef }
        />

        <Cone 
            scale={10}
            args={[0.05, 0.2, 32]} // Radius, height, and radial segments
            position={[0, 1, 0]} // Initially position it above the fox
            rotation={[Math.PI, 0, 0]} // Rotate it to point upwards
            ref={arrowRef}
        >
            <meshStandardMaterial color={"#00ff00"} /> {/* Green color */}
        </Cone>
    </group>

    
    
    )
}
