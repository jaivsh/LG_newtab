// src/components/Background/Background.js
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  canvas {
    display: block;
  }
`;

const Background = ({ type = 'particles' }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create different background types
    if (type === 'particles') {
      createParticleBackground(scene);
    } else if (type === 'waves') {
      createWaveBackground(scene);
    } else if (type === 'galaxy') {
      createGalaxyBackground(scene);
    }
    
    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate or animate elements
      scene.children.forEach(child => {
        if (child.type === 'Points') {
          child.rotation.y += 0.001;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [type]);
  
  const createParticleBackground = (scene) => {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
  };
  
  const createWaveBackground = (scene) => {
    const geometry = new THREE.PlaneGeometry(15, 15, 64, 64);
    
    const material = new THREE.MeshBasicMaterial({
      color: 0x5865F2,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    
    // Create wave effect
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      positions.setZ(i, Math.sin(x) * 0.5 + Math.sin(y) * 0.5);
    }
    
    scene.add(plane);
  };
  
  const createGalaxyBackground = (scene) => {
    const parameters = {
      count: 10000,
      size: 0.01,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      insideColor: 0xff6030,
      outsideColor: 0x1b3984,
    };
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);
    
    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;
      
      // Position
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
      
      const randomX = Math.pow(Math.random(), parameters.randomness) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), parameters.randomness) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), parameters.randomness) * (Math.random() < 0.5 ? 1 : -1);
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Color
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
  };
  
  return <BackgroundContainer ref={containerRef} />;
};

export default Background;