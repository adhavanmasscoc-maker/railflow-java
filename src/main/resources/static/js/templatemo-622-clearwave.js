/**
 * ══════════════════════════════════════════════════════════════════════
 * RAILFLOW x CLEARWAVE — Interactive Controllers & 3D Stage Engine
 * Features:
 *  1. 3D Phone Carousel with zoom controls, swipe & position cycling
 *  2. Scroll Reveal IntersectionObserver
 *  3. Dynamic Metric Counter easing
 *  4. Accessible FAQ accordion with Expand All / Collapse All
 *  5. Monthly / Annual Pricing calculation & toggle switch
 *  6. Mobile drawer navigation & sticky navbar scroll transitions
 * ══════════════════════════════════════════════════════════════════════
 */

function initClearwave() {

  /* ── 1. STICKY NAVBAR ON SCROLL ── */
  const mainNav = document.getElementById('mainNav');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      mainNav?.classList.add('scrolled');
    } else {
      mainNav?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ── 2. MOBILE MENU TOGGLE ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggleMenu());

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }


  /* ── 3. SCROLL REVEAL OBSERVER ── */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: immediately activate
    reveals.forEach(el => el.classList.add('active'));
  }


  /* ── 4. 3D PHONE CAROUSEL ENGINE ── */
  const stage = document.getElementById('carouselStage');
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomPipsWrap = document.getElementById('zoomPips');

  if (stage && track) {
    const cards = Array.from(track.querySelectorAll('.phone-card'));
    const totalCards = cards.length;
    let positions = ['left2', 'left1', 'center', 'right1', 'right2'];

    // If card count is different from positions, dynamically pad or adjust
    while (positions.length < totalCards) {
      positions.push('hidden');
    }

    let currentIndex = 2; // card at 'center'
    let autoPlayTimer = null;

    // Generate Dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${idx === currentIndex ? 'active' : ''}`;
        dot.setAttribute('data-index', idx);
        dot.setAttribute('aria-label', `Go to screen ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToIndex(idx);
          resetAutoPlay();
        });
        dotsWrap.appendChild(dot);
      });
    }

    const updateDots = () => {
      if (!dotsWrap) return;
      const dots = dotsWrap.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const applyPositions = () => {
      cards.forEach((card, idx) => {
        const offset = (idx - currentIndex + totalCards) % totalCards;
        let pos = 'hidden';
        if (offset === 0) pos = 'center';
        else if (offset === 1) pos = 'right1';
        else if (offset === 2) pos = 'right2';
        else if (offset === totalCards - 1) pos = 'left1';
        else if (offset === totalCards - 2) pos = 'left2';

        card.setAttribute('data-pos', pos);
      });
      updateDots();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalCards;
      applyPositions();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      applyPositions();
    };

    const goToIndex = (targetIdx) => {
      currentIndex = targetIdx;
      applyPositions();
    };

    // Click cards to bring to center
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        const pos = card.getAttribute('data-pos');
        if (pos === 'left1') prevSlide();
        else if (pos === 'right1') nextSlide();
        else if (pos === 'left2') { prevSlide(); prevSlide(); }
        else if (pos === 'right2') { nextSlide(); nextSlide(); }
        resetAutoPlay();
      });
    });

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

    // Touch / Swipe support
    let startX = 0;
    let endX = 0;

    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) nextSlide();
        else prevSlide();
        resetAutoPlay();
      }
    }, { passive: true });

    // Autoplay with hover pause
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, 4500);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };

    stage.addEventListener('mouseenter', stopAutoPlay);
    stage.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();

    // Zoom System (1 to 5 scale levels)
    let zoomLevel = 3; // 1 to 5 (default 3)
    const zoomScales = [0.75, 0.88, 1.0, 1.12, 1.25];

    const updateZoomPips = () => {
      if (!zoomPipsWrap) return;
      zoomPipsWrap.innerHTML = '';
      zoomScales.forEach((_, idx) => {
        const pip = document.createElement('div');
        pip.className = `zoom-pip ${idx + 1 === zoomLevel ? 'active' : ''}`;
        zoomPipsWrap.appendChild(pip);
      });
    };

    const setZoom = (level) => {
      zoomLevel = Math.max(1, Math.min(5, level));
      const scale = zoomScales[zoomLevel - 1];
      track.style.transform = `scale(${scale})`;
      track.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      updateZoomPips();
    };

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(zoomLevel + 1));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(zoomLevel - 1));

    updateZoomPips();
    applyPositions();
  }


  /* ── 5. ANIMATED METRICS COUNTER ── */
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const decimal = el.getAttribute('data-decimal');
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const ease = 1 - (1 - progress) * (1 - progress);
            const currentVal = ease * target;

            if (decimal) {
              el.textContent = currentVal.toFixed(1);
            } else {
              el.textContent = Math.floor(currentVal).toLocaleString();
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = decimal ? target.toFixed(1) : target.toLocaleString();
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }


  /* ── 6. PRICING BILLING TOGGLE (MONTHLY / ANNUAL - 35% OFF) ── */
  const pricingToggle = document.getElementById('pricingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  const priceStarter = document.getElementById('price-starter');
  const pricePro = document.getElementById('price-pro');
  const priceEnt = document.getElementById('price-ent');
  const noteStarter = document.getElementById('annual-note-starter');
  const notePro = document.getElementById('annual-note-pro');
  const noteEnt = document.getElementById('annual-note-ent');

  if (pricingToggle) {
    let isAnnual = false;

    const basePrices = {
      starter: 20,
      pro: 60,
      ent: 150
    };

    const updatePricing = () => {
      pricingToggle.classList.toggle('active', isAnnual);
      pricingToggle.setAttribute('aria-checked', isAnnual ? 'true' : 'false');
      if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
      if (annualLabel) annualLabel.classList.toggle('active', isAnnual);

      if (isAnnual) {
        // 35% discount
        const sPrice = Math.round(basePrices.starter * 0.65);
        const pPrice = Math.round(basePrices.pro * 0.65);
        const ePrice = Math.round(basePrices.ent * 0.65);

        if (priceStarter) priceStarter.textContent = sPrice;
        if (pricePro) pricePro.textContent = pPrice;
        if (priceEnt) priceEnt.textContent = ePrice;

        if (noteStarter) noteStarter.textContent = `Billed annually ($${sPrice * 12}/yr)`;
        if (notePro) notePro.textContent = `Billed annually ($${pPrice * 12}/yr)`;
        if (noteEnt) noteEnt.textContent = `Billed annually ($${ePrice * 12}/yr)`;
      } else {
        if (priceStarter) priceStarter.textContent = basePrices.starter;
        if (pricePro) pricePro.textContent = basePrices.pro;
        if (priceEnt) priceEnt.textContent = basePrices.ent;

        if (noteStarter) noteStarter.textContent = '\u00A0';
        if (notePro) notePro.textContent = '\u00A0';
        if (noteEnt) noteEnt.textContent = '\u00A0';
      }
    };

    pricingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      updatePricing();
    });

    if (monthlyLabel) monthlyLabel.addEventListener('click', () => { isAnnual = false; updatePricing(); });
    if (annualLabel) annualLabel.addEventListener('click', () => { isAnnual = true; updatePricing(); });
  }


  /* ── 7. FAQ ACCORDION WITH EXPAND ALL ── */
  const faqList = document.getElementById('faqList');
  const faqToggleAll = document.getElementById('faqToggleAll');
  const faqToggleIcon = document.getElementById('faqToggleIcon');

  if (faqList) {
    const faqItems = Array.from(faqList.querySelectorAll('.faq-item'));

    const setItemOpen = (item, open) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const inner = item.querySelector('.faq-answer-inner');

      if (open) {
        item.classList.add('active');
        question?.setAttribute('aria-expanded', 'true');
        if (answer && inner) {
          answer.style.maxHeight = inner.offsetHeight + 'px';
        }
      } else {
        item.classList.remove('active');
        question?.setAttribute('aria-expanded', 'false');
        if (answer) {
          answer.style.maxHeight = '0px';
        }
      }
    };

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question?.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        setItemOpen(item, !isOpen);
      });
    });

    // Toggle All Button
    if (faqToggleAll) {
      let allExpanded = false;

      faqToggleAll.addEventListener('click', () => {
        allExpanded = !allExpanded;
        faqItems.forEach(item => setItemOpen(item, allExpanded));

        if (faqToggleIcon) {
          faqToggleIcon.textContent = allExpanded ? '−' : '+';
        }
        faqToggleAll.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = allExpanded ? ' Collapse all' : ' Expand all';
          }
        });
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClearwave);
} else {
  initClearwave();
}
