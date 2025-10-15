import { gsap } from 'gsap';

// Alternative to GSAP SplitText (free version)
export function animateTextReveal(element, options = {}) {
  const {
    delay = 0.5,
    duration = 0.8,
    stagger = 0.15,
    ease = "expo.out"
  } = options;

  if (!element) return;

  const text = element.textContent;
  const words = text.split(' ');
  
  // Clear original text
  element.innerHTML = '';
  
  // Create word spans
  const wordSpans = words.map(word => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'hidden';
    wordSpan.style.verticalAlign = 'top';
    wordSpan.style.marginRight = '0.25em';
    
    const innerSpan = document.createElement('span');
    innerSpan.textContent = word;
    innerSpan.style.display = 'inline-block';
    innerSpan.style.willChange = 'transform';
    
    wordSpan.appendChild(innerSpan);
    element.appendChild(wordSpan);
    
    return innerSpan;
  });
  
  // Animate words
  gsap.set(element, { opacity: 1 });
  gsap.from(wordSpans, {
    duration: duration,
    yPercent: 100,
    opacity: 0,
    stagger: stagger,
    ease: ease,
    delay: delay
  });
}

