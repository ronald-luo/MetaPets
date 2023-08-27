import { ScreenSpace, Html, shaderMaterial, Sparkles, Center, useTexture, useGLTF, PresentationControls, OrbitControls } from '@react-three/drei';
import { useFrame, extend, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useEffect, Suspense } from 'react';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';
import Fox from './Fox.jsx';
import Heatmap from './Heatmap.jsx';

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color( '#ffffff' ),
        uColorEnd: new THREE.Color( '#000000' ),
        side: THREE.DoubleSide,
        depthWrite: false,
    }, 
    portalVertexShader, 
    portalFragmentShader,
)

extend( { PortalMaterial } );
// extend( { DraggableList });

export default function Experience() {
    const { nodes } = useGLTF( './model/portal.glb' );
    const bakedTexture = useTexture( './model/baked.jpg' );
    // const { scene } = useThree();
    const controlsRef = useRef();
    const portalMaterial = useRef();

    useFrame((state, delta) => {
        portalMaterial.current.uniforms.uTime.value += 0.01;
    });

    return <>
        <color args={ [ '#1a1a1a' ] } attach="background" />

        <ambientLight intensity={ 0.5 } />
        
        <Html fullscreen>
        <header className="header">
            <div className="container">
                <div className="header__logo">
                <h1>MetaPets</h1>
                </div>
                <nav className="header__nav">
                <ul className="nav__list">
                    <li className="nav__item">
                    <a href="#home">Home</a>
                    </li>
                    <li className="nav__item">
                    <a href="#about">About</a>
                    </li>
                    <li className="nav__item">
                    <a href="#contact">Contact</a>
                    </li>
                    <li className="nav__item nav__item--profile">
                    <a href="#profile">Profile</a>
                    <div className="profile__dropdown">
                        <a href="#settings">Settings</a>
                        <a href="#logout">Logout</a>
                    </div>
                    </li>
                </ul>
                </nav>
            </div>
        </header>
        </Html>

        {/* <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05}/> */}
        <PresentationControls 
            global
            rotation={ [0, Math.PI / 1.6, 0] }
            polar={[-0.3, 0.3]}
            azimuth={[-1.5, 1]}
        >
        <Center>
            <group scale={10} position={[0, -5, 0]}>
                <Suspense fallback={null}>
                    <mesh geometry={nodes.baked.geometry}>
                        <meshBasicMaterial map={bakedTexture} attach="material" map-flipY={ false }/>
                    </mesh>
                </Suspense>

                <Suspense fallback={null}>
                    <mesh geometry={nodes.poleLightA.geometry} position={nodes.poleLightA.position}>
                        <pointLight distance={ 5 } intensity={ 2 } color="#ff0040" />
                    </mesh>
                </Suspense>
   
                <Suspense fallback={null}>
                    <mesh geometry={nodes.poleLightB.geometry} position={nodes.poleLightB.position}>
                        <pointLight distance={ 5 } intensity={ 2 } color="#0040ff" />
                    </mesh>
                </Suspense>

                <Suspense fallback={null}>
                    <mesh geometry={nodes.portalLight.geometry} position={nodes.portalLight.position} rotation={nodes.portalLight.rotation}>
                        <portalMaterial ref={ portalMaterial } />
                    </mesh>
                </Suspense>

                <Sparkles 
                    size={10} 
                    scale={[5,5,5]}
                    position-y={1}
                    position-z={1}
                    speed={1}
                    count={ 30 }
                />      

            </group>

            <Suspense fallback={null}>
                <Fox/>
            </Suspense>

            <Html position={[-30, 20, 1.75]} scale={5} rotation={[0, 0.5, 0]} transform>
                <div className='home-modal'>
                    <div className='name-container'>
                        <img className="profile-pic" src="./images/user-profile.jpeg" alt="user image"></img>
                        <h1>Welcome back, John</h1>

                        <img id="bell-icon" src="./images/bell.svg" alt="bell-icon" />
                    </div>

                    <div className="notification-container">
                        <div className="notification">
                            <img className="badge-icon" src="./images/badge-5.svg" alt="bell-icon" />
                            <div className="achievement">
                                <h2>
                                    Logged 10 workouts
                                </h2>
                                <p>
                                    Way to go! See how you've been consistent?
                                </p>
                            </div>
                        </div>
                        <div className="notification">
                            <img className="badge-icon" src="./images/badge-6.svg" alt="bell-icon" />
                            <div className="achievement">
                                <h2>
                                    You just reached level 21
                                </h2>
                                <p>
                                    Continue to grow with your virtual companion.
                                </p>
                            </div>
                        </div>
                        <div className="notification">
                            <img className="badge-icon" src="./images/badge-7.svg" alt="bell-icon" />
                            <div className="achievement">
                                <h2>
                                    Your mood has been better
                                </h2>
                                <p>
                                    Keep taking it one step at a time!
                                </p>
                            </div>
                        </div>
                        <div className="notification">
                            <img className="badge-icon" src="./images/badge-8.svg" alt="bell-icon" />
                            <div className="achievement">
                                <h2>
                                    One week streak!
                                </h2>
                                <p>
                                    You've been doing great, keep it up!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Html>

            <Html position={[25, 20, 1.75]} scale={2} rotation={[0, -1, 0]} transform>
                <div className="stats-modal">
                    <h1>Your Progress</h1>
                    <Heatmap/>

                    <div className="summary-stats">
                        <span className="stat">
                            <img className="badge-icon" src="./images/badge-5.svg" alt="100,000 lifetime step" />
                        </span>
                        <span className="stat">
                            <img className="badge-icon" src="./images/badge-6.svg" alt="100,000 lifetime step" />
                        </span>
                        <span className="stat">
                            <img className="badge-icon" src="./images/badge-7.svg" alt="100,000 lifetime step" />
                        </span>
                    </div>
                    
                </div>

                
            </Html>

            <Html position={[-14, -10, 20]} scale={2} rotation={[0, 0, 0]} transform>
                <div className="about-modal">
                    <h1>Level 21</h1>

                    <p>
                        A virtual companion that grows with you.
                    </p>

                    <div className="summary-stats">

                    </div>
                </div>

            </Html>
        </Center>
        </PresentationControls>

    </>
}