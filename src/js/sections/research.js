import * as THREE from 'three';
import { gsap } from 'gsap';
import { createDecryptedText } from '../utils/decryptedText.js';

// Research section variables
let scene, camera, renderer;
let particleSystem;
let container;
let animationFrame;
let currentKeyword = 0;

// Research keywords
const researchKeywords = [
  {
    text: 'AI',
    description: 'Artificial Intelligence research focusing on machine learning, neural networks, and cognitive systems.'
  },
  {
    text: 'ML',
    description: 'Machine Learning research on supervised, unsupervised, and reinforcement learning algorithms.'
  },
  {
    text: 'DATA',
    description: 'Data Science research on big data analytics, data visualization, and predictive modeling.'
  },
  {
    text: 'QUANTUM',
    description: 'Quantum Computing research on quantum algorithms, quantum information theory, and quantum cryptography.'
  },
  {
    text: 'ROBOTICS',
    description: 'Robotics research on autonomous systems, computer vision, and human-robot interaction.'
  }
];

// Initialize research section
export async function initResearchSection(loadingManager) {
  container = document.getElementById('research-canvas-container');
  
  // Check if container exists
  if (!container) {
    console.warn('Research canvas container not found, skipping 3D scene initialization');
    
    // Still initialize decrypted text and stats counter
    const researchHeading = document.querySelector('#research h2');
    if (researchHeading) {
      createDecryptedText(researchHeading, {
        speed: 30,
        maxIterations: 15,
        sequential: true,
        revealDirection: 'start',
        animateOn: 'view'
      });
    }
    
    // Animate research stats counter
    setupResearchStatsCounter();
    return;
  }
  
  // Initialize decrypted text on heading
  const researchHeading = document.querySelector('#research h2');
  if (researchHeading) {
    createDecryptedText(researchHeading, {
      speed: 30,
      maxIterations: 15,
      sequential: true,
      revealDirection: 'start',
      animateOn: 'view'
    });
  }
  
  // Animate research stats counter
  setupResearchStatsCounter();
  
  // Create scene
  scene = new THREE.Scene();
  
  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 15;
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Create particle system
  await createParticleSystem(loadingManager);
  
  // Create research areas
  createResearchAreas();
  
  // Add event listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('app-resize', onWindowResize);
  
  // Set up scroll trigger
  setupScrollTrigger();
  
  // Start animation
  animate();
}

// Create particle system
async function createParticleSystem(loadingManager) {
  // Load particle texture
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const particleTexture = await textureLoader.loadAsync('/src/assets/images/particle.png');
  
  // Create geometry for particles
  const particleCount = 1000;
  const particleGeometry = new THREE.BufferGeometry();
  
  // Create arrays for particle positions and other attributes
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);
  const targetPositions = new Float32Array(particleCount * 3);
  const randomValues = new Float32Array(particleCount);
  
  // Initialize particles in a sphere
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Random position in sphere
    const radius = Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Store initial positions as target positions
    targetPositions[i3] = positions[i3];
    targetPositions[i3 + 1] = positions[i3 + 1];
    targetPositions[i3 + 2] = positions[i3 + 2];
    
    // Random sizes
    sizes[i] = Math.random() * 0.1 + 0.05;
    
    // Colors (gradient from blue to purple)
    const t = Math.random();
    colors[i3] = 0; // R
    colors[i3 + 1] = t * 0.5 + 0.5; // G (0.5 - 1.0)
    colors[i3 + 2] = 1.0; // B
    
    // Random values for animation
    randomValues[i] = Math.random();
  }
  
  // Set geometry attributes
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Store target positions in userData
  particleGeometry.userData = {
    targetPositions,
    randomValues
  };
  
  // Create particle material
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pointTexture: { value: particleTexture }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vColor = color;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      
      void main() {
        gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        if (gl_FragColor.a < 0.1) discard;
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });
  
  // Create particle system
  particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);
}

// Create research areas
function createResearchAreas() {
  const researchAreasContainer = document.querySelector('.research-areas');
  
  // Clear existing content
  researchAreasContainer.innerHTML = '';
  
  // Create research area elements
  researchKeywords.forEach((keyword, index) => {
    const researchArea = document.createElement('div');
    researchArea.className = 'research-area';
    researchArea.dataset.index = index;
    
    researchArea.innerHTML = `
      <h3>${keyword.text}</h3>
      <p>${keyword.description}</p>
    `;
    
    // Add click event
    researchArea.addEventListener('click', () => {
      morphParticles(index);
    });
    
    researchAreasContainer.appendChild(researchArea);
  });
}

// Morph particles to form text
function morphParticles(keywordIndex) {
  if (currentKeyword === keywordIndex) return;
  
  currentKeyword = keywordIndex;
  const keyword = researchKeywords[keywordIndex];
  
  // Highlight active research area
  const researchAreas = document.querySelectorAll('.research-area');
  researchAreas.forEach((area, index) => {
    if (index === keywordIndex) {
      area.classList.add('active');
    } else {
      area.classList.remove('active');
    }
  });
  
  // Create canvas to generate text points
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 256;
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(keyword.text, canvas.width / 2, canvas.height / 2);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Sample points from text
  const textPoints = [];
  const sampleStep = 4; // Sample every 4 pixels
  
  for (let y = 0; y < canvas.height; y += sampleStep) {
    for (let x = 0; x < canvas.width; x += sampleStep) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];
      
      // If pixel is black (text)
      if (data[index] < 128) {
        // Map canvas coordinates to 3D space
        const point = new THREE.Vector3(
          (x - canvas.width / 2) * 0.02,
          -(y - canvas.height / 2) * 0.02,
          0
        );
        
        textPoints.push(point);
      }
    }
  }
  
  // Update particle target positions
  const geometry = particleSystem.geometry;
  const positions = geometry.attributes.position.array;
  const targetPositions = geometry.userData.targetPositions;
  const randomValues = geometry.userData.randomValues;
  const particleCount = positions.length / 3;
  
  // Assign particles to text points or random positions
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    if (i < textPoints.length) {
      // Assign to text point
      targetPositions[i3] = textPoints[i].x;
      targetPositions[i3 + 1] = textPoints[i].y;
      targetPositions[i3 + 2] = textPoints[i].z;
    } else {
      // Random position outside text
      const radius = 10 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      targetPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      targetPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      targetPositions[i3 + 2] = radius * Math.cos(phi);
    }
  }
  
  // Animate particles to new positions
  gsap.to(particleSystem.rotation, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1.5,
    ease: 'power3.inOut'
  });
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
      trigger: '#research',
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        if (!animationFrame) {
          animate();
          // Morph to first keyword after a delay
          setTimeout(() => {
            morphParticles(0);
          }, 500);
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
  
  // Update particles
  if (particleSystem) {
    const time = performance.now() * 0.001;
    particleSystem.material.uniforms.time.value = time;
    
    const positions = particleSystem.geometry.attributes.position.array;
    const targetPositions = particleSystem.geometry.userData.targetPositions;
    const randomValues = particleSystem.geometry.userData.randomValues;
    const particleCount = positions.length / 3;
    
    // Update particle positions (move towards target)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Interpolate towards target position
      positions[i3] += (targetPositions[i3] - positions[i3]) * 0.02;
      positions[i3 + 1] += (targetPositions[i3 + 1] - positions[i3 + 1]) * 0.02;
      positions[i3 + 2] += (targetPositions[i3 + 2] - positions[i3 + 2]) * 0.02;
      
      // Add subtle movement
      positions[i3] += Math.sin(time + randomValues[i] * 100) * 0.01;
      positions[i3 + 1] += Math.cos(time + randomValues[i] * 100) * 0.01;
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Slowly rotate particle system
    particleSystem.rotation.y += 0.001;
  }
  
  // Render scene
  renderer.render(scene, camera);
}

// Setup research stats counter animation
function setupResearchStatsCounter() {
  const researchStats = document.querySelectorAll('.research-stat .stat-number');
  
  researchStats.forEach(stat => {
    const text = stat.textContent;
    let target;
    
    if (text.includes('$')) {
      target = 2.5; // $2.5M
    } else if (text.includes('+')) {
      target = 25; // 25+
    } else {
      target = 15; // 15
    }
    
    gsap.to(stat, {
      scrollTrigger: {
        trigger: '.research-stats',
        start: 'top 80%',
        onEnter: () => {
          if (text.includes('$')) {
            gsap.to({ val: 0 }, {
              val: target,
              duration: 2.5,
              ease: 'power2.out',
              onUpdate: function() {
                stat.textContent = `$${this.targets()[0].val.toFixed(1)}M`;
              }
            });
          } else if (text.includes('+')) {
            gsap.to({ val: 0 }, {
              val: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: function() {
                stat.textContent = `${Math.floor(this.targets()[0].val)}+`;
              }
            });
          } else {
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
      }
    });
  });
}
