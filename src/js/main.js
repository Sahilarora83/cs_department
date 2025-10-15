import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Import other modules
import { initHeroSection } from './sections/hero-pixelblast.js';
import { initAboutSection } from './sections/about.js';
import { initCoursesSection } from './sections/courses.js';
import { initFacultySection } from './sections/faculty.js';
import { initResearchSection } from './sections/research.js';
import { initProjectsSection } from './sections/projects.js';
import { initGallerySection } from './sections/gallery.js';
import { initContactSection } from './sections/contact.js';
import { initAIAssistant } from './components/aiAssistant.js';
import { initStaggeredMenu } from './components/staggeredMenu.js';

// Global variables
let loadingManager;
let loadingProgress = 0;
const totalAssets = 10; // Adjust based on actual asset count

// Initialize loading manager
function initLoadingManager() {
  loadingManager = new THREE.LoadingManager();
  
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    loadingProgress = itemsLoaded / totalAssets;
    updateLoadingScreen(loadingProgress);
  };
  
  loadingManager.onLoad = () => {
    completeLoading();
  };
  
  loadingManager.onError = (url) => {
    console.error('Error loading asset:', url);
  };
}

// This function has been replaced by direct updates in startManualLoadingAnimation

// Initialize all content
function initializeContent() {
  // Initialize all sections
  Promise.all([
    initHeroSection(),
    initAboutSection(loadingManager),
    initCoursesSection(),
    initFacultySection(loadingManager),
    initResearchSection(loadingManager),
    initProjectsSection(),
    initGallerySection(),
    initContactSection(),
    initAIAssistant()
  ]).then(() => {
    // Initialize site animations
    initSiteAnimations();
    
    // Add fast fade-in animation for all sections
    animateSectionsIn();
  }).catch(error => {
    console.error("Error initializing content:", error);
  });
}

// Fast animation for sections to appear
function animateSectionsIn() {
  const sections = document.querySelectorAll('.section');
  
  gsap.fromTo(sections, 
    { 
      opacity: 0, 
      y: 30 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      stagger: 0.1, 
      ease: 'power2.out' 
    }
  );
}

// Initialize site animations after loading
function initSiteAnimations() {
  // Initialize scroll animations
  initScrollAnimations();
}

// Initialize scroll-based animations
function initScrollAnimations() {
  // About section - Parallax
  gsap.to('#about h2', {
    y: 150,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  // About hero image parallax
  gsap.to('.about-hero-image img', {
    y: -150,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-hero',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  // About cards parallax
  gsap.utils.toArray('.about-card').forEach((card, i) => {
    const speed = 0.5 + (i % 3) * 0.3;
    gsap.to(card, {
      y: -60 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
    
    // Card images parallax
    const img = card.querySelector('.about-card-image img');
    if (img) {
      gsap.to(img, {
        y: -80,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  });
  
  // Stats counter parallax
  gsap.to('.about-stats', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-stats',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    }
  });
  
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.about-panel', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
      });
    }
  });
  
  // Courses section - Parallax
  gsap.to('#courses h2', {
    y: 120,
    ease: 'none',
    scrollTrigger: {
      trigger: '#courses',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  ScrollTrigger.create({
    trigger: '#courses',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.course-card', {
        scale: 0.8,
        opacity: 0,
        y: 80,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });
    }
  });
  
  // Course cards parallax on scroll
  gsap.utils.toArray('.course-card').forEach((card, i) => {
    const speed = 1 + (i % 3) * 0.5;
    gsap.to(card, {
      y: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '#courses',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  });
  
  // Faculty section - Parallax
  gsap.to('#faculty h2', {
    y: 100,
    ease: 'none',
    scrollTrigger: {
      trigger: '#faculty',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  gsap.to('.faculty-carousel', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#faculty',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    }
  });
  
  gsap.to('.carousel-hint', {
    y: -150,
    opacity: 0.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#faculty',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  // Research section - Parallax
  gsap.to('#research h2', {
    y: 150,
    ease: 'none',
    scrollTrigger: {
      trigger: '#research',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  // Research hero parallax
  gsap.to('.research-hero-image img', {
    y: -120,
    ease: 'none',
    scrollTrigger: {
      trigger: '.research-hero',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  // Research cards parallax
  gsap.utils.toArray('.research-card').forEach((card, i) => {
    const speed = 0.3 + (i % 4) * 0.2;
    gsap.to(card, {
      y: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '#research',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
    
    // Card images parallax
    const img = card.querySelector('.research-card-image img');
    if (img) {
      gsap.to(img, {
        y: -60,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  });
  
  // Innovation items parallax
  gsap.utils.toArray('.innovation-item').forEach((item, i) => {
    gsap.to(item, {
      y: -30 * (i % 2 === 0 ? 1 : -1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.innovations-showcase',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  });
  
  gsap.to('.research-areas', {
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '#research',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 3
    }
  });
  
  // Projects section - Parallax
  gsap.to('#projects h2', {
    y: 150,
    ease: 'none',
    scrollTrigger: {
      trigger: '#projects',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  // Projects hero parallax
  gsap.to('.projects-hero-image img', {
    y: -120,
    ease: 'none',
    scrollTrigger: {
      trigger: '.projects-hero',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  // Project cards parallax
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    const speed = 0.3 + (i % 3) * 0.2;
    gsap.to(card, {
      y: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
    
    // Card images parallax
    const img = card.querySelector('.project-card-image img');
    if (img) {
      gsap.to(img, {
        y: -60,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  });
  
  ScrollTrigger.create({
    trigger: '#projects',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.project-card', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }
  });
  
  // Project cards parallax
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.to(card, {
      y: -40 - (i % 2) * 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  });
  
  // Gallery header section - Parallax
  gsap.to('.gallery-header-section h2', {
    y: 150,
    ease: 'none',
    scrollTrigger: {
      trigger: '.gallery-header-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  // Gallery section - Parallax
  gsap.to('#gallery .overlay', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  gsap.to('#gallery .slider-wrap', {
    y: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    }
  });
  
  // Contact section - Parallax
  gsap.to('#contact h2', {
    y: 90,
    ease: 'none',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });
  
  gsap.to('.contact-form-container', {
    y: -70,
    ease: 'none',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    }
  });
  
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 80%',
    onEnter: () => {
      gsap.from('.contact-form-container', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    }
  });
  
  // Footer parallax
  gsap.to('#footer', {
    y: -100,
    ease: 'none',
    scrollTrigger: {
      trigger: '#footer',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1
    }
  });
}

// Initialize AI Assistant
function setupAIAssistant() {
  const assistantIcon = document.querySelector('.ai-assistant-icon');
  const assistantWindow = document.querySelector('.ai-assistant-window');
  const closeBtn = document.querySelector('.close-btn');
  
  assistantIcon.addEventListener('click', () => {
    assistantWindow.style.display = 'flex';
    gsap.from(assistantWindow, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
  });
  
  closeBtn.addEventListener('click', () => {
    gsap.to(assistantWindow, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        assistantWindow.style.display = 'none';
      }
    });
  });
}

// Initialize staggered menu
function initNavigation() {
  const menuConfig = {
    position: 'right',
    colors: ['#00f3ff', '#7b2ff7'],
    items: [
      { label: 'Home', ariaLabel: 'Go to home page', link: '#hero' },
      { label: 'About', ariaLabel: 'Learn about us', link: '#about' },
      { label: 'Courses', ariaLabel: 'View our courses', link: '#courses' },
      { label: 'Faculty', ariaLabel: 'Meet our faculty', link: '#faculty' },
      { label: 'Research', ariaLabel: 'View research', link: '#research' },
      { label: 'Projects', ariaLabel: 'Student projects', link: '#projects' },
      { label: 'Gallery', ariaLabel: 'View gallery', link: '#gallery' },
      { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
    ],
    socialItems: [
      { label: 'Twitter', link: 'https://twitter.com' },
      { label: 'GitHub', link: 'https://github.com' },
      { label: 'LinkedIn', link: 'https://linkedin.com' },
      { label: 'YouTube', link: 'https://youtube.com' }
    ],
    displaySocials: true,
    displayItemNumbering: true,
    logoText: 'Cosmic CS',
    menuButtonColor: '#fff',
    openMenuButtonColor: '#fff',
    accentColor: '#00f3ff',
    changeMenuColorOnOpen: true,
    isFixed: true,
    onMenuOpen: () => console.log('Menu opened'),
    onMenuClose: () => console.log('Menu closed')
  };
  
  initStaggeredMenu(menuConfig);
  
  // Hero section footer links smooth scroll
  const heroFooterLinks = document.querySelectorAll('.footer-link');
  heroFooterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialize the application
function init() {
  // Initialize loading manager first
  initLoadingManager();
  
  // Setup Navigation
  initNavigation();
  
  // Setup AI Assistant
  setupAIAssistant();
  
  // Start the loading animation (which will handle showing content when done)
  setTimeout(() => {
    startManualLoadingAnimation();
  }, 100); // Small delay to ensure DOM is ready
}

// Start manual loading animation that goes from 0% to 100%
function startManualLoadingAnimation() {
  console.log("Starting loading animation...");
  
  // Get the elements
  const percentageElement = document.querySelector('.loading-percentage');
  const progressBarElement = document.querySelector('.loading-progress-bar');
  const loadingScreen = document.getElementById('loading-screen');
  
  // Check if elements exist
  if (!percentageElement || !progressBarElement || !loadingScreen) {
    console.error("Loading screen elements not found!");
    return;
  }
  
  let progress = 0;
  
  // Create a simple animation loop with setInterval
  const interval = setInterval(() => {
    progress += 4; // Increase by 4% each time for faster loading
    
    console.log("Progress:", progress + "%");
    
    if (progress <= 100) {
      // Update the loading screen
      percentageElement.textContent = `${progress}%`;
      progressBarElement.style.width = `${progress}%`;
    } else {
      // Clear the interval when we reach 100%
      clearInterval(interval);
      
      console.log("Loading complete, showing content...");
      
      // Complete the loading process
      loadingScreen.style.display = 'none';
      
      // Initialize content immediately
      initializeContent();
      
      // Play fast page transition
      playPageTransition();
    }
  }, 30); // Update every 30ms for faster loading
}

// Start the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Content Loaded, starting init...");
  init();
});

// Page transition animation
function playPageTransition() {
  const curtains = gsap.utils.toArray('.transition-curtain');
  
  // Fast animate curtains down then up
  gsap.timeline()
    .to(curtains, {
      y: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.inOut'
    })
    .to(curtains, {
      y: '100%',
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.inOut'
    }, '+=0.1');
}

// Handle window resize
window.addEventListener('resize', () => {
  // Dispatch resize event for all sections to handle
  window.dispatchEvent(new CustomEvent('app-resize'));
});
