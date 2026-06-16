// ============================================================
//  Nino Beluze — Portfolio interactions
// ============================================================

// Always land at the top on refresh (disable browser scroll restoration),
// unless the URL targets a specific section via #anchor.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky nav: add border/background once scrolled
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu toggle
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

const setMenu = (open) => {
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  mobileMenu.hidden = !open;
};

burger.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// Trust marquee: if a logo image is missing, fall back to the brand name as text
document.querySelectorAll('.trust__logo img').forEach((img) => {
  const toText = () => {
    const span = document.createElement('span');
    span.className = 'trust__fallback';
    span.textContent = img.dataset.name || img.alt || '';
    if (img.closest('.trust__logo').getAttribute('aria-hidden') === 'true') {
      span.setAttribute('aria-hidden', 'true');
    }
    img.replaceWith(span);
  };
  img.addEventListener('error', toText);
  if (img.complete && img.naturalWidth === 0) toText();
});

// Modals (native <dialog>): open via [data-modal], close via [data-close], backdrop click & ESC
document.querySelectorAll('[data-modal]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.modal);
    if (dlg && typeof dlg.showModal === 'function') {
      dlg.showModal();
      document.body.style.overflow = 'hidden';
    }
  });
});
document.querySelectorAll('dialog.modal').forEach((dlg) => {
  const close = () => dlg.close();
  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  // Click on the backdrop (outside the card) closes
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; });
});

// Modal 3D gallery: show a placeholder when a photo is missing
document.querySelectorAll('.modal__shot img').forEach((img) => {
  const toPlaceholder = () => {
    const ph = document.createElement('div');
    ph.className = 'modal__shot-ph';
    ph.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
      '<span>' + (img.dataset.ph || 'Photo à venir') + '</span>';
    img.replaceWith(ph);
  };
  img.addEventListener('error', toPlaceholder);
  if (img.complete && img.naturalWidth === 0) toPlaceholder();
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
}
