import { gsap } from 'gsap';

export class StaggeredMenu {
  constructor(config) {
    this.config = {
      position: 'right',
      colors: ['#00f3ff', '#7b2ff7'],
      items: [],
      socialItems: [],
      displaySocials: true,
      displayItemNumbering: true,
      logoUrl: null,
      logoText: 'Cosmic CS',
      menuButtonColor: '#fff',
      openMenuButtonColor: '#fff',
      accentColor: '#00f3ff',
      changeMenuColorOnOpen: true,
      isFixed: true,
      onMenuOpen: null,
      onMenuClose: null,
      ...config
    };
    
    this.open = false;
    this.busy = false;
    this.textLines = ['Menu', 'Close'];
    this.refs = {};
    
    this.init();
  }
  
  init() {
    this.createMarkup();
    this.setupRefs();
    this.setupInitialStates();
    this.setupEventListeners();
  }
  
  createMarkup() {
    const wrapper = document.createElement('div');
    wrapper.className = 'staggered-menu-wrapper';
    if (this.config.isFixed) wrapper.classList.add('fixed-wrapper');
    wrapper.setAttribute('data-position', this.config.position);
    wrapper.style.setProperty('--sm-accent', this.config.accentColor);
    
    // Create prelayers
    const prelayers = this.config.colors.slice(0, 4);
    let arr = [...prelayers];
    if (arr.length >= 3) {
      const mid = Math.floor(arr.length / 2);
      arr.splice(mid, 1);
    }
    
    const prelayersHTML = arr.map(color => 
      `<div class="sm-prelayer" style="background: ${color}"></div>`
    ).join('');
    
    // Create menu items
    const menuItemsHTML = this.config.items.map((item, idx) => `
      <li class="sm-panel-itemWrap">
        <a class="sm-panel-item" href="${item.link}" aria-label="${item.ariaLabel}" data-index="${idx + 1}">
          <span class="sm-panel-itemLabel">${item.label}</span>
        </a>
      </li>
    `).join('');
    
    // Create social items
    const socialsHTML = this.config.displaySocials && this.config.socialItems.length ? `
      <div class="sm-socials">
        <h3 class="sm-socials-title">Socials</h3>
        <ul class="sm-socials-list">
          ${this.config.socialItems.map(social => `
            <li class="sm-socials-item">
              <a href="${social.link}" target="_blank" rel="noopener noreferrer" class="sm-socials-link">
                ${social.label}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';
    
    wrapper.innerHTML = `
      <div class="sm-prelayers" aria-hidden="true">
        ${prelayersHTML}
      </div>
      <header class="staggered-menu-header">
        <div class="sm-logo">
          ${this.config.logoUrl ? 
            `<img src="${this.config.logoUrl}" alt="Logo" class="sm-logo-img" draggable="false">` :
            `<h3 class="sm-logo-text">${this.config.logoText}</h3>`
          }
        </div>
        <button class="sm-toggle" aria-label="Open menu" aria-expanded="false" type="button">
          <span class="sm-toggle-textWrap" aria-hidden="true">
            <span class="sm-toggle-textInner">
              ${this.textLines.map(line => `<span class="sm-toggle-line">${line}</span>`).join('')}
            </span>
          </span>
          <span class="sm-icon" aria-hidden="true">
            <span class="sm-icon-line"></span>
            <span class="sm-icon-line sm-icon-line-v"></span>
          </span>
        </button>
      </header>
      
      <aside class="staggered-menu-panel" aria-hidden="true">
        <div class="sm-panel-inner">
          <ul class="sm-panel-list" ${this.config.displayItemNumbering ? 'data-numbering' : ''}>
            ${menuItemsHTML}
          </ul>
          ${socialsHTML}
        </div>
      </aside>
    `;
    
    document.body.insertBefore(wrapper, document.body.firstChild);
    this.wrapper = wrapper;
  }
  
  setupRefs() {
    this.refs.panel = this.wrapper.querySelector('.staggered-menu-panel');
    this.refs.prelayers = this.wrapper.querySelector('.sm-prelayers');
    this.refs.prelayerEls = Array.from(this.wrapper.querySelectorAll('.sm-prelayer'));
    this.refs.plusH = this.wrapper.querySelector('.sm-icon-line:not(.sm-icon-line-v)');
    this.refs.plusV = this.wrapper.querySelector('.sm-icon-line-v');
    this.refs.icon = this.wrapper.querySelector('.sm-icon');
    this.refs.textInner = this.wrapper.querySelector('.sm-toggle-textInner');
    this.refs.toggleBtn = this.wrapper.querySelector('.sm-toggle');
  }
  
  setupInitialStates() {
    const offscreen = this.config.position === 'left' ? -100 : 100;
    gsap.set([this.refs.panel, ...this.refs.prelayerEls], { xPercent: offscreen });
    gsap.set(this.refs.plusH, { transformOrigin: '50% 50%', rotate: 0 });
    gsap.set(this.refs.plusV, { transformOrigin: '50% 50%', rotate: 90 });
    gsap.set(this.refs.icon, { rotate: 0, transformOrigin: '50% 50%' });
    gsap.set(this.refs.textInner, { yPercent: 0 });
    gsap.set(this.refs.toggleBtn, { color: this.config.menuButtonColor });
  }
  
  setupEventListeners() {
    this.refs.toggleBtn.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking on a link
    const links = this.wrapper.querySelectorAll('.sm-panel-item');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (this.open) this.toggleMenu();
      });
    });
  }
  
  buildOpenTimeline() {
    const panel = this.refs.panel;
    const layers = this.refs.prelayerEls;
    
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
    
    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }
    
    const tl = gsap.timeline({ paused: true });
    
    layers.forEach((layer, i) => {
      tl.to(layer, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });
    
    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + 0.08;
    const panelDuration = 0.65;
    
    tl.to(panel, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);
    
    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(itemEls, {
        yPercent: 0,
        rotate: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.1
      }, itemsStart);
      
      if (numberEls.length) {
        tl.to(numberEls, {
          duration: 0.6,
          ease: 'power2.out',
          '--sm-num-opacity': 1,
          stagger: 0.08
        }, itemsStart + 0.1);
      }
    }
    
    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      }
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.08
        }, socialsStart + 0.04);
      }
    }
    
    return tl;
  }
  
  playOpen() {
    if (this.busy) return;
    this.busy = true;
    
    const tl = this.buildOpenTimeline();
    tl.eventCallback('onComplete', () => {
      this.busy = false;
    });
    tl.play(0);
  }
  
  playClose() {
    const panel = this.refs.panel;
    const layers = this.refs.prelayerEls;
    const all = [...layers, panel];
    const offscreen = this.config.position === 'left' ? -100 : 100;
    
    gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        this.busy = false;
      }
    });
  }
  
  animateIcon(opening) {
    gsap.to(this.refs.icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? 'power4.out' : 'power3.inOut'
    });
  }
  
  animateColor(opening) {
    if (this.config.changeMenuColorOnOpen) {
      const targetColor = opening ? this.config.openMenuButtonColor : this.config.menuButtonColor;
      gsap.to(this.refs.toggleBtn, {
        color: targetColor,
        delay: 0.18,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
  
  animateText(opening) {
    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    
    // Update text lines
    this.refs.textInner.innerHTML = seq.map(line => 
      `<span class="sm-toggle-line">${line}</span>`
    ).join('');
    
    gsap.set(this.refs.textInner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    
    gsap.to(this.refs.textInner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }
  
  toggleMenu() {
    this.open = !this.open;
    this.wrapper.setAttribute('data-open', this.open ? 'true' : '');
    this.refs.panel.setAttribute('aria-hidden', !this.open);
    this.refs.toggleBtn.setAttribute('aria-label', this.open ? 'Close menu' : 'Open menu');
    this.refs.toggleBtn.setAttribute('aria-expanded', this.open);
    
    if (this.open) {
      this.config.onMenuOpen?.();
      this.playOpen();
    } else {
      this.config.onMenuClose?.();
      this.playClose();
    }
    
    this.animateIcon(this.open);
    this.animateColor(this.open);
    this.animateText(this.open);
  }
}

export function initStaggeredMenu(config) {
  return new StaggeredMenu(config);
}

