export class DecryptedText {
  constructor(element, options = {}) {
    this.element = element;
    this.originalText = element.textContent;
    
    this.config = {
      speed: options.speed || 50,
      maxIterations: options.maxIterations || 10,
      sequential: options.sequential !== undefined ? options.sequential : false,
      revealDirection: options.revealDirection || 'start',
      useOriginalCharsOnly: options.useOriginalCharsOnly || false,
      characters: options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
      animateOn: options.animateOn || 'hover',
      onComplete: options.onComplete || null
    };
    
    this.isScrambling = false;
    this.revealedIndices = new Set();
    this.interval = null;
    this.currentIteration = 0;
    this.hasAnimated = false;
    
    this.init();
  }
  
  init() {
    // Wrap each character in a span
    this.wrapCharacters();
    
    // Setup event listeners based on animateOn
    if (this.config.animateOn === 'hover' || this.config.animateOn === 'both') {
      this.element.addEventListener('mouseenter', () => this.startScramble());
      this.element.addEventListener('mouseleave', () => this.stopScramble());
    }
    
    if (this.config.animateOn === 'view' || this.config.animateOn === 'both') {
      this.setupIntersectionObserver();
    }
    
    // If animateOn is 'load', start immediately
    if (this.config.animateOn === 'load') {
      setTimeout(() => this.startScramble(), 100);
    }
  }
  
  wrapCharacters() {
    const chars = this.originalText.split('');
    this.element.innerHTML = '';
    this.charSpans = [];
    
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'decrypt-char';
      if (char === ' ') {
        span.style.whiteSpace = 'pre';
      }
      this.element.appendChild(span);
      this.charSpans.push(span);
    });
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.startScramble();
            this.hasAnimated = true;
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(this.element);
  }
  
  getNextIndex(revealedSet) {
    const textLength = this.originalText.length;
    
    switch (this.config.revealDirection) {
      case 'start':
        return revealedSet.size;
        
      case 'end':
        return textLength - 1 - revealedSet.size;
        
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(revealedSet.size / 2);
        const nextIndex = revealedSet.size % 2 === 0 
          ? middle + offset 
          : middle - offset - 1;
        
        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex;
        }
        
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return 0;
      }
      
      default:
        return revealedSet.size;
    }
  }
  
  getAvailableChars() {
    if (this.config.useOriginalCharsOnly) {
      return Array.from(new Set(this.originalText.split(''))).filter(char => char !== ' ');
    }
    return this.config.characters.split('');
  }
  
  shuffleText() {
    const availableChars = this.getAvailableChars();
    
    this.charSpans.forEach((span, i) => {
      const char = this.originalText[i];
      
      if (char === ' ') {
        span.textContent = ' ';
        return;
      }
      
      if (this.revealedIndices.has(i)) {
        span.textContent = this.originalText[i];
        span.classList.remove('encrypted');
        span.classList.add('revealed');
      } else {
        span.textContent = availableChars[Math.floor(Math.random() * availableChars.length)];
        span.classList.add('encrypted');
        span.classList.remove('revealed');
      }
    });
  }
  
  startScramble() {
    if (this.isScrambling) return;
    
    this.isScrambling = true;
    this.currentIteration = 0;
    this.revealedIndices.clear();
    
    this.interval = setInterval(() => {
      if (this.config.sequential) {
        if (this.revealedIndices.size < this.originalText.length) {
          const nextIndex = this.getNextIndex(this.revealedIndices);
          this.revealedIndices.add(nextIndex);
          this.shuffleText();
        } else {
          this.completeScramble();
        }
      } else {
        this.shuffleText();
        this.currentIteration++;
        
        if (this.currentIteration >= this.config.maxIterations) {
          this.completeScramble();
        }
      }
    }, this.config.speed);
  }
  
  stopScramble() {
    if (this.config.animateOn === 'view' || this.config.animateOn === 'load') {
      // Don't stop on hover out if it's view/load based
      return;
    }
    
    this.completeScramble();
  }
  
  completeScramble() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    this.isScrambling = false;
    this.revealedIndices.clear();
    
    // Reveal all characters
    this.charSpans.forEach((span, i) => {
      span.textContent = this.originalText[i];
      span.classList.remove('encrypted');
      span.classList.add('revealed');
    });
    
    if (this.config.onComplete) {
      this.config.onComplete();
    }
  }
  
  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.element.textContent = this.originalText;
  }
}

// Factory function for easy initialization
export function createDecryptedText(element, options) {
  return new DecryptedText(element, options);
}

// Batch initialize multiple elements
export function initDecryptedTexts(selector, options) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).map(el => new DecryptedText(el, options));
}

