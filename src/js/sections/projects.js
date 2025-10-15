import { gsap } from 'gsap';
import { createDecryptedText } from '../utils/decryptedText.js';

// Projects data
const projectsData = [
  {
    id: 'project1',
    title: 'Neural Network Visualizer',
    student: 'Alex Chen',
    description: 'Interactive 3D visualization of neural networks with real-time training visualization.',
    image: 'project1.jpg',
    tags: ['AI', 'Visualization', 'JavaScript']
  },
  {
    id: 'project2',
    title: 'Quantum Algorithm Simulator',
    student: 'Maya Patel',
    description: 'A simulator for quantum algorithms with visual representation of qubits and gates.',
    image: 'project2.jpg',
    tags: ['Quantum Computing', 'Simulation', 'Python']
  },
  {
    id: 'project3',
    title: 'Augmented Reality Campus Tour',
    student: 'Jordan Lee',
    description: 'AR application that provides an interactive tour of the university campus with information overlays.',
    image: 'project3.jpg',
    tags: ['AR', 'Mobile', 'Unity']
  },
  {
    id: 'project4',
    title: 'Blockchain-based Academic Credentials',
    student: 'Sophia Rodriguez',
    description: 'A secure system for storing and verifying academic credentials using blockchain technology.',
    image: 'project4.jpg',
    tags: ['Blockchain', 'Security', 'Solidity']
  },
  {
    id: 'project5',
    title: 'Smart Traffic Management System',
    student: 'Omar Hassan',
    description: 'AI-powered traffic management system that optimizes traffic flow using computer vision.',
    image: 'project5.jpg',
    tags: ['Computer Vision', 'IoT', 'Python']
  },
  {
    id: 'project6',
    title: 'Virtual Reality Chemistry Lab',
    student: 'Emma Wilson',
    description: 'VR application that simulates a chemistry laboratory for safe and immersive experimentation.',
    image: 'project6.jpg',
    tags: ['VR', 'Education', 'Unity']
  }
];

// Initialize projects section
export async function initProjectsSection() {
  const projectsGrid = document.getElementById('projects-grid');
  
  // Initialize decrypted text on heading
  const projectsHeading = document.querySelector('#projects h2');
  if (projectsHeading) {
    createDecryptedText(projectsHeading, {
      speed: 30,
      maxIterations: 15,
      sequential: true,
      revealDirection: 'start',
      animateOn: 'view'
    });
  }
  
  // Create project cards
  projectsData.forEach(project => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });
  
  // Set up card interactions
  setupCardInteractions();
}

// Create project card
function createProjectCard(project) {
  // Create card element
  const cardElement = document.createElement('div');
  cardElement.className = 'project-card';
  cardElement.dataset.id = project.id;
  cardElement.style.backgroundImage = `url('/src/assets/images/${project.image}')`;
  cardElement.style.backgroundSize = 'cover';
  cardElement.style.backgroundPosition = 'center';
  
  // Create project info
  const infoElement = document.createElement('div');
  infoElement.className = 'project-info';
  
  infoElement.innerHTML = `
    <h3>${project.title}</h3>
    <p class="student">By ${project.student}</p>
    <div class="tags">
      ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
  `;
  
  // Add elements to card
  cardElement.appendChild(infoElement);
  
  return cardElement;
}

// Set up card interactions
function setupCardInteractions() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // Hover effect
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        boxShadow: '0 15px 30px rgba(0, 243, 255, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Show more info
      const info = card.querySelector('.project-info');
      gsap.to(info, {
        y: -10,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: '0 5px 15px rgba(0, 243, 255, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Hide info
      const info = card.querySelector('.project-info');
      gsap.to(info, {
        y: 0,
        opacity: 0.8,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    // Click to show modal
    card.addEventListener('click', () => {
      const projectId = card.dataset.id;
      const project = projectsData.find(p => p.id === projectId);
      
      if (project) {
        showProjectModal(project);
      }
    });
  });
}

// Show project modal
function showProjectModal(project) {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'project-modal-container';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'project-modal-content';
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${project.title}</h2>
      <button class="close-modal-btn">×</button>
    </div>
    <div class="modal-body">
      <div class="modal-image" style="background-image: url('/src/assets/images/${project.image}')"></div>
      <div class="modal-details">
        <p class="student"><strong>Student:</strong> ${project.student}</p>
        <p class="description">${project.description}</p>
        <div class="tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Add modal to container
  modalContainer.appendChild(modalContent);
  
  // Add modal to body
  document.body.appendChild(modalContainer);
  
  // Add modal styles
  const style = document.createElement('style');
  style.textContent = `
    .project-modal-container {
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
    
    .project-modal-content {
      width: 80%;
      max-width: 900px;
      max-height: 80vh;
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
      padding: 1.5rem;
      overflow-y: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .modal-image {
      width: 100%;
      height: 300px;
      background-size: cover;
      background-position: center;
      border-radius: 5px;
    }
    
    .modal-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .student {
      font-family: var(--font-primary);
      color: var(--color-neon-blue);
    }
    
    .description {
      line-height: 1.6;
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .tag {
      background: rgba(0, 243, 255, 0.2);
      color: var(--color-neon-blue);
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
    }
    
    @media (max-width: 768px) {
      .modal-body {
        grid-template-columns: 1fr;
      }
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
