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
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 681px)').addEventListener('change', closeMenu);

const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href')));
let ticking = false;
function updateActiveLink() {
  const threshold = window.innerHeight * .35;
  let active = sections[0];
  for (const section of sections) if (section.getBoundingClientRect().top <= threshold) active = section;
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

const citations = {
  expert: `@inproceedings{zhang2026dualview,
  title     = {Dual-View Self-Supervised Pre-Training for Expert Finding},
  author    = {Zhang, Mingqiao and Liu, Hongtao and Wang, Yinghui and Wang, Yumeng and Peng, Qiyao},
  booktitle = {Proceedings of the Thirty-Fifth International Joint Conference on Artificial Intelligence},
  pages     = {3232--3240},
  year      = {2026},
  doi       = {10.24963/ijcai.2026/359}
}`,
  evidence: `@misc{zhang2026rethinking,
  title         = {Rethinking Evidence Modeling: Context-Coupled Graph Learning for Multimodal Recommendation},
  author        = {Zhang, Mingqiao and Peng, Qiyao and Wang, Yumeng and Dong, Wenzhe and Liu, Hongtao and Yang, Jian},
  year          = {2026},
  eprint        = {2610.15523},
  archivePrefix = {arXiv},
  primaryClass  = {cs.IR},
  url           = {https://arxiv.org/abs/2610.15523}
}`,
  leakage: `@misc{zhang2026benchmark,
  title         = {Benchmark Leakage Trap: Can We Trust LLM-based Recommendation?},
  author        = {Zhang, Mingqiao and Peng, Qiyao and Wang, Yinghui and Liu, Hongtao and Wang, Yumeng},
  year          = {2026},
  eprint        = {2602.13626},
  archivePrefix = {arXiv},
  primaryClass  = {cs.LG},
  url           = {https://arxiv.org/abs/2602.13626}
}`
};
const citationDialog = document.querySelector('#citation-dialog');
document.querySelectorAll('[data-cite]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#citation-text').textContent = citations[button.dataset.cite];
  document.querySelector('#copy-status').textContent = '';
  citationDialog.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('#copy-citation').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(document.querySelector('#citation-text').textContent);
    status.textContent = 'Citation copied to clipboard.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#citation-text'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C (or ⌘C) to copy.';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
