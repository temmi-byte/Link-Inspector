/* ═══════════════════════════════════════════
   LINKGUARD — main.js
   AOS · Nav · Counter · Typing · Mockups · FAQ
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. INIT LUCIDE ICONS
  ───────────────────────────────────────── */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }


  /* ─────────────────────────────────────────
     2. AOS — Animate On Scroll
  ───────────────────────────────────────── */
  AOS.init({
    duration:   750,
    easing:     'ease-out-cubic',
    once:       true,
    offset:     80,
    delay:      0,
  });


  /* ─────────────────────────────────────────
     3. NAV — Scroll state + Burger
  ───────────────────────────────────────── */
  const nav       = document.getElementById('nav');
  const burger    = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll → frosted glass nav
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Burger toggle
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        mobileMenu.removeAttribute('hidden');
      } else {
        mobileMenu.setAttribute('hidden', '');
      }
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('hidden', '');
      });
    });
  }


  /* ─────────────────────────────────────────
     4. HERO WORD CYCLE
  ───────────────────────────────────────── */
  const wordEl = document.getElementById('wordCycle');
  if (wordEl) {
    const words = ['Malicious', 'Phishing', 'Dangerous', 'Deceptive', 'Suspicious'];
    let wordIndex = 0;

    const cycleWord = () => {
      wordEl.style.opacity = '0';
      wordEl.style.transform = 'translateY(-8px)';

      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        wordEl.textContent = words[wordIndex];
        wordEl.style.opacity = '1';
        wordEl.style.transform = 'translateY(0)';
      }, 400);
    };

    wordEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setInterval(cycleWord, 3000);
  }


  /* ─────────────────────────────────────────
     5. ANIMATED STAT COUNTERS
  ───────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat__number[data-count]');

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2200;
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);

      el.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(step);
  };

  // Trigger when hero stats scroll into view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => statsObserver.observe(counter));


  /* ─────────────────────────────────────────
     6. TYPING ANIMATION (Step 1 Mockup)
  ───────────────────────────────────────── */
  const typingText   = document.getElementById('typingText');
  const typingBubble = document.getElementById('typingBubble');

  if (typingText && typingBubble) {
    const url         = 'https://bit.ly/sus-link';
    let   charIndex   = 0;
    let   typingTimer = null;
    let   started     = false;

    const typeChar = () => {
      if (charIndex < url.length) {
        typingText.textContent += url[charIndex];
        charIndex++;
        typingTimer = setTimeout(typeChar, 85 + Math.random() * 60);
      } else {
        // Pause then restart
        setTimeout(() => {
          typingText.textContent = '';
          charIndex = 0;
          typeChar();
        }, 3500);
      }
    };

    const typingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          setTimeout(typeChar, 1200);
          typingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    typingObserver.observe(typingBubble);
  }


  /* ─────────────────────────────────────────
     7. SCAN ANIMATION (Step 2 Mockup)
  ───────────────────────────────────────── */
  const scanBar    = document.getElementById('scanBar');
  const scanStatus = document.getElementById('scanStatus');
  const check1     = document.getElementById('check1');
  const check2     = document.getElementById('check2');
  const check3     = document.getElementById('check3');

  if (scanBar && scanStatus) {
    const scanSteps = [
      { el: check1, status: 'Tracing redirect chain…', progress: 33  },
      { el: check2, status: 'Inspecting security headers…', progress: 66 },
      { el: check3, status: 'Scanning threat databases…', progress: 100 },
    ];

    const runScanAnimation = () => {
      // Reset
      scanBar.style.width = '0%';
      scanStatus.textContent = 'Analyzing redirects…';
      [check1, check2, check3].forEach(c => {
        if (c) {
          c.classList.remove('done');
          c.querySelector('svg').setAttribute('data-lucide', 'loader-2');
          c.querySelector('svg').classList.add('spin');
        }
      });
      lucide.createIcons();

      let i = 0;
      const runStep = () => {
        if (i >= scanSteps.length) {
          setTimeout(runScanAnimation, 3000);
          return;
        }
        const { el, status, progress } = scanSteps[i];
        setTimeout(() => {
          scanBar.style.width = `${progress}%`;
          scanStatus.textContent = status;

          if (el) {
            el.classList.add('done');
            const svgEl = el.querySelector('svg');
            svgEl.classList.remove('spin');
            svgEl.setAttribute('data-lucide', 'check-circle');
            lucide.createIcons({ nodes: [svgEl] });
          }
          i++;
          runStep();
        }, 900);
      };
      runStep();
    };

    const scanSection = scanBar.closest('.phone-frame');
    if (scanSection) {
      const scanObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(runScanAnimation, 600);
          }
        });
      }, { threshold: 0.4 });
      scanObserver.observe(scanSection);
    }
  }


  /* ─────────────────────────────────────────
     8. SCORE RING ANIMATION (Step 3 Mockup)
  ───────────────────────────────────────── */
  const scoreRing = document.getElementById('scoreRing');
  const scoreNum  = document.getElementById('scoreNum');

  if (scoreRing && scoreNum) {
    const circumference = 2 * Math.PI * 25; // r=25
    const targetScore   = 94;
    const targetOffset  = circumference - (targetScore / 100) * circumference;

    const animateScore = () => {
      let current = 0;
      const duration = 1600;
      const start = performance.now();

      const step = (now) => {
        const t       = Math.min((now - start) / duration, 1);
        const eased   = 1 - Math.pow(1 - t, 3);
        const val     = Math.round(eased * targetScore);
        const offset  = circumference - (val / 100) * circumference;

        scoreRing.style.strokeDashoffset = offset;
        scoreNum.textContent = val;

        if (t < 1) requestAnimationFrame(step);
      };

      scoreRing.style.strokeDasharray  = circumference;
      scoreRing.style.strokeDashoffset = circumference;
      requestAnimationFrame(step);
    };

    const scoreSection = scoreRing.closest('.phone-frame');
    if (scoreSection) {
      const scoreObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(animateScore, 500);
            scoreObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      scoreObserver.observe(scoreSection);
    }
  }


  /* ─────────────────────────────────────────
     9. FAQ ACCORDION — smooth height
  ───────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const answer = item.querySelector('.faq-item__a');

    if (answer) {
      // Smooth open/close with max-height transition
      answer.style.maxHeight     = '0';
      answer.style.overflow      = 'hidden';
      answer.style.transition    = 'max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1)';

      item.addEventListener('toggle', () => {
        if (item.open) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    }
  });


  /* ─────────────────────────────────────────
     10. BACK TO TOP
  ───────────────────────────────────────── */
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backBtn.removeAttribute('hidden');
        requestAnimationFrame(() => backBtn.classList.add('visible'));
      } else {
        backBtn.classList.remove('visible');
        backBtn.addEventListener('transitionend', () => {
          if (!backBtn.classList.contains('visible')) {
            backBtn.setAttribute('hidden', '');
          }
        }, { once: true });
      }
    }, { passive: true });

    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ─────────────────────────────────────────
     11. COPYRIGHT YEAR
  ───────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─────────────────────────────────────────
     12. SMOOTH ANCHOR SCROLL (nav links)
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 0;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────
     13. ACTIVE NAV LINK — Intersection-based
  ───────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a, .nav__mobile a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.removeAttribute('aria-current');
          link.style.color = '';
        });
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.setAttribute('aria-current', 'true');
            link.style.color = 'var(--cyan)';
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold:  0,
  });

  sections.forEach(s => sectionObserver.observe(s));

});