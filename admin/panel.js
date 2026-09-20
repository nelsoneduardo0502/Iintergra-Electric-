(() => {
  'use strict';

  const dashboardArea = document.getElementById('dashboardArea');
  const editorArea = document.getElementById('editorArea');
  const dashboardContent = document.getElementById('dashboardContent');
  const viewTitle = document.getElementById('viewTitle');
  const viewDescription = document.getElementById('viewDescription');
  const editorTitle = document.getElementById('editorTitle');
  const refreshButton = document.getElementById('refreshData');
  const backButton = document.getElementById('backToPanel');
  const navButtons = [...document.querySelectorAll('.nav-item')];
  const root = document.getElementById('nc-root');
  const toast = document.getElementById('toast');
  const previewMedia = document.getElementById('editorPreviewMedia');
  const previewBadge = document.getElementById('editorPreviewBadge');
  const previewHeading = document.getElementById('editorPreviewHeading');
  const previewText = document.getElementById('editorPreviewText');
  const cmsFormTitle = document.getElementById('cmsFormTitle');

  let siteData = null;
  let currentView = 'resumen';
  let toastTimer = null;

  const viewMeta = {
    resumen: ['Administrador', 'Gestiona el contenido público del sitio sin tocar código, diseño ni SEO.'],
    inicio: ['Inicio', 'Revisa y modifica la descripción principal que aparece en la portada.'],
    mision: ['Misión', 'Mantén actualizada la misión comercial de IINTEGRA ELECTRIC.'],
    vision: ['Visión', 'Edita la visión de la empresa de forma segura.'],
    carrusel: ['Carrusel principal', 'Administra las seis imágenes principales y sus textos descriptivos.'],
    trabajos: ['Trabajos realizados', 'Revisa las imágenes, títulos y descripciones de los proyectos publicados.'],
    marcas: ['Marcas', 'Administra las marcas mostradas en el sitio.']
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function activateNav(view) {
    navButtons.forEach(button => {
      button.classList.toggle('is-active', button.dataset.view === view);
    });
  }

  function safeText(value, fallback = '') {
    return typeof value === 'string' ? value : fallback;
  }

  function sanitizeImagePath(path) {
    if (typeof path !== 'string') return '';
    const trimmed = path.trim();
    if (!trimmed) return '';

    const cleanPath = trimmed.split('#')[0];
    const noQuery = cleanPath.split('?')[0].toLowerCase();

    if (
      noQuery.endsWith('.svg') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('javascript:')
    ) return '';

    try {
      const url = new URL(trimmed, window.location.origin + '/');
      if (url.origin !== window.location.origin) return '';
      return url.href;
    } catch {
      return '';
    }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function button(label, section, itemTitle = '') {
    const btn = el('button', 'edit-button', label);
    btn.type = 'button';
    btn.addEventListener('click', () => openEditor(section, itemTitle));
    return btn;
  }

  function imgElement(path, alt, className = 'thumb') {
    const img = document.createElement('img');
    img.className = className;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = safeText(alt, 'Imagen de IINTEGRA ELECTRIC');
    const src = sanitizeImagePath(path);
    if (src) {
      img.src = src;
    } else {
      img.alt = '';
      img.style.visibility = 'hidden';
    }
    img.addEventListener('error', () => {
      img.style.visibility = 'hidden';
    });
    return img;
  }

  function createPanelCard(title, description) {
    const card = el('section', 'panel-card');
    const head = el('div', 'panel-card-head');
    const copy = el('div');
    copy.append(el('h2', '', title), el('p', '', description));
    head.append(copy);
    card.append(head);
    return { card, head };
  }

  function createMetrics() {
    const slides = Array.isArray(siteData?.heroSlides) ? siteData.heroSlides.length : 0;
    const projects = Array.isArray(siteData?.projects) ? siteData.projects.length : 0;
    const brands = Array.isArray(siteData?.brands) ? siteData.brands.length : 0;

    const grid = el('section', 'metrics-grid');
    [
      ['Contenido', '4', 'secciones principales'],
      ['Carrusel', slides, 'imágenes publicadas'],
      ['Trabajos', projects, 'proyectos mostrados'],
      ['Marcas', brands, 'marcas visibles']
    ].forEach(([kicker, value, label]) => {
      const card = el('article', 'metric-card');
      card.append(
        el('span', 'metric-kicker', kicker),
        el('strong', 'metric-value', value),
        el('span', 'metric-label', label)
      );
      grid.append(card);
    });
    return grid;
  }

  function renderSummary() {
    dashboardContent.replaceChildren();

    dashboardContent.append(createMetrics());

    const split = el('section', 'summary-split');

    const hero = el('article', 'hero-summary');
    const firstSlide = siteData?.heroSlides?.[0];
    if (firstSlide) {
      hero.append(imgElement(firstSlide.image, firstSlide.alt, 'hero-summary-image'));
    }
    const heroContent = el('div', 'hero-summary-content');
    heroContent.append(
      el('span', 'eyebrow', 'PORTADA DEL SITIO'),
      el('h2', '', 'CONTINUIDAD OPERATIVA GARANTIZADA.'),
      el('p', '', safeText(siteData?.hero?.description, 'Descripción principal del sitio.'))
    );
    heroContent.append(button('Editar inicio', 'Inicio'));
    hero.append(heroContent);

    const stack = el('div', 'quick-stack');

    const mission = el('article', 'quick-card');
    mission.append(
      el('span', '', 'MISIÓN'),
      el('strong', '', safeText(siteData?.mission?.title, 'Misión')),
      el('p', '', safeText(siteData?.mission?.text, '').slice(0, 175) + (safeText(siteData?.mission?.text, '').length > 175 ? '…' : ''))
    );
    mission.append(button('Editar misión', 'Misión'));

    const vision = el('article', 'quick-card');
    vision.append(
      el('span', '', 'VISIÓN'),
      el('strong', '', safeText(siteData?.vision?.title, 'Visión')),
      el('p', '', safeText(siteData?.vision?.text, '').slice(0, 175) + (safeText(siteData?.vision?.text, '').length > 175 ? '…' : ''))
    );
    vision.append(button('Editar visión', 'Visión'));

    stack.append(mission, vision);
    split.append(hero, stack);
    dashboardContent.append(split);

    const projectsBlock = createPanelCard('Trabajos recientes', 'Vista rápida de los proyectos que aparecen publicados.');
    const headButton = button('Administrar trabajos', 'Trabajos realizados');
    headButton.classList.add('primary');
    projectsBlock.head.append(headButton);

    const table = el('table', 'data-table');
    const thead = document.createElement('thead');
    const hr = document.createElement('tr');
    ['Imagen', 'Trabajo', 'Categoría', 'Descripción', 'Acción'].forEach(t => hr.append(el('th', '', t)));
    thead.append(hr);
    const tbody = document.createElement('tbody');

    (siteData?.projects || []).slice(0, 4).forEach(project => {
      const tr = document.createElement('tr');
      const tdImg = document.createElement('td');
      tdImg.append(imgElement(project.image, project.alt, 'thumb'));

      const tdTitle = document.createElement('td');
      tdTitle.append(el('strong', 'item-title', project.title));

      const tdCat = document.createElement('td');
      tdCat.append(el('span', 'category-pill', project.category));

      const tdDesc = document.createElement('td');
      tdDesc.append(el('div', 'item-description', project.description));

      const tdAction = document.createElement('td');
      tdAction.append(button('Editar', 'Trabajos realizados', project.title));

      tr.append(tdImg, tdTitle, tdCat, tdDesc, tdAction);
      tbody.append(tr);
    });

    table.append(thead, tbody);
    projectsBlock.card.append(table);
    dashboardContent.append(projectsBlock.card);
  }

  function renderTextSection(kind) {
    dashboardContent.replaceChildren();

    const isMission = kind === 'mision';
    const data = isMission ? siteData?.mission : siteData?.vision;
    const label = isMission ? 'Misión' : 'Visión';

    const card = el('section', 'content-card');
    const copy = el('div');
    copy.append(
      el('span', 'section-tag', label),
      el('h2', '', safeText(data?.title, label)),
      el('p', '', safeText(data?.text, ''))
    );

    const actions = el('div', 'content-actions');
    const edit = button(`Editar ${label.toLowerCase()}`, label);
    edit.classList.add('primary');
    actions.append(edit);

    card.append(copy, actions);
    dashboardContent.append(card);
  }

  function renderInicio() {
    dashboardContent.replaceChildren();

    const firstSlide = siteData?.heroSlides?.[0];
    const card = el('article', 'hero-summary');
    if (firstSlide) {
      card.append(imgElement(firstSlide.image, firstSlide.alt, 'hero-summary-image'));
    }
    const content = el('div', 'hero-summary-content');
    content.append(
      el('span', 'eyebrow', 'INICIO'),
      el('h2', '', 'CONTINUIDAD OPERATIVA GARANTIZADA.'),
      el('p', '', safeText(siteData?.hero?.description, ''))
    );
    const edit = button('Editar descripción', 'Inicio');
    edit.classList.add('primary');
    content.append(edit);
    card.append(content);
    dashboardContent.append(card);
  }

  function renderCarousel() {
    dashboardContent.replaceChildren();

    const block = createPanelCard('Carrusel principal', 'Las imágenes que acompañan la portada y el bloque de trabajos destacados.');
    block.card.append(el('div', 'gallery-grid'));

    const grid = block.card.querySelector('.gallery-grid');
    (siteData?.heroSlides || []).forEach((slide, index) => {
      const card = el('article', 'gallery-card');
      const imageWrap = el('div', 'gallery-card-image');
      imageWrap.append(
        imgElement(slide.image, slide.alt, ''),
        el('span', 'gallery-index', String(index + 1).padStart(2, '0'))
      );
      const body = el('div', 'gallery-card-body');
      body.append(
        el('strong', '', safeText(slide.label, `Imagen ${index + 1}`)),
        el('small', '', safeText(slide.alt, 'Sin descripción'))
      );
      body.append(button('Editar imagen', 'Carrusel principal', slide.label));
      card.append(imageWrap, body);
      grid.append(card);
    });

    dashboardContent.append(block.card);
  }

  function renderProjects() {
    dashboardContent.replaceChildren();

    const block = createPanelCard('Trabajos realizados', 'Proyectos publicados actualmente en el sitio.');

    const table = el('table', 'data-table');
    const thead = document.createElement('thead');
    const hr = document.createElement('tr');
    ['Imagen', 'Proyecto', 'Categoría', 'Descripción', 'Acciones'].forEach(t => hr.append(el('th', '', t)));
    thead.append(hr);

    const tbody = document.createElement('tbody');
    (siteData?.projects || []).forEach(project => {
      const tr = document.createElement('tr');

      const tdImg = document.createElement('td');
      tdImg.append(imgElement(project.image, project.alt, 'thumb large'));

      const tdTitle = document.createElement('td');
      tdTitle.append(
        el('strong', 'item-title', safeText(project.title)),
        el('span', 'item-subtitle', safeText(project.alt))
      );

      const tdCat = document.createElement('td');
      tdCat.append(el('span', 'category-pill', safeText(project.category)));

      const tdDesc = document.createElement('td');
      tdDesc.append(el('div', 'item-description', safeText(project.description)));

      const tdAction = document.createElement('td');
      tdAction.append(button('Editar', 'Trabajos realizados', project.title));

      tr.append(tdImg, tdTitle, tdCat, tdDesc, tdAction);
      tbody.append(tr);
    });

    table.append(thead, tbody);
    block.card.append(table);
    dashboardContent.append(block.card);
  }

  function renderBrands() {
    dashboardContent.replaceChildren();

    const block = createPanelCard('Marcas que manejamos', 'Nombres y categorías mostrados públicamente en la sección de marcas.');
    const grid = el('div', 'brand-grid');

    (siteData?.brands || []).forEach((brand, index) => {
      const card = el('article', 'brand-card');
      card.append(
        el('span', 'section-tag', `Marca ${index + 1}`),
        el('strong', 'brand-name', safeText(brand.name)),
        el('span', 'brand-category', safeText(brand.category))
      );
      card.append(button('Editar marca', 'Marcas que manejamos', brand.name));
      grid.append(card);
    });

    block.card.append(grid);
    dashboardContent.append(block.card);
  }

  function renderCurrentView() {
    if (!siteData) return;
    const [title, description] = viewMeta[currentView] || viewMeta.resumen;
    viewTitle.textContent = title;
    viewDescription.textContent = description;

    if (currentView === 'resumen') return renderSummary();
    if (currentView === 'inicio') return renderInicio();
    if (currentView === 'mision' || currentView === 'vision') return renderTextSection(currentView);
    if (currentView === 'carrusel') return renderCarousel();
    if (currentView === 'trabajos') return renderProjects();
    if (currentView === 'marcas') return renderBrands();
  }

  async function loadData(showFeedback = false) {
    if (showFeedback) showToast('Actualizando contenido…');
    try {
      const response = await fetch(`../content/site.json?v=${Date.now()}`, {
        cache: 'no-store',
        credentials: 'same-origin'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      siteData = data;
      renderCurrentView();
      if (showFeedback) showToast('Contenido actualizado');
    } catch (error) {
      dashboardContent.replaceChildren();
      const state = el('div', 'empty-state');
      state.append(
        el('strong', '', 'No se pudo cargar el contenido'),
        el('span', '', 'Recarga la página o verifica que content/site.json exista en el repositorio.')
      );
      dashboardContent.append(state);
      console.error('IINTEGRA admin: site.json load failed', error);
    }
  }

  function clean(value) {
    return (value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('es-MX');
  }

  function findSmallestTextElement(label, scope = root) {
    if (!scope) return null;
    const wanted = clean(label);
    const candidates = scope.querySelectorAll('legend, label, h1, h2, h3, h4, h5, button, span, p, div');
    let best = null;
    for (const candidate of candidates) {
      const text = clean(candidate.textContent);
      if (text !== wanted && !text.startsWith(wanted + ' ') && !text.startsWith(wanted + '·')) continue;
      if (!best || candidate.children.length < best.children.length) best = candidate;
      if (candidate.children.length === 0) break;
    }
    return best;
  }

  function sectionContainer(element) {
    if (!element) return null;
    const fieldset = element.closest('fieldset');
    if (fieldset) return fieldset;

    let node = element;
    for (let i = 0; i < 6 && node && node !== root; i += 1, node = node.parentElement) {
      const rect = node.getBoundingClientRect();
      if (rect.height >= 58 && rect.height <= 1800 && rect.width >= 280) return node;
    }
    return element;
  }

  function maybeExpand(container, label) {
    if (!container) return;
    const buttons = [...container.querySelectorAll('button,[role="button"]')];
    const labeled = buttons.find(b => clean(b.textContent).includes(clean(label)));
    if (labeled) {
      const expanded = labeled.getAttribute('aria-expanded');
      if (expanded === 'false') labeled.click();
      return;
    }

    if (container.getBoundingClientRect().height < 110) {
      const first = buttons[0];
      if (first) first.click();
    }
  }

  function highlightAndScroll(element) {
    if (!element) return;
    const target = sectionContainer(element);
    target.classList.add('iintegra-section');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.remove('iintegra-section-highlight');
    void target.offsetWidth;
    target.classList.add('iintegra-section-highlight');
    window.setTimeout(() => target.classList.remove('iintegra-section-highlight'), 1400);
  }

  function locateEditor(sectionLabel, itemTitle = '', attempt = 0) {
    const sectionElement = findSmallestTextElement(sectionLabel);
    if (!sectionElement) {
      if (attempt < 20) {
        window.setTimeout(() => locateEditor(sectionLabel, itemTitle, attempt + 1), 250);
      } else {
        showToast('El editor abrió. Selecciona la sección indicada para continuar.');
      }
      return;
    }

    const container = sectionContainer(sectionElement);
    maybeExpand(container, sectionLabel);

    if (!itemTitle) {
      highlightAndScroll(container);
      return;
    }

    window.setTimeout(() => {
      const item = findSmallestTextElement(itemTitle, container);
      if (item) {
        const itemContainer = sectionContainer(item);
        maybeExpand(itemContainer, itemTitle);
        highlightAndScroll(itemContainer);
      } else {
        highlightAndScroll(container);
        showToast('Se abrió la sección. Selecciona el elemento que deseas editar.');
      }
    }, 350);
  }

  function clearEditorFocus() {
    if (!root) return;
    root.querySelectorAll('.iintegra-section').forEach(section => {
      section.classList.remove('iintegra-focus-target', 'iintegra-nonfocus-section');
    });
  }

  function focusOnlySection(sectionLabel) {
    if (!root) return;
    const sections = [...root.querySelectorAll('.iintegra-section')];
    if (!sections.length) return;
    sections.forEach(section => {
      const same = clean(section.dataset.iintegraSection) === clean(sectionLabel);
      section.classList.toggle('iintegra-focus-target', same);
      section.classList.toggle('iintegra-nonfocus-section', !same);
    });
  }

  function setPreviewImage(path, alt) {
    if (!previewMedia) return;
    previewMedia.replaceChildren();
    const src = sanitizeImagePath(path);
    if (!src) {
      previewMedia.hidden = true;
      return;
    }
    const image = imgElement(path, alt, '');
    previewMedia.append(image);
    previewMedia.hidden = false;
  }

  function populateEditorPreview(sectionLabel, itemTitle = '') {
    if (!siteData) return;
    previewBadge.textContent = sectionLabel;
    cmsFormTitle.textContent = itemTitle ? `Editar · ${itemTitle}` : `Editar · ${sectionLabel}`;
    previewMedia.hidden = true;
    previewMedia.replaceChildren();

    if (sectionLabel === 'Inicio') {
      previewHeading.textContent = 'CONTINUIDAD OPERATIVA GARANTIZADA.';
      previewText.textContent = safeText(siteData?.hero?.description, 'Descripción principal del sitio.');
      const slide = siteData?.heroSlides?.[0];
      if (slide) setPreviewImage(slide.image, slide.alt);
      return;
    }

    if (sectionLabel === 'Misión') {
      previewHeading.textContent = safeText(siteData?.mission?.title, 'Misión');
      previewText.textContent = safeText(siteData?.mission?.text, '');
      return;
    }

    if (sectionLabel === 'Visión') {
      previewHeading.textContent = safeText(siteData?.vision?.title, 'Visión');
      previewText.textContent = safeText(siteData?.vision?.text, '');
      return;
    }

    if (sectionLabel === 'Carrusel principal') {
      const slide = (siteData?.heroSlides || []).find(item => clean(item.label) === clean(itemTitle)) || siteData?.heroSlides?.[0];
      previewHeading.textContent = safeText(slide?.label, itemTitle || 'Imagen del carrusel');
      previewText.textContent = safeText(slide?.alt, 'Imagen publicada en el carrusel principal.');
      if (slide) setPreviewImage(slide.image, slide.alt);
      return;
    }

    if (sectionLabel === 'Trabajos realizados') {
      const project = (siteData?.projects || []).find(item => clean(item.title) === clean(itemTitle)) || siteData?.projects?.[0];
      previewHeading.textContent = safeText(project?.title, itemTitle || 'Trabajo realizado');
      previewText.textContent = [safeText(project?.category), safeText(project?.description)].filter(Boolean).join('\n\n');
      if (project) setPreviewImage(project.image, project.alt);
      return;
    }

    if (sectionLabel === 'Marcas que manejamos') {
      const brand = (siteData?.brands || []).find(item => clean(item.name) === clean(itemTitle)) || siteData?.brands?.[0];
      previewHeading.textContent = safeText(brand?.name, itemTitle || 'Marca');
      previewText.textContent = safeText(brand?.category, 'Marca publicada en el sitio.');
      return;
    }

    previewHeading.textContent = itemTitle || sectionLabel;
    previewText.textContent = 'Edita únicamente los campos necesarios y publica cuando termines.';
  }

  function openEditor(sectionLabel, itemTitle = '') {
    document.body.classList.add('editor-mode');
    dashboardArea.hidden = true;
    editorArea.hidden = false;
    editorTitle.textContent = itemTitle ? `Editar · ${itemTitle}` : `Editar · ${sectionLabel}`;
    populateEditorPreview(sectionLabel, itemTitle);

    const viewBySection = {
      'Inicio': 'inicio',
      'Misión': 'mision',
      'Visión': 'vision',
      'Carrusel principal': 'carrusel',
      'Trabajos realizados': 'trabajos',
      'Marcas que manejamos': 'marcas'
    };
    const mappedView = viewBySection[sectionLabel];
    if (mappedView) activateNav(mappedView);

    clearEditorFocus();
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.dispatchEvent(new Event('resize'));
    window.setTimeout(() => {
      focusOnlySection(sectionLabel);
      locateEditor(sectionLabel, itemTitle);
    }, 450);
  }

  function closeEditor() {
    clearEditorFocus();
    document.body.classList.remove('editor-mode');
    editorArea.hidden = true;
    dashboardArea.hidden = false;
    activateNav(currentView);
    window.scrollTo({ top: 0, behavior: 'instant' });
    loadData(false);
  }

  navButtons.forEach(buttonNode => {
    buttonNode.addEventListener('click', () => {
      currentView = buttonNode.dataset.view || 'resumen';
      activateNav(currentView);

      if (!dashboardArea.hidden) {
        renderCurrentView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        closeEditor();
        renderCurrentView();
      }
    });
  });

  refreshButton?.addEventListener('click', () => loadData(true));
  backButton?.addEventListener('click', closeEditor);

  // Marca las secciones de Decap cuando el editor termine de renderizar.
  if (root) {
    const observer = new MutationObserver(() => {
      ['Inicio', 'Misión', 'Visión', 'Carrusel principal', 'Trabajos realizados', 'Marcas que manejamos']
        .forEach(label => {
          const match = findSmallestTextElement(label);
          const section = sectionContainer(match);
          if (section) {
            section.classList.add('iintegra-section');
            section.dataset.iintegraSection = label;
          }
        });

      if (document.body.classList.contains('editor-mode')) {
        const active = editorTitle.textContent.replace(/^Editar\s*·\s*/, '').trim();
        const sectionMap = ['Inicio', 'Misión', 'Visión', 'Carrusel principal', 'Trabajos realizados', 'Marcas que manejamos'];
        const detected = sectionMap.find(label => clean(active) === clean(label) || clean(active).includes(clean(label)));
        if (detected) focusOnlySection(detected);
      }
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  loadData(false);
})();
