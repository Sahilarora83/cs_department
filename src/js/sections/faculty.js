import { gsap } from 'gsap';
import { createDecryptedText } from '../utils/decryptedText.js';

// Faculty data - Actual faculty members
const facultyData = [
  {
    name: 'Dr. Reema Thareja',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop'
  },
  {
    name: 'Ms. Aishwarya Anand Arora',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop'
  },
  {
    name: 'Ms. Varsha Agarwal',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop'
  },
  {
    name: 'Dr. Charu Gupta',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop'
  },
  {
    name: 'Ms. Asha Yadav',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop'
  }
];

const nCards = 15; // works best with at least 15 cards (original logic)
const carousel = document.querySelector(".faculty-carousel");
const cardsDiv = document.querySelector(".faculty-cards-wrapper");
const rots = [];
let dir;

// Initialize faculty section
export async function initFacultySection(loadingManager) {
  // Initialize decrypted text on heading
  const facultyHeading = document.querySelector('#faculty h2');
  if (facultyHeading) {
    createDecryptedText(facultyHeading, {
      speed: 30,
      maxIterations: 15,
      sequential: true,
      revealDirection: 'start',
      animateOn: 'view'
    });
  }
  
  if (!carousel || !cardsDiv) {
    console.warn('Faculty carousel elements not found');
    return;
  }

  // Create the cards & rotation positions (ORIGINAL LOGIC)
  for (let i = 0; i < nCards; i++) {
    const card = document.createElement("div");
    cardsDiv.append(card);
    rots.push(gsap.utils.clamp(-90, 90, i * 18 - 90)); // Original formula
    
    // Get faculty data (loop if needed)
    const facultyIndex = i % facultyData.length;
    const faculty = facultyData[facultyIndex];
    
    // Create card content
    const cardContent = `
      <img src="${faculty.image}" alt="${faculty.name}" class="faculty-card-image" onerror="this.src='https://via.placeholder.com/400x500?text=Faculty'">
      <div class="faculty-card-info">
        <div class="faculty-card-name">${faculty.name}</div>
        <div class="faculty-card-designation">${faculty.designation}</div>
        <div class="faculty-card-department">${faculty.department}</div>
      </div>
    `;
    
    gsap.set(card, {
      attr: { class: "faculty-card" },
      innerHTML: cardContent,
      xPercent: -50,
      transformOrigin: "50% 275%",
      rotate: rots[i],
    });
  }

  // Rotate carousel - continuous while mouse pressed
  const delayedMove = gsap.to(window, {
    paused: true,
    repeat: -1,
    onRepeat: move,
    onStart: move,
    duration: 0.15
  });

  function move() {
    if (dir > 0) cardsDiv.append(cardsDiv.firstElementChild);
    else cardsDiv.prepend(cardsDiv.lastElementChild);

    for (let i = 0; i < nCards; i++) {
      const card = cardsDiv.children[i];
      let dur = 0;
      let delay = 0;
      
      if (i > 0 && i < 11) {
        dur = 1.35;
        delay = gsap.utils.interpolate(0, 0.4, dir < 0 ? 1 - i / 10 : i / 10);
        delay = Math.round(delay * 1000) / 1000;
      }

      gsap.to(card, {
        duration: dur,
        delay: delay,
        rotate: rots[i],
        ease: "elastic.out(0.5)"
      });
    }
  }

  // Mouse/pointer controls - works on all screen sizes
  carousel.onpointermove = (e) => {
    dir = e.x < window.innerWidth / 2 ? -1 : 1;
  };

  carousel.onpointerdown = () => delayedMove.play(0);
  carousel.onpointerup = () => delayedMove.pause();

  // Touch events for mobile
  carousel.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    dir = touch.clientX < window.innerWidth / 2 ? -1 : 1;
    delayedMove.play(0);
  });

  carousel.addEventListener('touchend', (e) => {
    e.preventDefault();
    delayedMove.pause();
  });

  carousel.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    dir = touch.clientX < window.innerWidth / 2 ? -1 : 1;
  });
}
