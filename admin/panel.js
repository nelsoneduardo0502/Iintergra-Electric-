(() => {
  'use strict';

  const dashboardArea = document.getElementById('dashboardArea');
  const editorArea = document.getElementById('editorArea');
  const dashboardContent = document.getElementById('dashboardContent');
  const viewTitle = document.getElementById('viewTitle');
  const viewDescription = document.getElementById('viewDescription');
  const editorTitle = document.getElementById('editorTitle');
  const editorSubtitle = document.getElementById('editorSubtitle');
  const editingNow = document.getElementById('editingNow');
  const cmsLoading = document.getElementById('cmsLoading');
  const refreshButton = document.getElementById('refreshData');
  const backButton = document.getElementById('backToPanel');
  const navButtons = [...document.querySelectorAll('.nav-item')];
  const root = document.getElementById('nc-root');
  const toast = document.getElementById('toast');

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

  const DECAP_SRC = 'https://unpkg.com/decap-cms@3.17.0-beta.0/dist/decap-cms.js';
  const EDITOR_HASH = '#/collections/site/entries/contenido_principal';
  let decapPromise = null;
  let editorSection = '';
  let editorItemTitle = '';

  function sectionToView(sectionLabel) {
    return ({
      'Inicio': 'inicio',
      'Misión': 'mision',
      'Visión': 'vision',
      'Carrusel principal': 'carrusel',
      'Trabajos realizados': 'trabajos',
      'Marcas que manejamos': 'marcas'
    })[sectionLabel] || 'resumen';
  }

  function loadDecap() {
    if (window.CMS) return Promise.resolve(window.CMS);
    if (decapPromise) return decapPromise;

    decapPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-iintegra-decap]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.CMS), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = DECAP_SRC;
      script.defer = true;
      script.dataset.iintegraDecap = 'true';
      script.onload = () => resolve(window.CMS);
      script.onerror = () => reject(new Error('No se pudo cargar Decap CMS'));
      document.body.appendChild(script);
    });

    return decapPromise;
  }

  function setEditorCopy(sectionLabel, itemTitle = '') {
    const title = itemTitle ? `Editar · ${itemTitle}` : `Editar · ${sectionLabel}`;
    editorTitle.textContent = title;
    editorSubtitle.textContent = `Sección: ${sectionLabel}. Realiza el cambio y usa Guardar/Publicar al terminar.`;
    editingNow.textContent = itemTitle
      ? `Editando ${sectionLabel}: ${itemTitle}.`
      : `Editando: ${sectionLabel}.`;
  }

  async function openEditor(sectionLabel, itemTitle = '') {
    editorSection = sectionLabel;
    editorItemTitle = itemTitle;

    currentView = sectionToView(sectionLabel);
    activateNav(currentView);
    setEditorCopy(sectionLabel, itemTitle);

    dashboardArea.hidden = true;
    editorArea.hidden = false;
    cmsLoading?.classList.remove('is-hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });

    // La ruta es la del archivo fijo real que Decap administra.
    if (window.location.hash !== EDITOR_HASH) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}${EDITOR_HASH}`);
    }

    try {
      await loadDecap();

      // Dejamos que Decap renderice completamente por su cuenta.
      // No buscamos, ocultamos, clicamos ni reacomodamos sus campos.
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      window.dispatchEvent(new Event('resize'));

      window.setTimeout(() => {
        cmsLoading?.classList.add('is-hidden');
      }, 900);
    } catch (error) {
      console.error('IINTEGRA admin: no se pudo abrir el editor', error);
      if (cmsLoading) {
        cmsLoading.innerHTML = '<div><strong>No se pudo abrir el editor.</strong><small>Recarga la página e inténtalo otra vez.</small></div>';
      }
    }
  }

  function closeEditor() {
    editorSection = '';
    editorItemTitle = '';
    editorArea.hidden = true;
    dashboardArea.hidden = false;

    // Limpiamos la ruta de Decap sin recargar la página.
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
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


  // Si el navegador vuelve a cargar mientras estaba en la ruta de edición,
  // abrimos el editor sin manipular su interfaz interna.
  if (window.location.hash.startsWith('#/collections/')) {
    openEditor('Contenido del sitio');
  }

  loadData(false);
})();
