(() => {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const triggers = Array.from(document.querySelectorAll('.tool-trigger'));

  const ESTIMATOR_TYPES = [
    { label: 'Business website', base: 2, low: 1, high: 2 },
    { label: 'Customer portal', base: 3, low: 2, high: 4 },
    { label: 'Dashboard', base: 4, low: 3, high: 5 },
    { label: 'Booking system', base: 3, low: 2, high: 4 },
  ];

  const ESTIMATOR_FEATURES = [
    { label: 'User authentication', weight: 1 },
    { label: 'Payments', weight: 2 },
    { label: 'Admin dashboard', weight: 1 },
    { label: 'Real-time updates', weight: 2 },
    { label: 'Third-party integrations', weight: 1 },
  ];

  function estimatorTemplate() {
    return `
      <h3 id="modalTitle">Project Scope Estimator</h3>
      <p>Pick a project type and the features you need for an instant complexity + timeline estimate.</p>
      <div class="estimator-types" id="estimatorTypes">
        ${ESTIMATOR_TYPES.map((t, i) => `
          <button type="button" class="est-type${i === 0 ? ' is-active' : ''}" data-index="${i}">${t.label}</button>
        `).join('')}
      </div>
      <ul class="checklist" id="estimatorFeatures">
        ${ESTIMATOR_FEATURES.map((f, i) => `
          <li><label>
            <input type="checkbox" data-index="${i}" />
            ${f.label}
          </label></li>`).join('')}
      </ul>
      <div class="estimate-result">
        <span class="estimate-badge" id="estimateBadge">Simple</span>
        <p id="estimateTimeline">Estimated timeline: 1–2 weeks</p>
      </div>
      <a class="btn btn-primary" href="#contact" data-target="contact" data-close-modal>Discuss this project</a>
    `;
  }

  function wireEstimator() {
    const typeButtons = Array.from(modalBody.querySelectorAll('.est-type'));
    const featureBoxes = Array.from(modalBody.querySelectorAll('#estimatorFeatures input'));
    const badge = modalBody.querySelector('#estimateBadge');
    const timeline = modalBody.querySelector('#estimateTimeline');
    let activeType = 0;

    function recompute() {
      const type = ESTIMATOR_TYPES[activeType];
      const featureWeight = featureBoxes.reduce(
        (sum, b) => sum + (b.checked ? ESTIMATOR_FEATURES[Number(b.dataset.index)].weight : 0), 0
      );
      const total = type.base + featureWeight;

      let label, low, high;
      if (total <= 3) { label = 'Simple'; low = type.low; high = type.high; }
      else if (total <= 6) { label = 'Standard'; low = type.low + 1; high = type.high + 2; }
      else { label = 'Advanced'; low = type.low + 3; high = type.high + 5; }

      badge.textContent = label;
      timeline.textContent = `Estimated timeline: ${low}–${high} weeks`;
    }

    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activeType = Number(btn.dataset.index);
        typeButtons.forEach(b => b.classList.toggle('is-active', b === btn));
        recompute();
      });
    });
    featureBoxes.forEach(box => box.addEventListener('change', recompute));
    recompute();
  }

  function profileServiceTemplate() {
    return `
      <h3 id="modalTitle">Professional Profile Optimization</h3>
      <p class="service-tagline">Build a career-ready profile that gets you noticed</p>

      <div class="service-block">
        <h4>Services offered</h4>
        <ul class="service-list">
          <li><strong>LinkedIn Optimization</strong> — headline, summary and experience rewritten to attract recruiters.</li>
          <li><strong>GitHub Setup</strong> — pinned repos, READMEs and profile polish that show real skill.</li>
          <li><strong>Resume Writing</strong> — ATS-friendly, role-specific resumes that pass the first filter.</li>
          <li><strong>Portfolio Website</strong> — a personal site that showcases your work and story.</li>
          <li><strong>Career Guidance</strong> — 1:1 direction on roles, positioning and next steps.</li>
        </ul>
      </div>

      <div class="service-block">
        <h4>Why choose us</h4>
        <ul class="service-list">
          <li><strong>Recruiter-tested insight</strong> — we know exactly what makes a hiring manager stop scrolling, not just what looks neat.</li>
          <li><strong>Real ATS compatibility</strong> — every resume is checked against actual parsing software, not guesswork.</li>
          <li><strong>1:1, not templated</strong> — you work directly with a specialist on your profile, never a generic fill-in-the-blank form.</li>
          <li><strong>Fast, honest turnaround</strong> — most projects are delivered in days, with clear milestones at every step.</li>
        </ul>
      </div>

      <div class="service-block">
        <h4>How it works</h4>
        <ol class="service-steps">
          <li>Consultation — understand your goals and current profile.</li>
          <li>Draft — first pass on resume, LinkedIn and portfolio copy.</li>
          <li>Review — walk through it together, refine tone and details.</li>
          <li>Final delivery — polished, ready-to-use profile assets.</li>
        </ol>
      </div>

      <div class="service-block">
        <h4>Pricing</h4>
        <div class="pricing-card is-featured pricing-solo">
          <span class="card-tag">Starts from</span>
          <p class="price">₹999<span> onwards</span></p>
          <p class="pricing-note">Final quote discussed based on the services and scope you need.</p>
        </div>
      </div>

      <div class="service-block">
        <h4>Client feedback</h4>
        <blockquote class="testimonial">"Rewrote my resume and LinkedIn in a week — started getting recruiter messages within days."<cite>— Software Engineer</cite></blockquote>
      </div>

      <div class="service-block">
        <h4>FAQs</h4>
        <details class="faq-item"><summary>Do you tailor resumes for specific roles?</summary><p>Yes — every resume is rewritten around the specific roles you're targeting, not a generic template.</p></details>
        <details class="faq-item"><summary>How long does the process take?</summary><p>Most packages are delivered within 3–5 working days from the consultation.</p></details>
        <details class="faq-item"><summary>Can I upgrade my package later?</summary><p>Yes — you only pay the difference if you upgrade to a higher package.</p></details>
        <details class="faq-item"><summary>Do you work with freshers or first-time job seekers?</summary><p>Yes — we regularly work with students and early-career candidates, adjusting tone and content for entry-level roles.</p></details>
        <details class="faq-item"><summary>What do you need from me to get started?</summary><p>Just your current resume or LinkedIn (if you have one) and a short call about your target roles — we handle the rest.</p></details>
      </div>

      <a class="btn btn-primary" href="#contact" data-target="contact" data-close-modal>Book a free consultation</a>
    `;
  }

  function webdevServiceTemplate() {
    const industries = [
      { key: 'retail', label: 'Retail', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>' },
      { key: 'agencies', label: 'Service agencies', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>' },
      { key: 'startups', label: 'Startups', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c2.5 2.5 4 6 4 10 0 2-1 4-4 8-3-4-4-6-4-8 0-4 1.5-7.5 4-10z"/><circle cx="12" cy="10" r="1.4"/><path d="M8.5 16.5L6 20M15.5 16.5L18 20"/></svg>' },
      { key: 'healthcare', label: 'Healthcare', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.35-9.5-8.5C1 8 2.5 4.5 6 4.5c2 0 3.2 1.1 4 2.2.8-1.1 2-2.2 4-2.2 3.5 0 5 3.5 3.5 7C19 15.65 12 20 12 20z"/></svg>' },
      { key: 'education', label: 'Education', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8l10-4 10 4-10 4-10-4z"/><path d="M6 10.3V16c0 1.1 2.7 2 6 2s6-.9 6-2v-5.7"/><path d="M22 8v6"/></svg>' },
    ];
    return `
      <h3 id="modalTitle">Business Web Application Development</h3>
      <p class="service-tagline">Custom web applications to power your business</p>

      <div class="service-block">
        <h4>Services offered</h4>
        <div class="pricing-grid">
          <div class="pricing-card">
            <span class="card-tag">Static Web</span>
            <p class="service-sub">Marketing sites, portfolios, landing pages — fast, SEO-first, content-led.</p>
          </div>
          <div class="pricing-card">
            <span class="card-tag">Dynamic Web</span>
            <p class="service-sub">Portals, dashboards, booking systems — logins, databases, real interactivity.</p>
          </div>
        </div>
      </div>

      <div class="service-block">
        <h4>Industries served</h4>
        <p class="service-hint">Tap an industry to see sample web app themes we build for it.</p>
        <div class="industry-grid">
          ${industries.map(ind => `
            <button type="button" class="industry-card" data-industry="${ind.key}">
              <span class="industry-icon" aria-hidden="true">${ind.icon}</span>
              <span>${ind.label}</span>
            </button>`).join('')}
        </div>
      </div>

      <div class="service-block">
        <h4>How it works</h4>
        <ol class="service-steps">
          <li>Requirement gathering — map out what the business actually needs.</li>
          <li>Design — wireframes and UI direction before a line of code.</li>
          <li>Development — build in focused, reviewable stages.</li>
          <li>Testing — real-world checks before anything ships.</li>
          <li>Deployment — live, monitored, and handed over cleanly.</li>
        </ol>
      </div>

      <div class="service-block">
        <h4>Portfolio</h4>
        <p>See real examples — booking portals, dashboards and business sites — in our Work section.</p>
        <a class="explore-link" href="#work" data-target="work" data-close-modal>View our work <span aria-hidden="true">→</span></a>
      </div>

      <div class="service-block">
        <h4>Pricing</h4>
        <div class="pricing-card is-featured pricing-solo">
          <span class="card-tag">Starts from</span>
          <p class="price">₹4,999<span> onwards</span></p>
          <p class="pricing-note">Final quote discussed based on firm-level design &amp; scope.</p>
        </div>
      </div>

      <div class="service-block">
        <h4>Client feedback</h4>
        <blockquote class="testimonial">"Our booking system replaced three spreadsheets and a WhatsApp group — customers book themselves now."<cite>— Small business owner</cite></blockquote>
      </div>

      <div class="service-block">
        <h4>FAQs</h4>
        <details class="faq-item"><summary>Can you integrate payment gateways?</summary><p>Yes — Razorpay, Stripe and other gateways can be integrated into bookings, orders or subscriptions.</p></details>
        <details class="faq-item"><summary>Do you provide maintenance?</summary><p>Yes — ongoing maintenance and support is available as a subscription after launch.</p></details>
        <details class="faq-item"><summary>Can I request changes after launch?</summary><p>Yes — scope changes are scoped and quoted separately, or covered under a maintenance plan.</p></details>
      </div>

      <a class="btn btn-primary" href="#contact" data-target="contact" data-close-modal>Start your project today</a>
    `;
  }

  const INDUSTRY_SHOWCASE = {
    retail: {
      title: 'Retail',
      blurb: 'Storefronts and back-office tools that turn browsers into repeat customers.',
      image: 'Retail.jpg',
      themes: [
        { name: 'Boutique Storefront', desc: 'A fast, image-led landing page with a clear product hero and a single strong CTA.' },
        { name: 'Inventory & Orders Dashboard', desc: 'Live stock levels, order status and sales trends in one glanceable view.' },
      ],
    },
    agencies: {
      title: 'Service agencies',
      blurb: 'Portals and scheduling tools that keep client work organized and on time.',
      image: 'ServiceAgency.jpg',
      themes: [
        { name: 'Client Portal', desc: 'A private dashboard where clients track project status, files and invoices.' },
        { name: 'Service Booking Calendar', desc: 'Slot-based booking with reminders, so consultations fill themselves.' },
      ],
    },
    startups: {
      title: 'Startups',
      blurb: 'Landing pages and internal metrics tools built for speed and iteration.',
      image: 'Startups.jpg',
      themes: [
        { name: 'Product Landing Page', desc: 'Conversion-first layout — headline, proof, pricing, and a single sign-up path.' },
        { name: 'Founder Metrics Dashboard', desc: 'Signups, revenue and retention tracked in one internal view.' },
      ],
    },
    healthcare: {
      title: 'Healthcare',
      blurb: 'Booking and records tools designed around patient trust and clarity.',
      image: 'HealthCare.jpg',
      themes: [
        { name: 'Appointment Booking', desc: 'Patients pick a slot, get reminders, and clinics avoid double-booking.' },
        { name: 'Patient Records Grid', desc: 'Structured, searchable patient records with clean, accessible layouts.' },
      ],
    },
    education: {
      title: 'Education',
      blurb: 'Catalogs and dashboards that make learning content easy to browse and track.',
      image: 'Education.jpg',
      themes: [
        { name: 'Course Catalog', desc: 'Browsable course grid with filters, previews, and clear enrolment CTAs.' },
        { name: 'Student Progress Dashboard', desc: 'Attendance, scores and progress tracked per student, at a glance.' },
      ],
    },
  };

  function industryShowcaseTemplate(key) {
    const data = INDUSTRY_SHOWCASE[key];
    return `
      <button type="button" class="modal-back" data-modal-back="webdevService">
        <span aria-hidden="true">←</span> Back to services
      </button>
      <h3 id="modalTitle">${data.title}</h3>
      <p class="service-tagline">${data.blurb}</p>

      <div class="service-block">
        <div class="industry-hero">
          <img src="Images/${data.image}" alt="${data.title} web application theme" loading="lazy" />
        </div>
      </div>

      <div class="service-block">
        <h4>Sample themes for ${data.title}</h4>
        <div class="theme-grid">
          ${data.themes.map(t => `
            <div class="theme-card">
              <h4>${t.name}</h4>
              <p>${t.desc}</p>
            </div>`).join('')}
        </div>
      </div>

      <a class="btn btn-primary" href="#contact" data-target="contact" data-close-modal>Contact us</a>
    `;
  }

  const noop = () => {};
  const TOOLS = {
    estimator: { template: estimatorTemplate, wire: wireEstimator },
    profileService: { template: profileServiceTemplate, wire: noop, wide: true },
    webdevService: { template: webdevServiceTemplate, wire: noop, wide: true },
    'industry-retail': { template: () => industryShowcaseTemplate('retail'), wire: noop, wide: true },
    'industry-agencies': { template: () => industryShowcaseTemplate('agencies'), wire: noop, wide: true },
    'industry-startups': { template: () => industryShowcaseTemplate('startups'), wire: noop, wide: true },
    'industry-healthcare': { template: () => industryShowcaseTemplate('healthcare'), wire: noop, wide: true },
    'industry-education': { template: () => industryShowcaseTemplate('education'), wire: noop, wide: true },
  };

  const detailTriggers = Array.from(document.querySelectorAll('.work-detail-btn'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lastFocused = null;

  function applyReveal(container) {
    const revealEls = Array.from(container.children);
    revealEls.forEach((el, i) => {
      el.classList.remove('is-in');
      el.style.transitionDelay = reducedMotion ? '0s' : `${Math.min(i * 0.06, 0.42)}s`;
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        revealEls.forEach(el => el.classList.add('is-in'));
      });
    });
  }

  function openModal(key, triggerEl) {
    const tool = TOOLS[key];
    if (!tool) return;
    modalBody.innerHTML = tool.template();
    tool.wire();
    modal.classList.toggle('modal-wide', Boolean(tool.wide));
    lastFocused = document.activeElement;

    if (triggerEl && !reducedMotion) {
      const r = triggerEl.getBoundingClientRect();
      const ox = ((r.left + r.width / 2) / window.innerWidth) * 100;
      const oy = ((r.top + r.height / 2) / window.innerHeight) * 100;
      modal.style.transformOrigin = `${ox}% ${oy}%`;
    } else {
      modal.style.transformOrigin = '50% 50%';
    }

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();

    applyReveal(modalBody);
    requestAnimationFrame(() => overlay.classList.add('is-visible'));
  }

  function swapModal(key) {
    const tool = TOOLS[key];
    if (!tool) return;
    modalBody.classList.add('is-swapping');
    setTimeout(() => {
      modalBody.innerHTML = tool.template();
      tool.wire();
      modal.classList.toggle('modal-wide', Boolean(tool.wide));
      modalBody.scrollTop = 0;
      modalBody.classList.remove('is-swapping');
      applyReveal(modalBody);
    }, reducedMotion ? 0 : 180);
  }

  function closeModal() {
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.hidden = true; }, reducedMotion ? 200 : 450);
    if (lastFocused) lastFocused.focus();
  }

  modalBody.addEventListener('click', e => {
    const industryBtn = e.target.closest('[data-industry]');
    if (industryBtn) {
      swapModal('industry-' + industryBtn.dataset.industry);
      return;
    }
    const backBtn = e.target.closest('[data-modal-back]');
    if (backBtn) {
      swapModal(backBtn.dataset.modalBack);
      return;
    }
    const closeEl = e.target.closest('[data-close-modal]');
    if (closeEl) {
      const targetId = closeEl.dataset.target;
      if (targetId) {
        e.preventDefault();
        closeModal();
        const target = document.getElementById(targetId);
        if (target) {
          setTimeout(() => target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }), 200);
        }
      } else {
        closeModal();
      }
    }
  });

  triggers.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modal, btn));
  });
  detailTriggers.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.detail, btn));
  });
  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });
})();
