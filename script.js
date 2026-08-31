"use strict";

const WHATSAPP = "523319773148";

const catalog = [
  {
    id: "distribucion",
    name: "TABLERO DE DISTRIBUCIÓN",
    description: "Recibe una alimentación principal y la reparte de forma protegida hacia circuitos y cargas.",
    keywords: ["tablero", "distribucion", "baja tension", "proteccion", "energia"]
  },
  {
    id: "ccm",
    name: "CENTRO DE CONTROL DE MOTORES / CCM",
    description: "Agrupa maniobra, protección y control de motores en un solo tablero para operación industrial.",
    keywords: ["ccm", "motores", "control", "industrial", "arranque", "variadores"]
  },
  {
    id: "medidores",
    name: "MEDIDORES DIGITALES",
    description: "Supervisan energía, tensión, corriente y otras variables eléctricas para facilitar control y diagnóstico.",
    keywords: ["medidores", "digitales", "medicion", "energia", "kwh", "monitoreo"]
  },
  {
    id: "alumbrado",
    name: "TABLERO DE ALUMBRADO",
    description: "Distribuye y protege circuitos de iluminación para una operación ordenada, segura y fácil de mantener.",
    keywords: ["alumbrado", "iluminacion", "circuitos", "tablero"]
  },
  {
    id: "transferencias",
    name: "TRANSFERENCIAS AUTOMÁTICAS",
    description: "Conmutan entre la red normal y una fuente de respaldo para mantener el suministro ante una falla.",
    keywords: ["transferencia", "transferencias", "ats", "generador", "respaldo", "continuidad"]
  },
  {
    id: "automatizacion",
    name: "CONTROL Y AUTOMATIZACIÓN",
    description: "Integra PLC, relevadores y señales para controlar procesos y equipos de forma automatizada.",
    keywords: ["automatizacion", "plc", "control", "relevadores", "industrial"]
  },
  {
    id: "pruebas",
    name: "PRUEBAS Y DIAGNÓSTICO",
    description: "Verifica continuidad, aislamiento y funcionamiento antes de energizar o entregar el tablero.",
    keywords: ["pruebas", "diagnostico", "aislamiento", "continuidad", "soporte"]
  }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavbar();
  initMenu();
  initSearch();
  initCatalog();
  initCarousel();
  initCounters();
  initScrollReveal();
  initProcess();
  initCursor();
  initWizard();
  initSolutionButtons();
  initProjectsCarousel();
  initImageLightbox();
  initProductCarousels();
});

function initYear(){
  const year = new Date().getFullYear();
  $("#footer-year").textContent = year;
  $("#frame-year").textContent = year;
}

function initNavbar(){
  const nav = $("#navbar");
  const links = $$(".nav-links a[href^='#']");
  const sections = $$("main section[id]");

  const update = () => {
    nav.classList.toggle("scrolled", scrollY > 35);
  };
  addEventListener("scroll", update, {passive:true});
  update();

  if ("IntersectionObserver" in window){
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, {rootMargin:"-35% 0px -55% 0px"});
    sections.forEach(section => observer.observe(section));
  }
}

function initMenu(){
  const button = $("#menu-toggle");
  const nav = $("#nav-links");
  const headerContainer = $(".nav-container");
  const catalogButton = $(".nav-catalog", nav);

  if (!button || !nav || !headerContainer) return;

  let placeholder = document.createComment("nav-links-placeholder");
  let isPortaled = false;

  const portalToBody = () => {
    if (window.innerWidth <= 900 && !isPortaled) {
      nav.parentNode.insertBefore(placeholder, nav);
      document.body.appendChild(nav);
      nav.classList.add("mobile-nav-portal");
      isPortaled = true;
    }
  };

  const restoreToHeader = () => {
    if (window.innerWidth > 900 && isPortaled) {
      placeholder.parentNode.insertBefore(nav, placeholder);
      placeholder.remove();
      placeholder = document.createComment("nav-links-placeholder");
      nav.classList.remove("mobile-nav-portal");
      isPortaled = false;
    }
  };

  const closeMenu = () => {
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-open", "mobile-menu-active");
    document.documentElement.classList.remove("mobile-menu-active");
  };

  const openMenu = () => {
    portalToBody();
    nav.classList.add("open");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Cerrar menú");
    document.body.classList.add("menu-open", "mobile-menu-active");
    document.documentElement.classList.add("mobile-menu-active");
  };

  button.addEventListener("click", () => {
    nav.classList.contains("open") ? closeMenu() : openMenu();
  });

  $$(".nav-links a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  if (catalogButton) {
    catalogButton.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
      restoreToHeader();
    } else {
      portalToBody();
    }
  });

  portalToBody();
}

function normalize(text=""){
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
}

function initSearch(){
  const input = $("#site-search");
  const box = $("#search-results");
  const wrap = $("#search-wrap");

  const render = items => {
    box.innerHTML = "";
    if (!items.length){
      box.innerHTML = `<div class="search-result"><strong>SIN COINCIDENCIAS</strong><small>Prueba con “CCM”, “medidores”, “transferencias”, “alumbrado” o “distribución”.</small></div>`;
      box.classList.add("open");
      return;
    }
    items.slice(0,6).forEach(item => {
      const button = document.createElement("button");
      button.className = "search-result";
      button.type = "button";
      button.innerHTML = `<strong>${item.name}</strong><small>${item.description}</small>`;
      button.addEventListener("click", () => {
        box.classList.remove("open");
        input.value = item.name;
        document.querySelector(`[data-id="${item.id}"]`)?.scrollIntoView({behavior:"smooth", block:"center"});
      });
      box.appendChild(button);
    });
    box.classList.add("open");
  };

  input.addEventListener("input", () => {
    const q = normalize(input.value);
    if (!q){ box.classList.remove("open"); return; }
    render(catalog.filter(item => normalize(`${item.name} ${item.description} ${item.keywords.join(" ")}`).includes(q)));
  });

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
      e.preventDefault();
      input.focus();
      input.select();
    }
    if (e.key === "Escape") box.classList.remove("open");
  });

  document.addEventListener("click", e => {
    if (!wrap.contains(e.target)) box.classList.remove("open");
  });
}

function initCatalog(){
  const modal = $("#catalog-modal");
  const grid = $("#catalog-grid");
  const open = $("#open-catalog");
  const close = $("#close-catalog");

  catalog.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "catalog-item";
    button.innerHTML = `<strong>${item.name}</strong><p>${item.description}</p>`;
    button.addEventListener("click", () => {
      closeModal();
      document.querySelector(`[data-id="${item.id}"]`)?.scrollIntoView({behavior:"smooth", block:"center"});
    });
    grid.appendChild(button);
  });

  const openModal = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
  };
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  };
  open.addEventListener("click", openModal);
  close.addEventListener("click", closeModal);
  $$("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

function initCarousel(){
  const slides = $$(".carousel-slide");
  const dots = $$("#carousel-dots button");
  const count = $("#carousel-count");
  const progress = $("#carousel-progress");
  const prev = $("#carousel-prev");
  const next = $("#carousel-next");
  const carousel = $("#carousel");

  if (!slides.length || !carousel) return;

  let current = 0;
  let timer = null;
  let startedAt = 0;
  let remaining = 4000;
  const duration = 4000;
  let paused = false;

  const setProgress = (ms, fromFraction = 0) => {
    const from = Math.max(0, Math.min(1, fromFraction));
    progress.style.animation = "none";
    progress.style.width = `${from * 100}%`;
    progress.offsetHeight;

    const styleName = `carouselProgress-${Math.round(from * 1000)}`;
    const style = document.createElement("style");
    style.dataset.carouselTemp = "true";
    style.textContent = `@keyframes ${styleName}{from{width:${from * 100}%}to{width:100%}}`;
    document.head.appendChild(style);

    progress.style.animation = `${styleName} ${ms}ms linear forwards`;

    setTimeout(() => {
      style.remove();
    }, ms + 100);
  };

  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide,i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot,i) => dot.classList.toggle("active", i === current));
    count.textContent = `${String(current+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;
  };

  const schedule = (ms = duration, fraction = 0) => {
    clearTimeout(timer);
    remaining = ms;
    startedAt = performance.now();
    setProgress(ms, fraction);

    timer = setTimeout(() => {
      show(current + 1);
      schedule(duration, 0);
    }, ms);
  };

  const pause = () => {
    if (paused) return;
    paused = true;
    clearTimeout(timer);

    const elapsed = performance.now() - startedAt;
    remaining = Math.max(0, remaining - elapsed);

    const computed = getComputedStyle(progress).width;
    progress.style.animation = "none";
    progress.style.width = computed;
  };

  const resume = () => {
    if (!paused) return;
    paused = false;

    const fraction = 1 - (remaining / duration);
    schedule(Math.max(remaining, 60), fraction);
  };

  const jump = index => {
    paused = false;
    show(index);
    schedule(duration, 0);
  };

  prev?.addEventListener("click", event => {
    event.stopPropagation();
    jump(current - 1);
  });

  next?.addEventListener("click", event => {
    event.stopPropagation();
    jump(current + 1);
  });

  dots.forEach((dot,i) => dot.addEventListener("click", event => {
    event.stopPropagation();
    jump(i);
  }));

  carousel.addEventListener("mouseenter", pause);
  carousel.addEventListener("mouseleave", resume);

  // En móvil no hay hover; visibilidad de pestaña sí pausa de forma correcta.
  document.addEventListener("visibilitychange", () => {
    document.hidden ? pause() : resume();
  });

  show(0);
  schedule(duration, 0);
}

function initCounters(){
  const counters = $$(".counter");
  const animate = el => {
    const target = Number(el.dataset.target || 0);
    const decimals = Number(el.dataset.decimals || 0);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1500;

    const tick = now => {
      const t = Math.min((now-start)/duration,1);
      const eased = 1 - Math.pow(1-t,3);
      el.textContent = prefix + (target*eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)){ counters.forEach(animate); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, {threshold:.5});
  counters.forEach(c => observer.observe(c));
}

function initScrollReveal(){
  const elements = $$(".scroll-reveal");
  const groups = [".metrics-grid",".about-grid",".services-grid",".solutions-grid",".process",".footer-grid"];
  groups.forEach(selector => {
    const group = $(selector);
    if (!group) return;
    [...group.children].forEach((child,i) => child.style.setProperty("--delay", `${Math.min(i*90,360)}ms`));
  });

  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("animate-in");
      observer.unobserve(entry.target);
    });
  }, {threshold:.08, rootMargin:"0px 0px -3% 0px"});
  elements.forEach(el => observer.observe(el));
}

function initProcess(){
  const process = $("#process");
  if (!process || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      process.classList.add("active");
      observer.unobserve(process);
    });
  }, {threshold:.28});
  observer.observe(process);
}

function initCursor(){
  const glow = $("#cursor-glow");
  if (!matchMedia("(pointer:fine)").matches) return;
  let raf = null, x = 0, y = 0;
  document.addEventListener("mousemove", e => {
    x = e.clientX; y = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      raf = null;
    });
  }, {passive:true});
}

function initSolutionButtons(){
  $$(".quote-solution").forEach(btn => {
    btn.addEventListener("click", () => {
      openWizard(btn.dataset.solution || "");
    });
  });
}

let wizardSolution = "";
let wizardStep = 1;

function initWizard(){
  const modal = $("#wizard-modal");
  const open = $("#open-wizard");
  const close = $("#close-wizard");
  const prev = $("#wizard-prev");
  const next = $("#wizard-next");
  const submit = $("#wizard-submit");
  const form = $("#wizard-form");

  window.openWizard = solution => {
    wizardSolution = solution || "";
    $$(".wizard-options button").forEach(btn => btn.classList.toggle("selected", btn.dataset.value === wizardSolution));
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    setWizardStep(1);
  };

  const closeWizard = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  };

  open.addEventListener("click", () => openWizard(""));
  close.addEventListener("click", closeWizard);
  $$("[data-close-wizard]").forEach(el => el.addEventListener("click", closeWizard));

  $$(".wizard-options button").forEach(btn => {
    btn.addEventListener("click", () => {
      wizardSolution = btn.dataset.value;
      $$(".wizard-options button").forEach(b => b.classList.toggle("selected", b === btn));
    });
  });

  prev.addEventListener("click", () => setWizardStep(wizardStep-1));
  next.addEventListener("click", () => {
    if (wizardStep === 1 && !wizardSolution){
      alert("Selecciona una solución o elige “No estoy seguro”.");
      return;
    }
    setWizardStep(wizardStep+1);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#wizard-name").value.trim();
    if (!name){ alert("Agrega tu nombre o empresa."); return; }

    const message = [
      "Hola, deseo solicitar una cotización con Iintegra Electric.",
      "",
      `Nombre / Empresa: ${name}`,
      `Correo: ${$("#wizard-email").value.trim() || "No indicado"}`,
      `Solución: ${wizardSolution}`,
      `Tensión: ${$("#wizard-voltage").value.trim() || "Por definir"}`,
      `Corriente / capacidad: ${$("#wizard-current").value.trim() || "Por definir"}`,
      `Cantidad: ${$("#wizard-quantity").value || "1"}`,
      "",
      "Detalles:",
      $("#wizard-details").value.trim() || "Sin detalles adicionales"
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
}

function setWizardStep(step){
  wizardStep = Math.max(1,Math.min(4,step));
  $$(".wizard-step").forEach(s => s.classList.toggle("active", Number(s.dataset.step) === wizardStep));
  $("#wizard-progress").style.width = `${wizardStep*25}%`;
  $("#wizard-prev").style.visibility = wizardStep === 1 ? "hidden" : "visible";
  $("#wizard-next").classList.toggle("hidden", wizardStep === 4);
  $("#wizard-submit").classList.toggle("hidden", wizardStep !== 4);

  if (wizardStep === 4){
    $("#wizard-summary").innerHTML = `
      <strong>${wizardSolution || "Solución por definir"}</strong><br>
      Tensión: ${$("#wizard-voltage").value || "Por definir"}<br>
      Corriente/capacidad: ${$("#wizard-current").value || "Por definir"}<br>
      Cantidad: ${$("#wizard-quantity").value || "1"}
    `;
  }
}


function initProjectsCarousel(){
  const slides = $$(".project-slide");
  const dots = $$("#projects-dots button");
  const prev = $("#projects-prev");
  const next = $("#projects-next");

  if (!slides.length || !prev || !next) return;

  let current = 0;
  let timer;
  const duration = 6500;

  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  };

  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), duration);
  };

  prev.addEventListener("click", () => {
    show(current - 1);
    start();
  });

  next.addEventListener("click", () => {
    show(current + 1);
    start();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      start();
    });
  });

  const carousel = $("#projects-carousel");
  carousel?.addEventListener("mouseenter", () => clearInterval(timer));
  carousel?.addEventListener("mouseleave", start);

  show(0);
  start();
}


function initImageLightbox(){
  const lightbox = $("#image-lightbox");
  const image = $("#image-lightbox-img");
  const caption = $("#image-lightbox-caption");
  const close = $("#image-lightbox-close");
  const backdrop = $("#image-lightbox-backdrop");
  const prev = $("#image-lightbox-prev");
  const next = $("#image-lightbox-next");
  const zoomIn = $("#zoom-in");
  const zoomOut = $("#zoom-out");
  const zoomReset = $("#zoom-reset");
  const zoomLevel = $("#zoom-level");
  const stage = $("#image-zoom-stage");
  const slides = $$(".carousel-slide");

  if (!lightbox || !slides.length) return;

  let current = 0;
  let scale = 1;

  const updateZoom = () => {
    image.style.transform = `scale(${scale})`;
    zoomLevel.textContent = `${Math.round(scale * 100)}%`;
  };

  const resetZoom = () => {
    scale = 1;
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
    updateZoom();
  };

  const loadSlide = index => {
    current = (index + slides.length) % slides.length;
    const source = $("img", slides[current]);
    const text = $("figcaption", slides[current]);

    image.src = source.currentSrc || source.src;
    image.alt = source.alt || "";
    caption.textContent = text?.textContent || "";
    resetZoom();
  };

  const open = index => {
    loadSlide(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    close.focus();
  };

  const closeBox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    resetZoom();
  };

  slides.forEach((slide, index) => {
    slide.addEventListener("click", event => {
      if (event.target.closest(".carousel-arrow, .carousel-dots")) return;
      open(index);
    });

    slide.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(index);
      }
    });
  });

  close?.addEventListener("click", closeBox);
  backdrop?.addEventListener("click", closeBox);
  prev?.addEventListener("click", () => loadSlide(current - 1));
  next?.addEventListener("click", () => loadSlide(current + 1));

  zoomIn?.addEventListener("click", () => {
    scale = Math.min(3, +(scale + .25).toFixed(2));
    updateZoom();
  });

  zoomOut?.addEventListener("click", () => {
    scale = Math.max(1, +(scale - .25).toFixed(2));
    updateZoom();
  });

  zoomReset?.addEventListener("click", resetZoom);

  image.addEventListener("dblclick", () => {
    scale = scale === 1 ? 2 : 1;
    updateZoom();
  });

  stage?.addEventListener("wheel", event => {
    if (!lightbox.classList.contains("open")) return;
    event.preventDefault();
    scale = Math.max(1, Math.min(3, scale + (event.deltaY < 0 ? .15 : -.15)));
    updateZoom();
  }, {passive:false});

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeBox();
    if (event.key === "ArrowLeft") loadSlide(current - 1);
    if (event.key === "ArrowRight") loadSlide(current + 1);
    if (event.key === "+") {
      scale = Math.min(3, scale + .25);
      updateZoom();
    }
    if (event.key === "-") {
      scale = Math.max(1, scale - .25);
      updateZoom();
    }
  });
}


function initProductCarousels(){
  $$("[data-product-carousel]").forEach(carousel => {
    const slides = $$(".product-slide", carousel);
    const dots = $$(".product-dots button", carousel);
    const prev = $(".product-arrow.prev", carousel);
    const next = $(".product-arrow.next", carousel);
    if (slides.length < 2) return;

    let current = 0;

    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    };

    prev?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      show(current - 1);
    });

    next?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      show(current + 1);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        show(i);
      });
    });

    show(0);
  });
}
