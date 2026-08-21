"use strict";

const WHATSAPP = "523319773148";

const catalog = [
  {
    id: "distribucion",
    name: "TABLERO DE DISTRIBUCIÓN",
    description: "Recibe y distribuye energía hacia circuitos o equipos con elementos de protección y organización eléctrica.",
    keywords: ["tablero", "distribucion", "baja tension", "proteccion", "energia"]
  },
  {
    id: "ccm",
    name: "CENTRO DE CONTROL DE MOTORES / CCM",
    description: "Centraliza el arranque, protección y control de motores para aplicaciones industriales.",
    keywords: ["ccm", "motores", "control", "industrial", "arranque"]
  },
  {
    id: "medidores",
    name: "CONCENTRACIÓN DE MEDIDORES",
    description: "Organiza múltiples puntos de medición para facilitar lectura, distribución y administración eléctrica.",
    keywords: ["medidores", "medicion", "concentracion", "modular"]
  },
  {
    id: "alumbrado",
    name: "TABLERO DE ALUMBRADO",
    description: "Distribuye y protege circuitos de iluminación para simplificar operación e identificación.",
    keywords: ["alumbrado", "iluminacion", "circuitos", "tablero"]
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
});

function initYear(){
  const year = new Date().getFullYear();
  $("#footer-year").textContent = year;
  $("#frame-year").textContent = year;
}

function initNavbar(){
  const nav = $("#navbar");
  const progress = $("#scroll-progress");
  const links = $$(".nav-links a[href^='#']");
  const sections = $$("main section[id]");

  const update = () => {
    nav.classList.toggle("scrolled", scrollY > 35);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
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
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
  $$(".nav-links a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));
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
      box.innerHTML = `<div class="search-result"><strong>SIN COINCIDENCIAS</strong><small>Prueba con “CCM”, “medidores”, “alumbrado” o “distribución”.</small></div>`;
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
  let current = 0;
  let timer;
  const duration = 4000;

  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide,i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot,i) => dot.classList.toggle("active", i === current));
    count.textContent = `${String(current+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;
    progress.style.animation = "none";
    progress.offsetHeight;
    progress.style.animation = `carouselProgress ${duration}ms linear`;
  };

  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => show(current+1), duration);
    show(current);
  };

  const restart = index => { show(index); start(); };
  prev.addEventListener("click", () => restart(current-1));
  next.addEventListener("click", () => restart(current+1));
  dots.forEach((dot,i) => dot.addEventListener("click", () => restart(i)));
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", start);

  const style = document.createElement("style");
  style.textContent = `@keyframes carouselProgress{from{width:0}to{width:100%}}`;
  document.head.appendChild(style);
  start();
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
