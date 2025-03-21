import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const GeometricWavesAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    
   
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 25);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); 
    
    currentMount.appendChild(renderer.domElement);
    
    const waveGroup = new THREE.Group();
    scene.add(waveGroup);


    const createGrid = () => {
      const gridSize = 25;
      const spacing = 1.2;
      const cubeSize = 0.4;
      
    
      const material = new THREE.MeshBasicMaterial({
        color: 0x4285F4, 
        transparent: true,
        opacity: 0.8,
      });
      
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubes = [];
      
      
      for (let x = -gridSize/2; x < gridSize/2; x++) {
        for (let z = -gridSize/2; z < gridSize/2; z++) {
          const cube = new THREE.Mesh(geometry, material.clone());
          cube.position.set(x * spacing, 0, z * spacing);
          
         
          cube.userData.originalY = 0;
          cube.userData.x = x;
          cube.userData.z = z;
          
          waveGroup.add(cube);
          cubes.push(cube);
        }
      }
      
      return cubes;
    };
    
    const cubes = createGrid();
    
   
    waveGroup.rotation.x = Math.PI / 6;
    

    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
 
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
  
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
    
      cubes.forEach((cube) => {
        const { x, z } = cube.userData;
        
        
        const distance = Math.sqrt(x * x + z * z);
        const wave = Math.sin(distance * 0.5 - elapsedTime * 2) * 1.5;
        
        
        cube.position.y = wave;
        
        
        const hue = (wave + 1.5) / 3; 
        const color = new THREE.Color().setHSL(
          0.6 - hue * 0.1, 
          0.7, 
          0.4 + hue * 0.3 
        );
        
        cube.material.color = color;
        cube.material.opacity = 0.4 + hue * 0.6;
        
        
        const scale = 0.8 + hue * 0.8;
        cube.scale.set(scale, scale, scale);
      });
      
      
      waveGroup.rotation.y = mouseX * 0.2;
      waveGroup.rotation.x = Math.PI / 6 + mouseY * 0.1;
      
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      
      
      cubes.forEach(cube => {
        cube.geometry.dispose();
        cube.material.dispose();
      });
      
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
         backgroundColor: '#202225'
      }}
    />
  );
};

export default GeometricWavesAnimation;