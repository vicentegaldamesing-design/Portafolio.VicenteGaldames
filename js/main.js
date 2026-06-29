const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const navToggle = document.querySelector('.sidebar__toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = navMenu.querySelectorAll('a[href^="#"]');
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
  sidebar.classList.remove('is-open');
  overlay.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú');
  document.body.style.overflow = '';
}

function openMenu() {
  sidebar.classList.add('is-open');
  overlay.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Cerrar menú');
  document.body.style.overflow = 'hidden';
}

navToggle.addEventListener('click', () => {
  sidebar.classList.contains('is-open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    },
    { threshold: 0.06 }
  );

  document.querySelectorAll('.rv, .rv1').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.rv, .rv1').forEach((el) => el.classList.add('in'));
}

/* Inline media viewer (project galleries) */
document.querySelectorAll('[data-media-viewer]').forEach((viewer) => {
  const stage = viewer.querySelector('.media-viewer__stage');
  const img = viewer.querySelector('.media-viewer__img');
  const video = viewer.querySelector('.media-viewer__video');
  const thumbs = viewer.querySelectorAll('.media-viewer__thumb');

  function showMedia(thumb) {
    const type = thumb.dataset.type;
    thumbs.forEach((t) => t.setAttribute('aria-pressed', 'false'));
    thumb.setAttribute('aria-pressed', 'true');
    stage.classList.remove('media-viewer__stage--empty');
    stage.hidden = false;

    if (type === 'video' && video) {
      img.hidden = true;
      video.hidden = false;
      video.currentTime = 0;
      video.load();
    } else {
      video?.pause();
      if (video) video.hidden = true;
      img.hidden = false;
      img.src = thumb.dataset.src;
      img.alt = thumb.dataset.alt || '';
    }
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => showMedia(thumb));
  });
});
