import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { createDecryptedText } from '../utils/decryptedText.js';

gsap.registerPlugin(Draggable);

export function initGallerySection() {
  // Initialize decrypted text on heading
  const galleryHeading = document.querySelector('#gallery h2');
  if (galleryHeading) {
    createDecryptedText(galleryHeading, {
      speed: 30,
      maxIterations: 15,
      sequential: true,
      revealDirection: 'start',
      animateOn: 'view'
    });
  }
  
  function initSlider() {
    const wrapper = document.querySelector('[data-slider="list"]');
    const slides = gsap.utils.toArray('[data-slider="slide"]');
    
    if (!wrapper || !slides.length) {
      console.warn('Gallery slider elements not found');
      return;
    }
    
    const nextButton = document.querySelector('[data-slider="button-next"]');
    const prevButton = document.querySelector('[data-slider="button-prev"]');
    
    const totalElement = document.querySelector('[data-slide-count="total"]');
    const stepElement = document.querySelector('[data-slide-count="step"]');
    const stepsParent = stepElement.parentElement;
    
    let activeElement;
    const totalSlides = slides.length;

    // Update total slides text
    totalElement.textContent = totalSlides < 10 ? `0${totalSlides}` : totalSlides;

    // Create step elements dynamically
    stepsParent.innerHTML = '';
    slides.forEach((_, index) => {
      const stepClone = stepElement.cloneNode(true);
      stepClone.textContent = index + 1 < 10 ? `0${index + 1}` : index + 1;
      stepsParent.appendChild(stepClone);
    });

    const allSteps = stepsParent.querySelectorAll('[data-slide-count="step"]');
    
    const loop = horizontalLoop(slides, {
      paused: true, 
      draggable: true, 
      center: false,
      dragResistance: 0.5,
      touchResistance: 0.5,
      inertia: true,
      onChange: (element, index) => { 
        activeElement && activeElement.classList.remove("active");
        const nextSibling = element.nextElementSibling || slides[0]; 
        nextSibling.classList.add("active");
        activeElement = nextSibling;
        
        gsap.to(allSteps, { y: `${-100 * index}%`, ease: "power3", duration: 0.45 });
      }
    });
    
    // Add click/touch event listeners for slides
    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => loop.toIndex(i - 1, {ease:"power3",duration: 0.725}));
      // Add touch support for mobile
      slide.addEventListener("touchend", (e) => {
        e.preventDefault();
        loop.toIndex(i - 1, {ease:"power3",duration: 0.725});
      });
    });
    
    // Add click/touch event listeners for navigation buttons
    nextButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      loop.next({ease:"power3", duration: 0.725});
    });
    
    prevButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      loop.previous({ease:"power3", duration: 0.725});
    });
    
    // Add touch support for navigation buttons on mobile
    nextButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      loop.next({ease:"power3", duration: 0.725});
    });
    
    prevButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      loop.previous({ease:"power3", duration: 0.725});
    });
    
    // Add touchstart to prevent default mobile behaviors
    nextButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
    });
    
    prevButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
    });
  }

  function horizontalLoop(items, config) {
    let timeline;
    items = gsap.utils.toArray(items);
    config = config || {};
    gsap.context(() => { 
      let onChange = config.onChange,
        lastIndex = 0,
        tl = gsap.timeline({
          repeat: config.repeat, 
          onUpdate: onChange && function() {
            let i = tl.closestIndex();
            if (lastIndex !== i) {
              lastIndex = i;
              onChange(items[i], i);
            }
          }, 
          paused: config.paused, 
          defaults: {ease: "none"}, 
          onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
        }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        spaceBefore = [],
        xPercents = [],
        curIndex = 0,
        indexIsDirty = false,
        center = config.center,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
        timeOffset = 0,
        container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
        totalWidth,
        getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + spaceBefore[0] + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
        populateWidths = () => {
          let b1 = container.getBoundingClientRect(), b2;
          items.forEach((el, i) => {
            widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
            b2 = el.getBoundingClientRect();
            spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
            b1 = b2;
          });
          gsap.set(items, {
            xPercent: i => xPercents[i]
          });
          totalWidth = getTotalWidth();
        },
        timeWrap,
        populateOffsets = () => {
          timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
          center && times.forEach((t, i) => {
            times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
          });
        },
        getClosest = (values, value, wrap) => {
          let i = values.length,
            closest = 1e10,
            index = 0, d;
          while (i--) {
            d = Math.abs(values[i] - value);
            if (d > wrap / 2) {
              d = wrap - d;
            }
            if (d < closest) {
              closest = d;
              index = i;
            }
          }
          return index;
        },
        populateTimeline = () => {
          let i, item, curX, distanceToStart, distanceToLoop;
          tl.clear();
          for (i = 0; i < length; i++) {
            item = items[i];
            curX = xPercents[i] / 100 * widths[i];
            distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
            distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
            tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
              .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
              .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
          }
          timeWrap = gsap.utils.wrap(0, tl.duration());
        },
        refresh = (deep) => {
          let progress = tl.progress();
          tl.progress(0, true);
          populateWidths();
          deep && populateTimeline();
          populateOffsets();
          deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
        },
        onResize = () => refresh(true),
        proxy;
      
      gsap.set(items, {x: 0});
      populateWidths();
      populateTimeline();
      populateOffsets();
      window.addEventListener("resize", onResize);
      
      function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
        let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
        if (time > tl.time() !== index > curIndex && index !== curIndex) {
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        if (time < 0 || time > tl.duration()) {
          vars.modifiers = {time: timeWrap};
        }
        curIndex = newIndex;
        vars.overwrite = true;
        gsap.killTweensOf(proxy);    
        return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
      }
      
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.closestIndex = setCurrent => {
        let index = getClosest(times, tl.time(), tl.duration());
        if (setCurrent) {
          curIndex = index;
          indexIsDirty = false;
        }
        return index;
      };
      tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
      tl.next = vars => toIndex(tl.current()+1, vars);
      tl.previous = vars => toIndex(tl.current()-1, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true);
      
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      
      if (config.draggable && typeof(Draggable) === "function") {
        proxy = document.createElement("div");
        let wrap = gsap.utils.wrap(0, 1),
          ratio, startProgress, draggable, dragSnap, lastSnap, initChangeX, wasPlaying,
          align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
          syncIndex = () => tl.closestIndex(true);
        
        draggable = Draggable.create(proxy, {
          trigger: items[0].parentNode,
          type: "x",
          onPressInit() {
            let x = this.x;
            gsap.killTweensOf(tl);
            wasPlaying = !tl.paused();
            tl.pause();
            startProgress = tl.progress();
            refresh();
            ratio = 1 / totalWidth;
            initChangeX = (startProgress / -ratio) - x;
            gsap.set(proxy, {x: startProgress / -ratio});
          },
          onDrag: align,
          onDragEnd() {
            syncIndex();
            wasPlaying && tl.play();
          }
        })[0];
        tl.draggable = draggable;
      }
      
      tl.closestIndex(true);
      lastIndex = curIndex;
      onChange && onChange(items[curIndex], curIndex);
      timeline = tl;
      return () => window.removeEventListener("resize", onResize); 
    });
    return timeline;
  }
  
  initSlider();
}

