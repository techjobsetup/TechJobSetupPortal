(() => {
  const grid = document.getElementById('workGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.work-card'));
  const prevBtn = document.getElementById('workPrev');
  const nextBtn = document.getElementById('workNext');
  const dotsWrap = document.getElementById('workDots');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dots = cards.map((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => scrollToCard(i));
    dotsWrap.appendChild(btn);
    return btn;
  });

  function cardStep() {
    const card = cards[0];
    const style = window.getComputedStyle(grid);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    return card.getBoundingClientRect().width + gap;
  }

  function scrollToCard(i) {
    grid.scrollTo({ left: cards[i].offsetLeft - grid.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function currentIndex() {
    const pos = grid.scrollLeft + grid.offsetLeft;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - pos);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    return closest;
  }

  function updateUI() {
    const idx = currentIndex();
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    const maxScroll = grid.scrollWidth - grid.clientWidth - 2;
    prevBtn.disabled = grid.scrollLeft <= 2;
    nextBtn.disabled = grid.scrollLeft >= maxScroll;
  }

  prevBtn.addEventListener('click', () => scrollToCard(Math.max(0, currentIndex() - 1)));
  nextBtn.addEventListener('click', () => scrollToCard(Math.min(cards.length - 1, currentIndex() + 1)));

  let scrollTicking = false;
  grid.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => { updateUI(); scrollTicking = false; });
      scrollTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateUI);
  updateUI();

  // Drag-to-pan for mouse users
  let pointerDown = false;
  let dragging = false;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartScroll = 0;
  const DRAG_THRESHOLD = 6;

  grid.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    pointerDown = true;
    dragging = false;
    dragPointerId = e.pointerId;
    dragStartX = e.clientX;
    dragStartScroll = grid.scrollLeft;
  });

  grid.addEventListener('pointermove', e => {
    if (!pointerDown || e.pointerId !== dragPointerId) return;
    const delta = e.clientX - dragStartX;
    if (!dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      dragging = true;
      grid.classList.add('is-dragging');
      grid.setPointerCapture(dragPointerId);
    }
    grid.scrollLeft = dragStartScroll - delta;
  });

  function endDrag(e) {
    if (!pointerDown) return;
    pointerDown = false;
    if (dragging) {
      dragging = false;
      grid.classList.remove('is-dragging');
      if (grid.hasPointerCapture(dragPointerId)) grid.releasePointerCapture(dragPointerId);
      const onClickCapture = ev => { ev.stopPropagation(); ev.preventDefault(); };
      document.addEventListener('click', onClickCapture, { capture: true, once: true });
      setTimeout(() => document.removeEventListener('click', onClickCapture, { capture: true }), 0);
    }
  }
  grid.addEventListener('pointerup', endDrag);
  grid.addEventListener('pointerleave', endDrag);

  if (reducedMotion) return;

  cards.forEach(card => {
    card.addEventListener('pointermove', e => {
      if (dragging) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 12;
      const ry = (px - 0.5) * 14;
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
})();
