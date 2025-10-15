import * as THREE from 'three';
import { gsap } from 'gsap';
import glowTextureURL from '../../assets/images/glow.js';

// Achievements data
const achievementsData = [
  {
    year: 2018,
    title: 'Department Founding',
    description: 'The Computer Science Department was established with a focus on cutting-edge research and education.',
    icon: 'founding.svg'
  },
  {
    year: 2019,
    title: 'Research Excellence Award',
    description: 'Received the National Research Excellence Award for breakthroughs in quantum computing algorithms.',
    icon: 'award.svg'
  },
  {
    year: 2020,
    title: 'Industry Partnership Program',
    description: 'Launched a comprehensive industry partnership program with leading tech companies.',
    icon: 'partnership.svg'
  },
  {
    year: 2021,
    title: 'AI Research Center',
    description: 'Established a dedicated Artificial Intelligence Research Center with state-of-the-art facilities.',
    icon: 'ai.svg'
  },
  {
    year: 2022,
    title: 'Global Recognition',
    description: 'Ranked among the top 20 Computer Science departments globally by QS World University Rankings.',
    icon: 'global.svg'
  },
  {
    year: 2023,
    title: 'Innovation Hub',
    description: 'Opened the Innovation Hub, a collaborative space for students and faculty to develop cutting-edge projects.',
    icon: 'innovation.svg'
  },
  {
    year: 2024,
    title: 'Quantum Computing Lab',
    description: 'Inaugurated a dedicated Quantum Computing Laboratory with the latest quantum processors.',
    icon: 'quantum.svg'
  },
  {
    year: 2025,
    title: 'CS Universe Launch',
    description: 'Launched the Cosmic CS Universe platform, revolutionizing how students interact with the department.',
    icon: 'universe.svg'
  }
];

// Achievements section variables
let scene, camera, renderer;
let timeline;
let container;
let animationFrame;
let raycaster, mouse;
let hoveredSphere = null;

// Initialize achievements section
export async function initAchievementsSection(loadingManager) {
  container = document.getElementById('timeline-container');
  
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
  
  // Create raycaster for interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0x00f3ff, 2, 50);
  pointLight1.position.set(10, 5, 10);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0x7b2ff7, 2, 50);
  pointLight2.position.set(-10, -5, 10);
  scene.add(pointLight2);
  
  // Create timeline
  await createTimeline(loadingManager);
  
  // Add event listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('app-resize', onWindowResize);
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('click', onClick);
  
  // Set up scroll trigger
  setupScrollTrigger();
  
  // Start animation
  animate();
}

// Create 3D timeline
async function createTimeline(loadingManager) {
  // Create timeline group
  timeline = new THREE.Group();
  scene.add(timeline);
  
  // Create connecting line
  const lineGeometry = new THREE.BufferGeometry();
  const linePoints = [];
  
  // Calculate timeline width based on number of achievements
  const timelineWidth = achievementsData.length * 2.5;
  const startX = -timelineWidth / 2;
  
  // Create points for line
  for (let i = 0; i < achievementsData.length; i++) {
    const x = startX + i * 2.5;
    linePoints.push(new THREE.Vector3(x, 0, 0));
  }
  
  lineGeometry.setFromPoints(linePoints);
  
  // Create line material
  const lineMaterial = new THREE.LineDashedMaterial({
    color: 0x00f3ff,
    dashSize: 0.5,
    gapSize: 0.2,
    linewidth: 1
  });
  
  // Create line
  const line = new THREE.Line(lineGeometry, lineMaterial);
  line.computeLineDistances();
  timeline.add(line);
  
  // Create spheres for each achievement
  const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  
  // Load glow texture
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const glowTexture = await textureLoader.loadAsync(glowTextureURL);
  
  // Create achievements
  achievementsData.forEach((achievement, index) => {
    // Calculate position
    const x = startX + index * 2.5;
    
    // Create sphere material
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f3ff,
      emissive: 0x00f3ff,
      emissiveIntensity: 0.5,
      shininess: 100
    });
    
    // Create sphere
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(x, 0, 0);
    sphere.userData = { achievement, index };
    timeline.add(sphere);
    
    // Create year text
    const yearDiv = document.createElement('div');
    yearDiv.className = 'timeline-year';
    yearDiv.textContent = achievement.year;
    yearDiv.style.position = 'absolute';
    yearDiv.style.color = '#00f3ff';
    yearDiv.style.fontFamily = 'var(--font-primary)';
    yearDiv.style.fontSize = '1rem';
    yearDiv.style.fontWeight = 'bold';
    yearDiv.style.textAlign = 'center';
    yearDiv.style.width = '100px';
    yearDiv.style.left = '0';
    yearDiv.style.top = '0';
    yearDiv.style.transform = 'translate(-50%, -50%)';
    yearDiv.style.pointerEvents = 'none';
    container.appendChild(yearDiv);
    
    // Store reference to DOM element
    sphere.userData.yearElement = yearDiv;
    
    // Create glow sprite
    const spriteMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x00f3ff,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 2, 1);
    sphere.add(sprite);
  });
}

// Handle mouse move for interaction
function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// Handle click on timeline elements
function onClick() {
  if (hoveredSphere) {
    const achievement = hoveredSphere.userData.achievement;
    showAchievementModal(achievement);
  }
}

// Show achievement modal
function showAchievementModal(achievement) {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'achievement-modal-container';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'achievement-modal-content';
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${achievement.title}</h2>
      <button class="close-modal-btn">×</button>
    </div>
    <div class="modal-body">
      <div class="achievement-year">${achievement.year}</div>
      <div class="achievement-icon">
        <img src="/src/assets/images/${achievement.icon}" alt="${achievement.title}">
      </div>
      <p class="achievement-description">${achievement.description}</p>
    </div>
  `;
  
  // Add modal to container
  modalContainer.appendChild(modalContent);
  
  // Add modal to body
  document.body.appendChild(modalContainer);
  
  // Add modal styles
  const style = document.createElement('style');
  style.textContent = `
    .achievement-modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(5, 7, 20, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
    }
    
    .achievement-modal-content {
      width: 80%;
      max-width: 600px;
      background: rgba(5, 7, 20, 0.9);
      border: 1px solid rgba(0, 243, 255, 0.3);
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transform: scale(0.9);
    }
    
    .modal-header {
      padding: 1.5rem;
      background: linear-gradient(90deg, var(--color-neon-blue), var(--color-cyber-purple));
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h2 {
      margin: 0;
      color: var(--color-text-light);
    }
    
    .close-modal-btn {
      background: none;
      border: none;
      color: var(--color-text-light);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
    }
    
    .modal-body {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    
    .achievement-year {
      font-family: var(--font-primary);
      font-size: 2rem;
      font-weight: bold;
      color: var(--color-neon-blue);
    }
    
    .achievement-icon {
      width: 80px;
      height: 80px;
    }
    
    .achievement-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .achievement-description {
      text-align: center;
      line-height: 1.6;
    }
  `;
  
  document.head.appendChild(style);
  
  // Animate modal in
  gsap.to(modalContainer, {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out'
  });
  
  gsap.to(modalContent, {
    scale: 1,
    duration: 0.5,
    ease: 'back.out(1.7)'
  });
  
  // Close modal function
  const closeModal = () => {
    gsap.to(modalContainer, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        modalContainer.remove();
        style.remove();
      }
    });
    
    gsap.to(modalContent, {
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in'
    });
  };
  
  // Add close button event
  const closeBtn = modalContent.querySelector('.close-modal-btn');
  closeBtn.addEventListener('click', closeModal);
  
  // Close on background click
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  }, { once: true });
}

// Handle window resize
function onWindowResize() {
  if (!container) return;
  
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Set up scroll trigger
function setupScrollTrigger() {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#achievements',
      start: 'top 80%',
      end: 'bottom 20%',
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
  
  // Animate timeline in
  gsap.from(timeline.position, {
    y: -10,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#achievements',
      start: 'top 80%'
    }
  });
}

// Animation loop
function animate() {
  animationFrame = requestAnimationFrame(animate);
  
  // Update raycaster
  raycaster.setFromCamera(mouse, camera);
  
  // Check for intersections with timeline spheres
  const intersects = raycaster.intersectObjects(timeline.children.filter(child => child.type === 'Mesh'));
  
  // Reset previously hovered sphere
  if (hoveredSphere && (!intersects.length || intersects[0].object !== hoveredSphere)) {
    gsap.to(hoveredSphere.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.3
    });
    
    gsap.to(hoveredSphere.material, {
      emissiveIntensity: 0.5,
      duration: 0.3
    });
    
    document.body.style.cursor = 'default';
    hoveredSphere = null;
  }
  
  // Handle new hover
  if (intersects.length && intersects[0].object !== hoveredSphere) {
    hoveredSphere = intersects[0].object;
    
    gsap.to(hoveredSphere.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.3
    });
    
    gsap.to(hoveredSphere.material, {
      emissiveIntensity: 1,
      duration: 0.3
    });
    
    document.body.style.cursor = 'pointer';
  }
  
  // Update year elements positions
  if (timeline) {
    timeline.children.forEach(child => {
      if (child.type === 'Mesh' && child.userData.yearElement) {
        // Convert 3D position to screen position
        const position = child.position.clone();
        position.project(camera);
        
        // Convert to CSS coordinates
        const x = (position.x * 0.5 + 0.5) * container.clientWidth;
        const y = (-(position.y * 0.5) + 0.5) * container.clientHeight + 30; // Offset below sphere
        
        // Update DOM element position
        child.userData.yearElement.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }
  
  // Gentle floating animation for timeline
  if (timeline) {
    timeline.position.y = Math.sin(performance.now() * 0.001) * 0.2;
  }
  
  // Render scene
  renderer.render(scene, camera);
}
