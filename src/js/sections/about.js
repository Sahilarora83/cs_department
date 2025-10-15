import * as THREE from 'three';
import { gsap } from 'gsap';
import holographicTextureURL from '../../assets/images/holographic.js';
import { createDecryptedText } from '../utils/decryptedText.js';

// About section variables
let scene, camera, renderer;
let orbs = [];
let container;
let animationFrame;

// Initialize about section
export async function initAboutSection(loadingManager) {
  container = document.getElementById('about-canvas-container');
  
  // Check if container exists
  if (!container) {
    console.warn('About canvas container not found, skipping 3D scene initialization');
    
    // Still initialize decrypted text and stats counter
    const aboutHeading = document.querySelector('#about h2');
    if (aboutHeading) {
      createDecryptedText(aboutHeading, {
        speed: 30,
        maxIterations: 15,
        sequential: true,
        revealDirection: 'start',
        animateOn: 'view',
        characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
      });
    }
    
    // Animate stats counter
    setupStatsCounter();
    return;
  }
  
  // Initialize decrypted text effect on heading
  const aboutHeading = document.querySelector('#about h2');
  if (aboutHeading) {
    createDecryptedText(aboutHeading, {
      speed: 30,
      maxIterations: 15,
      sequential: true,
      revealDirection: 'start',
      animateOn: 'view',
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
    });
  }
  
  // Animate stats counter
  setupStatsCounter();
  
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0x00f3ff, 2, 10);
  pointLight1.position.set(2, 1, 2);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0x7b2ff7, 2, 10);
  pointLight2.position.set(-2, -1, 2);
  scene.add(pointLight2);
  
  // Create holographic orbs
  await createHolographicOrbs();
  
  // Add event listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('app-resize', onWindowResize);
  
  // Set up scroll trigger
  setupScrollTrigger();
  
  // Start animation
  animate();
}

// Create holographic orbs
async function createHolographicOrbs() {
  // Create holographic texture
  const textureLoader = new THREE.TextureLoader();
  const holographicTexture = await textureLoader.loadAsync(holographicTextureURL);
  
  // Create orbs
  const orbCount = 5;
  
  for (let i = 0; i < orbCount; i++) {
    // Create geometry
    const radius = 0.3 + Math.random() * 0.5;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    
    // Create material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        holographicTexture: { value: holographicTexture },
        color1: { value: new THREE.Color(0x00f3ff) },
        color2: { value: new THREE.Color(0x7b2ff7) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D holographicTexture;
        uniform vec3 color1;
        uniform vec3 color2;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Calculate fresnel effect
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnelTerm = dot(viewDirection, vNormal);
          fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
          
          // Animated UV coordinates
          vec2 uv = vUv;
          uv.y += time * 0.1;
          
          // Sample holographic texture
          vec4 holographic = texture2D(holographicTexture, uv);
          
          // Mix colors based on fresnel and texture
          vec3 finalColor = mix(color1, color2, fresnelTerm) * holographic.rgb;
          
          // Apply holographic transparency
          float alpha = holographic.r * 0.5 + fresnelTerm * 0.5;
          
          gl_FragColor = vec4(finalColor, alpha * 0.7);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create mesh
    const orb = new THREE.Mesh(geometry, material);
    
    // Position orb
    const angle = (i / orbCount) * Math.PI * 2;
    const radius2 = 2;
    orb.position.x = Math.cos(angle) * radius2;
    orb.position.y = Math.sin(angle) * radius2;
    orb.position.z = Math.random() * 2 - 1;
    
    // Add rotation
    orb.rotation.x = Math.random() * Math.PI;
    orb.rotation.y = Math.random() * Math.PI;
    
    // Add velocity
    orb.velocity = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
      rotationX: (Math.random() - 0.5) * 0.01,
      rotationY: (Math.random() - 0.5) * 0.01
    };
    
    scene.add(orb);
    orbs.push(orb);
  }
}

// Handle window resize
function onWindowResize() {
  if (!container || !camera || !renderer) return;
  
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Set up scroll trigger
function setupScrollTrigger() {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
      onEnter: () => {
        if (!animationFrame) {
          animate();
        }
      },
      onLeave: () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      },
      onEnterBack: () => {
        if (!animationFrame) {
          animate();
        }
      },
      onLeaveBack: () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      }
    }
  });
}

// Animation loop
function animate() {
  if (!renderer || !scene || !camera) return;
  
  animationFrame = requestAnimationFrame(animate);
  
  // Update orbs
  const time = performance.now() * 0.001;
  
  orbs.forEach((orb, index) => {
    // Update position
    orb.position.x += orb.velocity.x;
    orb.position.y += orb.velocity.y;
    orb.position.z += orb.velocity.z;
    
    // Update rotation
    orb.rotation.x += orb.velocity.rotationX;
    orb.rotation.y += orb.velocity.rotationY;
    
    // Boundary check
    if (Math.abs(orb.position.x) > 3) orb.velocity.x *= -1;
    if (Math.abs(orb.position.y) > 3) orb.velocity.y *= -1;
    if (Math.abs(orb.position.z) > 3) orb.velocity.z *= -1;
    
    // Update shader uniforms
    orb.material.uniforms.time.value = time;
  });
  
  // Rotate camera slightly
  camera.position.x = Math.sin(time * 0.2) * 0.5;
  camera.position.y = Math.cos(time * 0.2) * 0.5;
  camera.lookAt(scene.position);
  
  // Render the scene
  renderer.render(scene, camera);
}

// Setup stats counter animation
function setupStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    
    gsap.to(stat, {
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 80%',
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              stat.textContent = Math.floor(this.targets()[0].val);
            }
          });
        }
      }
    });
  });
}
