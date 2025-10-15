import { gsap } from 'gsap';
import { createPixelBlast } from '../utils/pixelBlast.js';

let pixelBlastInstance = null;

export function initHeroSection() {
  const container = document.getElementById("container");
  if (!container) {
    console.warn('Hero container not found');
    return;
  }

  console.log('Initializing PixelBlast...');

  // Create PixelBlast background with liquid effect
  pixelBlastInstance = createPixelBlast(container, {
    variant: 'circle',
    pixelSize: 6,
    color: '#00f3ff',
    patternScale: 3,
    patternDensity: 1.2,
    pixelSizeJitter: 0.5,
    enableRipples: true,
    rippleSpeed: 0.4,
    rippleThickness: 0.12,
    rippleIntensityScale: 1.5,
    liquid: true,
    liquidStrength: 0.12,
    liquidRadius: 1.2,
    liquidWobbleSpeed: 5,
    speed: 0.6,
    edgeFade: 0.25,
    transparent: true
  });
  
  console.log('PixelBlast initialized successfully');
  
  // Initialize text animation
  setTimeout(() => {
    initTextAnimation();
  }, 100);
  
  // Email functionality
  setupEmailCopy();
}

function initTextAnimation() {
  // Animate hero heading and text
  const heroHeading = document.querySelector('.hero h1');
  const heroSubtext = document.querySelector('.hero h2');
  const logoText = document.querySelector('#logo-text');
  const contactInfo = document.querySelector('.contact-info');
  const footerLinks = document.querySelector('.footer-links');
  
  // Immediately show all text elements with fade-in
  if (heroHeading) {
    gsap.to(heroHeading, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.3,
      ease: "power3.out"
    });
  }
  
  if (heroSubtext) {
    gsap.to(heroSubtext, {
      opacity: 0.7,
      duration: 1,
      delay: 0.8,
      ease: "power2.out"
    });
  }
  
  if (logoText) {
    gsap.to(logoText, {
      opacity: 1,
      duration: 1,
      delay: 0.2,
      ease: "power2.out"
    });
  }
  
  if (contactInfo) {
    gsap.to(contactInfo, {
      opacity: 1,
      x: 0,
      duration: 1,
      delay: 1,
      ease: "power2.out"
    });
  }
  
  if (footerLinks) {
    gsap.to(footerLinks, {
      opacity: 1,
      x: 0,
      duration: 1,
      delay: 1.2,
      ease: "power2.out"
    });
  }
}

function setupEmailCopy() {
  const emailLink = document.querySelector(".contact-email");
  if (emailLink) {
    const originalText = emailLink.textContent;
    emailLink.addEventListener("click", function (e) {
      e.preventDefault();
      navigator.clipboard
        .writeText("info@cosmiccs.edu")
        .then(() => {
          emailLink.textContent = "copied to clipboard";
          setTimeout(() => {
            emailLink.textContent = originalText;
          }, 2000);
        })
        .catch(() => {
          window.location.href = "mailto:info@cosmiccs.edu";
        });
    });
  }
}

