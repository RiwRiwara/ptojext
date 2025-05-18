import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CartPoleState } from '../types/reinforcement-learning-types';

interface ThreeJSCartPoleRendererProps {
  state: CartPoleState;
  containerRef: React.RefObject<HTMLDivElement>;
  isPlaying: boolean;
}

export const ThreeJSCartPoleRenderer: React.FC<ThreeJSCartPoleRendererProps> = ({
  state,
  containerRef,
  isPlaying
}) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cartRef = useRef<THREE.Mesh | null>(null);
  const poleRef = useRef<THREE.Object3D | null>(null);
  const trackRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Setup the scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create the track
    const trackGeometry = new THREE.BoxGeometry(10, 0.1, 0.5);
    const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.position.y = -0.25;
    track.receiveShadow = true;
    scene.add(track);
    trackRef.current = track;
    
    // Create the cart
    const cartGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.3);
    const cartMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const cart = new THREE.Mesh(cartGeometry, cartMaterial);
    cart.position.y = 0;
    cart.castShadow = true;
    cart.receiveShadow = true;
    scene.add(cart);
    cartRef.current = cart;
    
    // Create the pole
    const poleGroup = new THREE.Group();
    scene.add(poleGroup);
    
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 0.5;
    pole.castShadow = true;
    poleGroup.add(pole);
    
    // Add a small sphere at the top of the pole
    const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.y = 1;
    sphere.castShadow = true;
    poleGroup.add(sphere);
    
    poleGroup.position.y = 0.15;
    poleRef.current = poleGroup;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below the ground
    
    // Add grid for reference
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.position.y = -0.3;
    scene.add(gridHelper);
    
    // Animation function
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cache the container reference for cleanup to avoid closure issues
    const currentContainer = containerRef.current;
    
    // Cleanup
    return () => {
      if (rendererRef.current && currentContainer) {
        currentContainer.removeChild(rendererRef.current.domElement);
      }
      
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // NOTE: We're intentionally not including containerRef in the dependency array
  
  // Update the simulation state
  useEffect(() => {
    if (!cartRef.current || !poleRef.current) return;
    
    const cartPosition = state.position * (8 / 4.8);
    const poleAngle = state.angle;
    
    const renderScene = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    // Update positions based on state
    cartRef.current.position.x = cartPosition;
    poleRef.current.rotation.z = poleAngle;
    
    // Request animation frame to render the scene
    renderScene();
    
    // Optional: add visual feedback when learning is active
    if (isPlaying) {
      // Subtle pulsing effect on the cart
      cartRef.current.scale.set(
        1 + Math.sin(Date.now() * 0.005) * 0.05,
        1 + Math.sin(Date.now() * 0.005) * 0.05,
        1 + Math.sin(Date.now() * 0.005) * 0.05
      );
    } else {
      cartRef.current.scale.set(1, 1, 1);
    }
  }, [state, isPlaying]);
  
  return null; // The renderer appends directly to the container
};
