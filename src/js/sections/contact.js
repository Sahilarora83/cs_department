import { gsap } from 'gsap';
import { createDecryptedText } from '../utils/decryptedText.js';

// Initialize contact section
export async function initContactSection() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  
  // Initialize decrypted text on heading
  const contactHeading = document.querySelector('#contact h2');
  if (contactHeading) {
    createDecryptedText(contactHeading, {
      speed: 30,
      maxIterations: 15,
      sequential: true,
      revealDirection: 'start',
      animateOn: 'view'
    });
  }
  
  // Set up form submission
  setupFormSubmission(contactForm, submitBtn);
  
  // Set up button animation
  setupButtonAnimation(submitBtn);
  
  // Set up gradient blobs
  setupGradientBlobs();
}

// Set up form submission
function setupFormSubmission(form, submitBtn) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const formDataObj = {};
    
    for (const [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="loading-spinner"></span>
      Sending...
    `;
    
    try {
      // Simulate API call (replace with actual API call in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      showFormMessage('success', 'Message sent successfully!');
      
      // Reset form
      form.reset();
    } catch (error) {
      // Show error message
      showFormMessage('error', 'Failed to send message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message';
    }
  });
}

// Show form message
function showFormMessage(type, message) {
  // Remove existing message
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `form-message ${type}`;
  messageElement.textContent = message;
  
  // Add to form
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(messageElement, form.nextSibling);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .form-message {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 5px;
      font-family: var(--font-secondary);
      animation: fadeIn 0.3s ease-out;
    }
    
    .form-message.success {
      background: rgba(0, 255, 128, 0.1);
      border: 1px solid rgba(0, 255, 128, 0.3);
      color: #00ff80;
    }
    
    .form-message.error {
      background: rgba(255, 0, 128, 0.1);
      border: 1px solid rgba(255, 0, 128, 0.3);
      color: #ff0080;
    }
    
    .loading-spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
      margin-right: 0.5rem;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  
  document.head.appendChild(style);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    gsap.to(messageElement, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      onComplete: () => {
        messageElement.remove();
        style.remove();
      }
    });
  }, 5000);
}

// Set up button animation
function setupButtonAnimation(button) {
  // Add hover effect
  button.addEventListener('mouseenter', () => {
    gsap.to(button, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
      background: 'linear-gradient(135deg, #7b2ff7, #00f3ff)'
    });
  });
  
  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      background: 'linear-gradient(135deg, #00f3ff, #7b2ff7)'
    });
  });
  
  // Add click effect
  button.addEventListener('mousedown', () => {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1
    });
  });
  
  button.addEventListener('mouseup', () => {
    gsap.to(button, {
      scale: 1.05,
      duration: 0.1
    });
  });
}

// Set up gradient blobs
function setupGradientBlobs() {
  const contactSection = document.getElementById('contact');
  
  // Create blobs container
  const blobsContainer = document.createElement('div');
  blobsContainer.className = 'gradient-blobs';
  contactSection.appendChild(blobsContainer);
  
  // Create blobs
  const blobCount = 3;
  
  for (let i = 0; i < blobCount; i++) {
    const blob = document.createElement('div');
    blob.className = 'gradient-blob';
    blobsContainer.appendChild(blob);
    
    // Set random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Set random size
    const size = 100 + Math.random() * 200;
    
    // Set random colors
    const hue1 = 180 + Math.random() * 60; // Blue range
    const hue2 = 270 + Math.random() * 30; // Purple range
    
    // Apply styles
    blob.style.left = `${x}%`;
    blob.style.top = `${y}%`;
    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.background = `radial-gradient(circle, hsla(${hue1}, 100%, 50%, 0.2), hsla(${hue2}, 100%, 50%, 0.1))`;
    
    // Animate blob
    gsap.to(blob, {
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      scale: 0.8 + Math.random() * 0.4,
      duration: 10 + Math.random() * 20,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .gradient-blobs {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
      filter: blur(50px);
      opacity: 0.7;
    }
    
    .gradient-blob {
      position: absolute;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  `;
  
  document.head.appendChild(style);
  
  // Add cursor interaction
  contactSection.addEventListener('mousemove', (e) => {
    const blobs = document.querySelectorAll('.gradient-blob');
    const rect = contactSection.getBoundingClientRect();
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    blobs.forEach((blob, index) => {
      // Calculate distance from mouse
      const blobX = parseFloat(blob.style.left) / 100 * rect.width;
      const blobY = parseFloat(blob.style.top) / 100 * rect.height;
      
      const dx = mouseX - blobX;
      const dy = mouseY - blobY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Move blob away from cursor
      if (distance < 300) {
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * (300 - distance) * 0.05;
        const pushY = Math.sin(angle) * (300 - distance) * 0.05;
        
        gsap.to(blob, {
          x: `+=${-pushX}`,
          y: `+=${-pushY}`,
          duration: 1,
          ease: 'power1.out'
        });
      }
    });
  });
}
