const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.querySelector('.brand').addEventListener('click', closeMenu);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 681px)').addEventListener('change', closeMenu);

const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href')));
let ticking = false;
function updateActiveLink() {
  const threshold = document.querySelector('.site-header').getBoundingClientRect().height + 32;
  let active = sections[0];
  for (const section of sections) if (section.getBoundingClientRect().top <= threshold) active = section;
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) active = sections[sections.length - 1];
  for (const link of sectionLinks) {
    const selected = link.getAttribute('href') === `#${active.id}`;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateActiveLink); }
}, { passive: true });
updateActiveLink();

const imageDialog = document.querySelector('#image-dialog');
document.querySelectorAll('[data-lightbox]').forEach(button => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#lightbox-image');
    image.src = button.dataset.lightbox;
    image.alt = button.querySelector('img').alt;
    document.querySelector('#image-caption').textContent = button.dataset.caption;
    imageDialog.showModal();
    document.body.classList.add('modal-open');
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
