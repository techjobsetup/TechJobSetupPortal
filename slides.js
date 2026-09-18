(() => {
  const slidesEl = document.getElementById('slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotButtons = Array.from(document.querySelectorAll('.dot-nav button'));
  const navLinks = Array.from(document.querySelectorAll('[data-target]'));
  const navToggle = document.getElementById('navToggle');
  const topnav = document.querySelector('.topnav');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) document.documentElement.classList.add('reduced-motion');

  const slideById = new Map(slides.map(s => [s.id, s]));

  const slideLabels = {
    hero: 'Home', services: 'Services', work: 'Our Work', about: 'About', contact: 'Contact'
  };

  const badge = document.getElementById('sectionBadge');
  const ptLabel = document.getElementById('ptLabel');
  let badgeTimer = null;

  function jumpTo(id, behavior) {
    const target = slideById.get(id);
    if (!target) return;
    target.scrollIntoView({ behavior, block: 'start' });
  }

  function goTo(id) {
    jumpTo(id, reducedMotion ? 'auto' : 'smooth');
  }

  function transitionTo(id) {
    if (!slideById.has(id)) return;
    goTo(id);
    if (reducedMotion) return;

    ptLabel.textContent = slideLabels[id] || '';
    clearTimeout(badgeTimer);
    badge.classList.remove('is-visible');
    void badge.offsetWidth;
    badge.classList.add('is-visible');
    badgeTimer = setTimeout(() => badge.classList.remove('is-visible'), 1100);
  }

  navLinks.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const id = el.dataset.target;
      transitionTo(id);
      if (topnav.classList.contains('is-open')) {
        topnav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
      const highlightId = el.dataset.highlight === 'profile' ? 'card-profile'
        : el.dataset.highlight === 'webdev' ? 'card-webdev' : null;
      if (highlightId) {
        setTimeout(() => {
          const card = document.getElementById(highlightId);
          if (!card) return;
          card.classList.remove('highlight');
          void card.offsetWidth;
          card.classList.add('highlight');
        }, 650);
      }
    });
  });

  dotButtons.forEach(btn => {
    btn.addEventListener('click', () => transitionTo(btn.dataset.target));
  });

  navToggle.addEventListener('click', () => {
    const isOpen = topnav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  function setActiveNav(id) {
    navLinks.forEach(link => {
      link.classList.toggle('is-current', link.dataset.target === id);
    });
  }

  const activateObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const slide = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
        slide.classList.add('is-active');
        const dot = dotButtons.find(b => b.dataset.target === slide.id);
        dotButtons.forEach(b => b.classList.remove('is-active'));
        if (dot) dot.classList.add('is-active');
        setActiveNav(slide.id);
      } else {
        slide.classList.remove('is-active');
      }
    });
  }, { root: slidesEl, threshold: [0, 0.55, 1] });

  slides.forEach(slide => activateObserver.observe(slide));

  document.addEventListener('keydown', e => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay && !modalOverlay.hidden) return;
    if (e.key !== 'ArrowDown' && e.key !== 'PageDown' && e.key !== 'ArrowUp' && e.key !== 'PageUp') return;
    e.preventDefault();
    const idx = slides.findIndex(s => s.classList.contains('is-active'));
    const current = idx === -1 ? 0 : idx;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      const next = slides[Math.min(slides.length - 1, current + 1)];
      if (next) transitionTo(next.id);
    } else {
      const prev = slides[Math.max(0, current - 1)];
      if (prev) transitionTo(prev.id);
    }
  });

  if (!reducedMotion) {
    let ticking = false;
    function updateParallax() {
      ticking = false;
      slides.forEach(slide => {
        const rect = slide.getBoundingClientRect();
        const progress = rect.top / window.innerHeight;
        const clamped = Math.max(-1.4, Math.min(1.4, progress));

        slide.querySelectorAll('[data-speed]').forEach(el => {
          const speed = parseFloat(el.dataset.speed) || 0;
          el.style.transform = `translate3d(0, ${clamped * speed * 100}px, 0)`;
        });

        const inner = slide.querySelector('.slide-inner');
        if (inner) {
          const fade = 1 - Math.min(1, Math.abs(clamped));
          inner.style.opacity = String(0.25 + 0.75 * fade);
          inner.style.transform = `translateY(${clamped * 40}px) scale(${0.94 + 0.06 * fade})`;
        }
      });
    }
    slidesEl.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }
})();
