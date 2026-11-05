/* AASHIK — clone interactions: header, drawer, story, accordion, tabs, NOVA, Lenis smooth scroll */
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ---------- Lenis smooth scroll ---------- */
let lenis = null;
if (!prefersReducedMotion && typeof window.Lenis === 'function') {
  try {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, smoothTouch: false, anchors: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    window.scrollTo(0, 0);
  } catch (err) {
    lenis = null;
  }
}
const scrollTo = (target) => {
  if (prefersReducedMotion || !lenis) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    return;
  }
  lenis.scrollTo(target, { offset: 0, duration: 1.25, easing: (t) => 1 - Math.pow(2, -10 * t) });
};

/* ---------- Hero parallax ---------- */
/* ---------- Hero + project parallax ---------- */
const heroWord = $('.Hero-module___w2HtG__title');
const heroPortrait = $('.Hero-module___w2HtG__portrait');
const heroAmbient = $('.Hero-module___w2HtG__ambient');
const projectShots = $$('.WorkSections-module__9ylKlW__projectImage').map((img) => ({
  img,
  media: img.closest('.WorkSections-module__9ylKlW__projectMedia'),
}));
const onParallax = () => {
  if (prefersReducedMotion) return;
  const y = lenis ? lenis.scroll : window.scrollY;
  const vh = window.innerHeight || 900;
  const p = Math.min(1, Math.max(0, y / vh));
  if (y <= vh) {
    if (heroWord) heroWord.style.transform = `translate3d(${p * -70}px, ${p * 34}px, 0)`;
    if (heroPortrait) heroPortrait.style.transform = `translate3d(0, ${p * 110}px, 0)`;
    if (heroAmbient) heroAmbient.style.transform = `translate3d(0, ${p * 60}px, 0)`;
  }
  projectShots.forEach(({ img, media }) => {
    if (!media) return;
    const r = media.getBoundingClientRect();
    if (r.bottom < -240 || r.top > vh + 240) return;
    const offset = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
    img.style.transform = `translate3d(0, ${(-offset * 20).toFixed(2)}px, 0) scale(1.07)`;
  });
};

/* ---------- Reveal on scroll ---------- */
const revealSelectors = [
  '.Hero-module___w2HtG__role',
  '.Hero-module___w2HtG__bottomRow',
  '.EditorialSections-module__YfyJba__introPortrait',
  '.EditorialSections-module__YfyJba__introCopy > *',
  '.EditorialSections-module__YfyJba__bioCard',
  '.EditorialSections-module__YfyJba__serviceItem',
  '.WorkSections-module__9ylKlW__projectRow',
  '.WorkSections-module__9ylKlW__coreTabs > button',
  '.WorkSections-module__9ylKlW__corePanel',
  '.EditorialSections-module__YfyJba__timelineItem',
  '.ContactFooter-module__oCUkFa__contactInfo > *',
  '.ContactFooter-module__oCUkFa__form',
  '.ContactFooter-module__oCUkFa__footerContent > *',
  '.ContactFooter-module__oCUkFa__footerSocials a',
];
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  revealSelectors.forEach((sel) => {
    $$(sel).forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${Math.min(i * 70, 350)}ms`; });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
} else {
  revealSelectors.forEach((sel) => $$(sel).forEach((el) => el.classList.add('is-visible')));
}

/* ---------- Header scrolled state ---------- */
const header = $('.Navbar-module__cRh5nW__header');
const scrollBar = document.getElementById('scroll-progress');
const onScroll = () => {
  const scroll = lenis ? lenis.scroll : window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? scroll / max : 0;
  if (scrollBar) scrollBar.style.transform = `scaleX(${progress})`;
  if (header) header.classList.toggle('Navbar-module__cRh5nW__scrolled', scroll > 40);
};
let ticking = false;
const handleScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { onScroll(); onParallax(); ticking = false; });
};
window.addEventListener('scroll', handleScroll, { passive: true });
if (lenis) lenis.on('scroll', handleScroll);
window.addEventListener('resize', handleScroll, { passive: true });
onScroll();

/* ---------- Mobile drawer ---------- */
const menuBtn = $('.Navbar-module__cRh5nW__menuButton');
const drawer = document.getElementById('mobile-drawer');
const closeBtn = drawer ? drawer.querySelector('.Navbar-module__cRh5nW__menuButton') : null;
if (menuBtn && drawer) {
  const setDrawer = (open) => {
    drawer.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && closeBtn) closeBtn.focus();
  };
  menuBtn.addEventListener('click', () => setDrawer(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setDrawer(false));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
  window.addEventListener('keydown', (e) => { if (!drawer.hidden && e.key === 'Escape') setDrawer(false); });
}

/* ---------- Marquee toggle ---------- */
const marqueeToggle = document.getElementById('marquee-toggle');
const marqueeTrack = $('.EditorialSections-module__YfyJba__marqueeTrack');
if (marqueeToggle && marqueeTrack) {
  marqueeToggle.addEventListener('click', () => {
    const running = marqueeTrack.style.animationPlayState !== 'paused';
    marqueeTrack.style.animationPlayState = running ? 'paused' : 'running';
    marqueeToggle.setAttribute('aria-label', running ? 'Resume technology animation' : 'Pause technology animation');
  });
}

/* ---------- Scroll story chapters by progress ---------- */
const story = $('.ScrollStory-module__QPMO4G__story');
const chapters = $$('.ScrollStory-module__QPMO4G__chapter');
const progressBar = document.getElementById('story-progress-bar');
const previews = $$('.ScrollStory-module__QPMO4G__preview');
const orbit = $('.ScrollStory-module__QPMO4G__orbit');
const sphereField = $('.ScrollStory-module__QPMO4G__sphereField');
if (story && chapters.length) {
  const setChapter = () => {
    const rect = story.getBoundingClientRect();
    const total = story.offsetHeight - window.innerHeight;
    const raw = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    const progress = total > 0 ? raw / total : 0;
    const idx = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));
    chapters.forEach((c, i) => {
      const active = i === idx;
      c.style.opacity = active ? '1' : '0';
      c.style.transform = active ? 'none' : 'translateY(24px)';
      c.style.pointerEvents = active ? 'auto' : 'none';
      c.classList.toggle('is-active', active);
    });
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (orbit) orbit.style.transform = `scale(${0.78 + progress * 0.35}) rotate(${-35 + progress * 120}deg)`;
    if (sphereField) sphereField.style.transform = `translateY(${60 - progress * 180}px)`;
    previews.forEach((p, i) => {
      const depth = (i + 1) * 28;
      const lift = Math.max(0, Math.min(1, progress * 1.4 - i * 0.18));
      p.style.transform = `translateY(${70 - depth * lift * 0.9}px) scale(${0.85 + lift * 0.15}) rotate(${(-10 + lift * 20) * (i % 2 ? -1 : 1)}deg)`;
    });
  };
  let storyTicking = false;
  const onStoryScroll = () => {
    if (storyTicking) return;
    storyTicking = true;
    requestAnimationFrame(() => { setChapter(); storyTicking = false; });
  };
  window.addEventListener('scroll', onStoryScroll, { passive: true });
  window.addEventListener('resize', onStoryScroll, { passive: true });
  setChapter();
}

/* ---------- Skills accordion ---------- */
const triggers = $$('.EditorialSections-module__YfyJba__serviceTrigger');
if (triggers.length) {
  const setOpen = (btn, open) => {
    const item = btn.closest('.EditorialSections-module__YfyJba__serviceItem');
    const panel = item.querySelector('.EditorialSections-module__YfyJba__servicePanel');
    item.dataset.open = String(open);
    btn.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
  };
  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      setOpen(btn, !isOpen);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const current = triggers.indexOf(btn);
      const next = e.key === 'ArrowDown' ? (current + 1) % triggers.length : (current - 1 + triggers.length) % triggers.length;
      triggers[next].focus();
      e.preventDefault();
    });
  });
}

/* ---------- Core tabs ---------- */
const coreTabs = $$('.WorkSections-module__9ylKlW__coreTab');
const corePanels = $$('.WorkSections-module__9ylKlW__corePanel');
if (coreTabs.length && corePanels.length) {
  const select = (tab) => {
    const targetId = tab.getAttribute('aria-controls');
    coreTabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.classList.toggle('WorkSections-module__9ylKlW__activeTab', on); });
    corePanels.forEach((panel) => { panel.hidden = panel.id !== targetId; });
  };
  coreTabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));
}

/* ---------- Contact form -> mailto ---------- */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    const message = form.querySelector('#contact-message').value.trim();
    const subject = encodeURIComponent(`Portfolio inquiry — ${name}`);
    const body = encodeURIComponent(`Hi Aashik,\n\n${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:aashikahamed029@gmail.com?subject=${subject}&body=${body}`;
    const note = form.querySelector('.ContactFooter-module__oCUkFa__formNote');
    if (note) note.textContent = 'Opening your mail client — message prefilled.';
    showToast('Opening your mail client…');
  });
}

/* ---------- Toast ---------- */
const toast = document.getElementById('toast');
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.hidden = false;
  toast.classList.add('is-visible');
  window.setTimeout(() => { toast.classList.remove('is-visible'); window.setTimeout(() => { toast.hidden = true; }, 400); }, 3200);
}

/* ---------- NOVA concierge ---------- */
const nova = document.getElementById('nova');
const novaOpen = document.getElementById('nova-open');
const novaAbout = document.getElementById('nova-open-about');
const novaClose = document.getElementById('nova-close');
const novaBody = document.getElementById('nova-body');
const novaForm = document.getElementById('nova-form');
const novaInput = document.getElementById('nova-input');
const novaChips = document.getElementById('nova-chips');
let novaWelcomed = false;

const NOVA_ANSWERS = [
  { test: /^(hi|hello|hey|yo|sup|greetings)\b/i, html: 'Hey! I’m <strong>NOVA</strong> — Aashik Ahamed A portfolio concierge.\nAsk me about projects, skills, internships, résumé, contact, or education. Or tap a chip below.' },
  { test: /thank|thanks|thx/i, html: 'You’re welcome! If you’d like to reach Aashik Ahamed A directly: <a href="mailto:aashikahamed029@gmail.com">aashikahamed029@gmail.com</a> · <a href="tel:+919944460616">+91 99444 60616</a>.' },
  { test: /project|work|build|ship|portfolio/i, html: 'Three anchor projects — all pinned on GitHub:\n• <a href="https://github.com/Aashik029/techpixelA2H" target="_blank" rel="noopener">Tech Pixel A2H</a> — responsive company site, in production on Vercel.\n• <a href="https://github.com/Aashik029/infotact-mern-project-2" target="_blank" rel="noopener">AI E-Commerce Engine</a> — vector search, JWT, Redis, admin dashboard.\n• <a href="https://github.com/Aashik029/infotact-mern-project1" target="_blank" rel="noopener">Real-Time B2B Workspace</a> — Socket.IO, shared workspaces, live presence.\nMore: <a href="https://github.com/Aashik029/internship-campus-hiring-platform" target="_blank" rel="noopener">Internship & Campus Hiring Platform</a> (FastAPI · React · PostgreSQL) and <a href="https://github.com/Aashik029/Edubot" target="_blank" rel="noopener">EUDbot — SIH 2025</a>.\nAsk “résumé” for the full picture.' },
  { test: /tech pixel|a2h|marketing|svelte/i, html: '<strong>Tech Pixel A2H</strong> — a responsive company website for a Trichy web studio.\nStack: SvelteKit · TypeScript · Tailwind · CSS Grid/Flexbox · Vite · Vercel.\nSource: <a href="https://github.com/Aashik029/techpixelA2H" target="_blank" rel="noopener">github.com/Aashik029/techpixelA2H</a>.' },
  { test: /ecommerce|e-commerce|vector|storefront|product/i, html: '<strong>AI-Powered E-Commerce Engine</strong> (Infotact internship).\nVector search over 5,000+ product embeddings (MongoDB Atlas Vector Search, cosine similarity), Redis cache-aside, JWT auth + admin RBAC, cart/orders, admin dashboard.\nStack: React 19 · Vite · Tailwind v4 · Node · Express · TypeScript · MongoDB · Redis.\nSource: <a href="https://github.com/Aashik029/infotact-mern-project-2" target="_blank" rel="noopener">github.com/Aashik029/infotact-mern-project-2</a>.' },
  { test: /collab|socket|real-time|realtime|workspace|presence/i, html: '<strong>Real-Time B2B Collaboration</strong> (Infotact internship).\nSocket.IO messaging, shared workspaces, JWT auth, online presence, typing indicators, release-board workflow.\nStack: React · Node · Express · TypeScript · MongoDB · Redis · Socket.IO · JWT.\nSource: <a href="https://github.com/Aashik029/infotact-mern-project1" target="_blank" rel="noopener">github.com/Aashik029/infotact-mern-project1</a>.' },
  { test: /skill|stack|tech|react|node|mongo|typescript|tailwind/i, html: 'Core stack — React, TypeScript, Node.js, Express, MongoDB (incl. Atlas Vector Search), Redis, Socket.IO, Tailwind / SvelteKit, Vercel + GitHub Actions.\nFull list lives in <a href="#skills">Services</a> — six focused areas: Frontend & UI, Real-time, Backend & APIs, Data & AI, Tools & Delivery, AI-Assisted Workflow.' },
  { test: /intern|experience|job|cognifyz|infotact/i, html: 'Two internships in 2026 —\n• <strong>Cognifyz IT Solutions</strong> (May–June) — Full Stack Development Intern: frontend + backend workflows, real delivery tasks.\n• <strong>Infotact Solutions</strong> (June–August) — Web Development Intern: shipped both MERN internship projects with JWT auth, Redis and Socket.IO.\nFull timeline: <a href="#experience">The Journey</a>.' },
  { test: /resume|cv|pdf/i, html: 'Here’s the latest PDF — <a href="assets/Aashik-Resume.pdf" download>Download Aashik-Resume.pdf</a>.\nSnapshot: B.E. CSE, J.J College of Engineering & Technology (CGPA 7.93), expected June 2028.' },
  { test: /contact|email|phone|hire|reach|location|where/i, html: 'Direct line — <a href="mailto:aashikahamed029@gmail.com">aashikahamed029@gmail.com</a> · <a href="tel:+919944460616">+91 99444 60616</a>\nBased in Trichy, Tamil Nadu, India.\nLinkedIn: <a href="https://www.linkedin.com/in/aashikahamed029" target="_blank" rel="noopener">aashikahamed029</a> · GitHub: <a href="https://github.com/Aashik029" target="_blank" rel="noopener">Aashik029</a>\nOr use the <a href="#contact">contact form</a>.' },
  { test: /education|college|cgpa|degree|b\.e|university/i, html: 'B.E. Computer Science & Engineering — J.J College of Engineering and Technology, Trichy.\nCurrent CGPA <strong>7.93</strong> · expected graduation <strong>June 2028</strong>.' },
  { test: /certif|ibm|google|hackerrank|achievement|award/i, html: 'Certifications —\n• Python for Data Science — IBM\n• AI-Powered Performance Ads — Google\n• Java (Basic) — HackerRank\nPlus EUDbot for <strong>Smart India Hackathon 2025</strong>.' },
  { test: /github|source|repo/i, html: 'GitHub profile: <a href="https://github.com/Aashik029" target="_blank" rel="noopener">github.com/Aashik029</a>.\nKey repos: techpixelA2H, infotact-mern-project-2, infotact-mern-project1, internship-campus-hiring-platform, Edubot.' },
  { test: /linkedin|social/i, html: 'LinkedIn: <a href="https://www.linkedin.com/in/aashikahamed029" target="_blank" rel="noopener">linkedin.com/in/aashikahamed029</a>.' },
  { test: /nova|assistant|bot|concierge/i, html: 'I’m <strong>NOVA</strong> — Aashik Ahamed A local portfolio concierge. No API keys, no tracking.\nI can answer about projects, skills, internships, résumé, contact, education, and certifications.' },
  { test: /about|who|intro/i, html: 'Aashik Ahamed A — full stack developer in Trichy, India. Builds responsive web apps with React, Node, MongoDB and AI-assisted workflows.\nRead more in <a href="#about">Intro</a>.' },
];
const NOVA_FALLBACK = 'I know the portfolio cold — projects, skills, internships, résumé, contact, education, certifications.\nTry a chip below, or ask “tell me about the e-commerce project”.';

const appendNova = (html, who) => {
  const div = document.createElement('div');
  div.className = `nova-msg ${who}`;
  div.innerHTML = html;
  novaBody.appendChild(div);
  novaBody.scrollTop = novaBody.scrollHeight;
  return div;
};
const answerNova = (q) => {
  const match = NOVA_ANSWERS.find(({ test }) => test.test(q));
  return match ? match.html : NOVA_FALLBACK;
};
const handleNovaQuery = (q) => {
  const clean = q.trim();
  if (!clean) return;
  appendNova(clean.replace(/</g, '&lt;'), 'user');
  const typing = appendNova('NOVA is typing…', 'bot');
  window.setTimeout(() => { typing.remove(); appendNova(answerNova(clean), 'bot'); }, prefersReducedMotion ? 60 : 520);
};
const openNova = () => {
  if (!nova) return;
  nova.hidden = false;
  if (novaOpen) novaOpen.setAttribute('aria-expanded', 'true');
  if (!novaWelcomed) { novaBody.innerHTML = ''; appendNova('Hi — I’m <strong>NOVA</strong>, Aashik Ahamed A portfolio concierge.\nAsk me about projects, skills, internships, résumé, contact, education, certifications, or GitHub. Tap a chip to start.', 'bot'); novaWelcomed = true; }
  if (novaInput) novaInput.focus();
};
const closeNova = () => {
  if (!nova) return;
  nova.hidden = true;
  if (novaOpen) { novaOpen.setAttribute('aria-expanded', 'false'); novaOpen.focus(); }
};
if (nova && novaOpen) {
  novaOpen.addEventListener('click', openNova);
  if (novaAbout) novaAbout.addEventListener('click', (e) => { e.preventDefault(); openNova(); });
  if (novaClose) novaClose.addEventListener('click', closeNova);
  window.addEventListener('keydown', (e) => { if (!nova.hidden && e.key === 'Escape') closeNova(); });
  if (novaForm) novaForm.addEventListener('submit', (e) => { e.preventDefault(); handleNovaQuery(novaInput.value); novaInput.value = ''; });
  if (novaChips) novaChips.addEventListener('click', (e) => { const btn = e.target.closest('[data-ask]'); if (btn) handleNovaQuery(btn.dataset.ask); });
}

/* ---------- Keep the floating trigger clear of the footer bottom row ---------- */
const footerBottom = $('.ContactFooter-module__oCUkFa__footerBottom');
if (novaOpen && footerBottom && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    novaOpen.classList.toggle('is-hidden', entry.isIntersecting);
  }, { threshold: 0.9 }).observe(footerBottom);
}
