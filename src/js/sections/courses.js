import { gsap } from 'gsap';
import { createDecryptedText } from '../utils/decryptedText.js';

// Courses data
const coursesData = [
  {
    id: 'cs101',
    title: 'Introduction to Computer Science',
    description: 'Fundamental concepts of computer science including algorithms, data structures, and problem-solving strategies.',
    credits: 3,
    level: 'Undergraduate',
    prerequisites: 'None'
  },
  {
    id: 'cs201',
    title: 'Data Structures & Algorithms',
    description: 'Advanced data structures and algorithm design techniques, including analysis of algorithm efficiency.',
    credits: 4,
    level: 'Undergraduate',
    prerequisites: 'CS101'
  },
  {
    id: 'cs301',
    title: 'Artificial Intelligence',
    description: 'Introduction to AI concepts including search algorithms, knowledge representation, machine learning, and neural networks.',
    credits: 4,
    level: 'Undergraduate',
    prerequisites: 'CS201, MATH240'
  },
  {
    id: 'cs401',
    title: 'Computer Graphics',
    description: 'Fundamentals of 2D and 3D computer graphics, including rendering, shading, and animation techniques.',
    credits: 3,
    level: 'Undergraduate',
    prerequisites: 'CS201, MATH220'
  },
  {
    id: 'cs501',
    title: 'Machine Learning',
    description: 'Advanced machine learning algorithms, neural networks, deep learning, and applications in various domains.',
    credits: 4,
    level: 'Graduate',
    prerequisites: 'CS301, MATH340'
  },
  {
    id: 'cs601',
    title: 'Quantum Computing',
    description: 'Introduction to quantum computing principles, quantum algorithms, and quantum information theory.',
    credits: 4,
    level: 'Graduate',
    prerequisites: 'CS501, PHYS340'
  }
];

// Initialize courses section
export async function initCoursesSection() {
  const coursesGrid = document.getElementById('courses-grid');
  
  // Initialize decrypted text on heading
  const coursesHeading = document.querySelector('#courses h2');
  if (coursesHeading) {
    createDecryptedText(coursesHeading, {
      speed: 30,
      maxIterations: 15,
      sequential: true,
      revealDirection: 'start',
      animateOn: 'view'
    });
  }
  
  // Create course cards
  coursesData.forEach(course => {
    const courseCard = createCourseCard(course);
    coursesGrid.appendChild(courseCard);
  });
  
  // Set up card interactions
  setupCardInteractions();
}

// Create course card
function createCourseCard(course) {
  // Create card elements
  const cardElement = document.createElement('div');
  cardElement.className = 'course-card';
  cardElement.dataset.id = course.id;
  
  const cardInner = document.createElement('div');
  cardInner.className = 'course-card-inner';
  
  const cardFront = document.createElement('div');
  cardFront.className = 'course-card-front';
  
  const cardBack = document.createElement('div');
  cardBack.className = 'course-card-back';
  
  // Add content to front
  cardFront.innerHTML = `
    <h3>${course.title}</h3>
    <div class="course-icon">
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <p>${course.level}</p>
  `;
  
  // Add content to back
  cardBack.innerHTML = `
    <h3>${course.title}</h3>
    <p>${course.description}</p>
    <div class="course-details">
      <div class="detail">
        <strong>Credits:</strong> ${course.credits}
      </div>
      <div class="detail">
        <strong>Level:</strong> ${course.level}
      </div>
      <div class="detail">
        <strong>Prerequisites:</strong> ${course.prerequisites}
      </div>
    </div>
  `;
  
  // Assemble card
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  cardElement.appendChild(cardInner);
  
  return cardElement;
}

// Set up card interactions
function setupCardInteractions() {
  const cards = document.querySelectorAll('.course-card');
  
  cards.forEach(card => {
    // Hover effect
    card.addEventListener('mouseenter', (e) => {
      const cardInner = card.querySelector('.course-card-inner');
      
      gsap.to(cardInner, {
        scale: 1.05,
        boxShadow: '0 15px 30px rgba(0, 243, 255, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Tilt effect based on mouse position
      card.addEventListener('mousemove', handleMouseMove);
    });
    
    card.addEventListener('mouseleave', (e) => {
      const cardInner = card.querySelector('.course-card-inner');
      
      gsap.to(cardInner, {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        boxShadow: '0 5px 15px rgba(0, 243, 255, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Remove mousemove event
      card.removeEventListener('mousemove', handleMouseMove);
    });
    
    // Click to flip
    card.addEventListener('click', (e) => {
      const cardInner = card.querySelector('.course-card-inner');
      
      // Check if card is already flipped
      const isFlipped = cardInner.style.transform && cardInner.style.transform.includes('rotateY(180deg)');
      
      if (isFlipped) {
        // Flip back to front
        gsap.to(cardInner, {
          rotationY: 0,
          duration: 0.8,
          ease: 'power3.inOut'
        });
      } else {
        // Flip to back
        gsap.to(cardInner, {
          rotationY: 180,
          duration: 0.8,
          ease: 'power3.inOut'
        });
      }
    });
  });
}

// Handle mouse move for tilt effect
function handleMouseMove(e) {
  const card = e.currentTarget;
  const cardInner = card.querySelector('.course-card-inner');
  const rect = card.getBoundingClientRect();
  
  // Calculate mouse position relative to card center
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  // Calculate rotation values (limit to 10 degrees)
  const rotateX = -y / (rect.height / 2) * 10;
  const rotateY = x / (rect.width / 2) * 10;
  
  // Apply rotation
  gsap.to(cardInner, {
    rotationX: rotateX,
    rotationY: rotateY,
    duration: 0.1,
    ease: 'power1.out'
  });
}
