(() => {
  'use strict';

  const root = document.getElementById('nc-root');
  const navButtons = [...document.querySelectorAll('.nav-item')];
  const clean = value => (value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('es-MX');

  function findSmallestTextElement(label) {
    if (!root) return null;
    const wanted = clean(label);
    const candidates = root.querySelectorAll('legend, label, h1, h2, h3, h4, h5, button, span, p, div');
    let best = null;
    for (const el of candidates) {
      const text = clean(el.textContent);
      if (text !== wanted && !text.startsWith(wanted + ' ') && !text.startsWith(wanted + '·')) continue;
      if (!best || el.children.length < best.children.length) best = el;
      if (el.children.length === 0) break;
    }
    return best;
  }

  function sectionContainer(el) {
    if (!el) return null;
    const fieldset = el.closest('fieldset');
    if (fieldset) return fieldset;
    let node = el;
    for (let i = 0; i < 5 && node && node !== root; i += 1, node = node.parentElement) {
      const rect = node.getBoundingClientRect();
      if (rect.height >= 70 && rect.height <= 950 && rect.width >= 280) return node;
    }
    return el;
  }

  function markSections() {
    const labels = ['Inicio', 'Misión', 'Visión', 'Carrusel principal', 'Trabajos realizados', 'Marcas'];
    labels.forEach(label => {
      const match = findSmallestTextElement(label);
      const section = sectionContainer(match);
      if (section) {
        section.classList.add('iintegra-section');
        section.dataset.iintegraSection = label;
      }
    });
  }

  function activate(button) {
    navButtons.forEach(btn => btn.classList.toggle('is-active', btn === button));
  }

  function goToLabel(label, button) {
    markSections();
    const match = root.querySelector(`[data-iintegra-section="${CSS.escape(label)}"]`) || sectionContainer(findSmallestTextElement(label));
    if (!match) return;
    activate(button);
    match.scrollIntoView({ behavior: 'smooth', block: 'start' });
    match.classList.remove('iintegra-section-highlight');
    void match.offsetWidth;
    match.classList.add('iintegra-section-highlight');
    setTimeout(() => match.classList.remove('iintegra-section-highlight'), 1500);
  }

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.target === 'top') {
        activate(button);
        document.getElementById('admin-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (button.dataset.search) goToLabel(button.dataset.search, button);
    });
  });

  if (root) {
    const observer = new MutationObserver(() => markSections());
    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(markSections, 900);
    window.setTimeout(markSections, 2200);
  }
})();
