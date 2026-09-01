"use strict";

const WHATSAPP = "523319773148";

const catalog = [
  {
    id: "distribucion",
    name: "TABLERO DE DISTRIBUCIÓN",
    description: "Distribuye la alimentación principal hacia circuitos y cargas con protección eléctrica.",
    keywords: ["tablero", "distribucion", "baja tension", "proteccion", "energia"]
  },
  {
    id: "ccm",
    name: "CENTRO DE CONTROL DE MOTORES / CCM",
    description: "Centraliza protección, maniobra y control de motores para procesos industriales.",
    keywords: ["ccm", "motores", "control", "industrial", "arranque", "variadores"]
  },
  {
    id: "medidores",
    name: "MEDIDORES DIGITALES",
    description: "Monitorean consumo, tensión, corriente y variables eléctricas para control y diagnóstico.",
    keywords: ["medidores", "digitales", "medicion", "energia", "kwh", "monitoreo"]
  },
  {
    id: "alumbrado",
    name: "TABLERO DE ALUMBRADO",
    description: "Protege y distribuye circuitos de iluminación con operación y mantenimiento sencillos.",
    keywords: ["alumbrado", "iluminacion", "circuitos", "tablero"]
  },
  {
    id: "transferencias",
    name: "TRANSFERENCIAS AUTOMÁTICAS",
    description: "Cambian automáticamente entre la red normal y una fuente de respaldo para mantener el suministro.",
    keywords: ["transferencia", "transferencias", "ats", "generador", "respaldo", "continuidad"]
  },
  {
    id: "automatizacion",
    name: "CONTROL Y AUTOMATIZACIÓN",
    description: "Integra PLC, relevadores y señales para automatizar equipos y procesos.",
    keywords: ["automatizacion", "plc", "control", "relevadores", "industrial"]
  },
  {
    id: "pruebas",
    name: "PRUEBAS Y DIAGNÓSTICO",
    description: "Comprueba continuidad, aislamiento y funcionamiento antes de energizar o entregar el tablero.",
    keywords: ["pruebas", "diagnostico", "aislamiento", "continuidad", "soporte"]
  }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];


const WIZARD_STORAGE_KEY = "iintegra_quote_draft_v1";

function getFocusableElements(container){
  if (!container) return [];
  return $$('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',container)
    .filter(el => {
      const style=getComputedStyle(el);
      return style.display!=="none" && style.visibility!=="hidden" && !el.closest("[inert]");
    });
}

function trapFocusInDialog(container,event){
  if (event.key!=="Tab") return;
  const focusable=getFocusableElements(container);
  if (!focusable.length){event.preventDefault();container.focus?.();return}
  const first=focusable[0], last=focusable[focusable.length-1];
  if (event.shiftKey && document.activeElement===first){event.preventDefault();last.focus()}
  else if (!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus()}
}

const dialogReturnFocus=new WeakMap();
function setDialogAccessibility(modal,isOpen,initialFocus=null){
  if (!modal) return;
  modal.setAttribute("aria-hidden",isOpen?"false":"true");
  if (isOpen){
    if (!dialogReturnFocus.has(modal)) dialogReturnFocus.set(modal,document.activeElement);
    modal.removeAttribute("inert"); modal.inert=false;
    requestAnimationFrame(()=>{(initialFocus||getFocusableElements(modal)[0])?.focus?.()});
  }else{
    modal.setAttribute("inert",""); modal.inert=true;
    const prev=dialogReturnFocus.get(modal); dialogReturnFocus.delete(modal);
    if (prev?.isConnected) setTimeout(()=>{try{prev.focus({preventScroll:true})}catch(_){}},0);
  }
}

function readWizardDraft(){
  try{
    const raw=localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!raw) return null;
    const data=JSON.parse(raw);
    if (!data || typeof data!=="object") return null;
    if (data.savedAt && Date.now()-data.savedAt>7*24*60*60*1000){
      localStorage.removeItem(WIZARD_STORAGE_KEY); return null;
    }
    return data;
  }catch(_){return null}
}
function clearWizardDraft(){try{localStorage.removeItem(WIZARD_STORAGE_KEY)}catch(_){}}


document.addEventListener("DOMContentLoaded", () => {
  initIntro();
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
  initDeepLinks();
  initBackToTop();
  initInteractiveFeedback();
  initCardPreview();
});


function initIntro(){
  const intro = $("#site-intro");
  if (!intro){
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-complete");
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finish = () => {
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-complete");
    window.dispatchEvent(new CustomEvent("iintegra:intro-complete"));
    setTimeout(() => intro.remove(), reduced ? 0 : 920);
  };

  if (reduced){
    finish();
    return;
  }

  // V116: dos tiempos — promesa de marca y después IINTEGRA ELECTRIC.
  setTimeout(finish, 4550);
}

function focusProduct(id, {updateHash=true, openPreview=true} = {}){
  const card = document.querySelector(`[data-id="${id}"]`);
  if (!card) return;

  const doFocus = () => {
    card.scrollIntoView({behavior:"smooth", block:"center"});
    card.classList.remove("product-focus");
    void card.offsetWidth;
    card.classList.add("product-focus");
    setTimeout(() => card.classList.remove("product-focus"), 1700);

    const carousel = $("[data-product-carousel]", card);
    if (carousel?.productCarouselShow) carousel.productCarouselShow(0);
    if (carousel?.productCarouselRestart) carousel.productCarouselRestart();

    setTimeout(() => {
      try { card.focus({preventScroll:true}); } catch (_) {}
    }, 520);

    if (openPreview){
      setTimeout(() => openCardPreview(card), 760);
    }
  };

  if (updateHash && history.replaceState){
    history.replaceState(null, "", `#${id}`);
  }

  if (document.body.classList.contains("intro-active")){
    window.addEventListener("iintegra:intro-complete", doFocus, {once:true});
  } else {
    doFocus();
  }
}

function initDeepLinks(){
  const id = location.hash.replace(/^#/, "");
  if (!id || !catalog.some(item => item.id === id)) return;
  focusProduct(id, {updateHash:false, openPreview:false});
}

function initYear(){
  const year = new Date().getFullYear();
  const footerYear = $("#footer-year");
  if (footerYear) footerYear.textContent = year;
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
        focusProduct(item.id);
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
  const modal=$("#catalog-modal"), grid=$("#catalog-grid"), open=$("#open-catalog"), close=$("#close-catalog");
  if (!modal||!grid||!open||!close) return;

  catalog.forEach(item=>{
    const button=document.createElement("button");
    button.type="button";button.className="catalog-item";
    button.innerHTML=`<strong>${item.name}</strong><p>${item.description}</p>`;
    button.addEventListener("click",()=>{closeModal();focusProduct(item.id)});
    grid.appendChild(button);
  });

  const openModal=()=>{
    modal.classList.add("open");document.body.classList.add("modal-open");
    setDialogAccessibility(modal,true,close);
  };
  const closeModal=()=>{
    modal.classList.remove("open");document.body.classList.remove("modal-open");
    setDialogAccessibility(modal,false);
  };

  open.addEventListener("click",openModal);
  close.addEventListener("click",closeModal);
  $$("[data-close-modal]").forEach(el=>el.addEventListener("click",closeModal));
  modal.addEventListener("keydown",event=>{
    trapFocusInDialog(modal,event);
    if (event.key==="Escape") closeModal();
  });
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
  const modal=$("#wizard-modal"), open=$("#open-wizard"), close=$("#close-wizard");
  const prev=$("#wizard-prev"), next=$("#wizard-next"), form=$("#wizard-form"), error=$("#wizard-error");
  const voltage=$("#wizard-voltage"), current=$("#wizard-current"), quantity=$("#wizard-quantity");
  const details=$("#wizard-details"), name=$("#wizard-name"), email=$("#wizard-email");
  const step2Help=$("#wizard-step2-help");
  if (!modal||!open||!close||!form) return;

  const voltageRequiredSolutions=new Set([
    "Tablero de distribución","Centro de Control de Motores CCM","Medidores digitales",
    "Transferencias automáticas","Tablero de alumbrado","Control y automatización"
  ]);

  const clearErrors=()=>{
    if (error) error.textContent="";
    [voltage,current,quantity,details,name,email].forEach(field=>{
      field?.classList.remove("wizard-invalid");field?.removeAttribute("aria-invalid");
    });
  };
  const fail=(message,field=null)=>{
    if (error) error.textContent=message;
    if (field){field.classList.add("wizard-invalid");field.setAttribute("aria-invalid","true");field.focus({preventScroll:true})}
    return false;
  };
  const applyDynamicRequirements=()=>{
    const req=voltageRequiredSolutions.has(wizardSolution);
    voltage.required=req;
    if (step2Help) step2Help.textContent=req
      ?"Para esta solución necesitamos conocer la tensión del proyecto. La corriente/capacidad puede quedar por definir si aún no la conoces."
      :"Agrega los datos técnicos que conozcas. Si todavía no los tienes, puedes continuar y describir la necesidad en el siguiente paso.";
  };
  const collectDraft=()=>({
    savedAt:Date.now(),solution:wizardSolution,step:wizardStep,
    voltage:voltage.value.trim(),current:current.value.trim(),quantity:quantity.value||"1",
    details:details.value.trim(),name:name.value.trim(),email:email.value.trim()
  });
  const saveDraft=()=>{try{localStorage.setItem(WIZARD_STORAGE_KEY,JSON.stringify(collectDraft()))}catch(_){}};
  const restoreDraft=preferredSolution=>{
    const draft=readWizardDraft();
    if (draft){
      voltage.value=draft.voltage||"";current.value=draft.current||"";quantity.value=draft.quantity||"1";
      details.value=draft.details||"";name.value=draft.name||"";email.value=draft.email||"";
    }
    wizardSolution=preferredSolution||draft?.solution||"";
    $$(".wizard-options button").forEach(btn=>btn.classList.toggle("selected",btn.dataset.value===wizardSolution));
    applyDynamicRequirements();
  };
  const validateStep=step=>{
    clearErrors();
    if (step===1 && !wizardSolution) return fail("Selecciona una solución o elige “NO ESTOY SEGURO”.");
    if (step===2){
      if (!quantity.value||Number(quantity.value)<1) return fail("Indica una cantidad válida de 1 o más.",quantity);
      if (voltage.required&&!voltage.value.trim()) return fail("Para esta solución necesitamos la tensión del proyecto (por ejemplo 220 V o 440 V).",voltage);
    }
    if (step===3 && details.value.trim().length<10) return fail("Describe brevemente el proyecto con al menos 10 caracteres para poder orientarte mejor.",details);
    if (step===4){
      if (!name.value.trim()) return fail("Agrega tu nombre o el nombre de la empresa.",name);
      if (email.value&&!email.checkValidity()) return fail("Revisa el formato del correo electrónico.",email);
    }
    return true;
  };

  window.openWizard=solution=>{
    restoreDraft(solution||"");
    modal.classList.add("open");document.body.classList.add("modal-open");
    setDialogAccessibility(modal,true,close);
    setWizardStep(1);saveDraft();
  };
  const closeWizard=()=>{
    saveDraft();modal.classList.remove("open");document.body.classList.remove("modal-open");
    setDialogAccessibility(modal,false);
  };

  open.addEventListener("click",()=>{
    const preselect=open.dataset.preselect||"";delete open.dataset.preselect;openWizard(preselect);
  });
  close.addEventListener("click",closeWizard);
  $$("[data-close-wizard]").forEach(el=>el.addEventListener("click",closeWizard));

  $$(".wizard-options button").forEach(btn=>btn.addEventListener("click",()=>{
    wizardSolution=btn.dataset.value;
    $$(".wizard-options button").forEach(b=>b.classList.toggle("selected",b===btn));
    applyDynamicRequirements();clearErrors();saveDraft();
  }));

  [voltage,current,quantity,details,name,email].forEach(field=>{
    field?.addEventListener("input",()=>{
      field.classList.remove("wizard-invalid");field.removeAttribute("aria-invalid");
      if (error) error.textContent="";saveDraft();
    });
    field?.addEventListener("change",saveDraft);
  });

  prev.addEventListener("click",()=>{clearErrors();setWizardStep(wizardStep-1);saveDraft()});
  next.addEventListener("click",()=>{if (!validateStep(wizardStep)) return;setWizardStep(wizardStep+1);saveDraft()});

  form.addEventListener("submit",e=>{
    e.preventDefault();
    for (const step of [1,2,3,4]){
      if (!validateStep(step)){setWizardStep(step);return}
    }
    const message=[
      "Hola, deseo solicitar una cotización con Iintegra Electric.","",
      `Nombre / Empresa: ${name.value.trim()}`,
      `Correo: ${email.value.trim()||"No indicado"}`,
      `Solución: ${wizardSolution}`,
      `Tensión: ${voltage.value.trim()||"Por definir"}`,
      `Corriente / capacidad: ${current.value.trim()||"Por definir"}`,
      `Cantidad: ${quantity.value||"1"}`,"","Detalles:",details.value.trim()
    ].join("\\n");
    clearWizardDraft();
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  });

  modal.addEventListener("keydown",event=>{
    trapFocusInDialog(modal,event);
    if (event.key==="Escape") closeWizard();
  });
  restoreDraft("");
}

function setWizardStep(step){
  wizardStep=Math.max(1,Math.min(4,step));
  $$(".wizard-step").forEach(s=>s.classList.toggle("active",Number(s.dataset.step)===wizardStep));
  $("#wizard-progress").style.width=`${wizardStep*25}%`;
  $("#wizard-prev").style.visibility=wizardStep===1?"hidden":"visible";
  $("#wizard-next").classList.toggle("hidden",wizardStep===4);
  $("#wizard-submit").classList.toggle("hidden",wizardStep!==4);
  const error=$("#wizard-error");if (error) error.textContent="";
  if (wizardStep===4){
    $("#wizard-summary").innerHTML=`
      <strong>${wizardSolution||"Solución por definir"}</strong><br>
      Tensión: ${$("#wizard-voltage").value||"Por definir"}<br>
      Corriente/capacidad: ${$("#wizard-current").value||"Por definir"}<br>
      Cantidad: ${$("#wizard-quantity").value||"1"}
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
    document.body.classList.add("lightbox-open");
    setDialogAccessibility(lightbox,true,close);
  };

  const closeBox = () => {
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    setDialogAccessibility(lightbox,false);
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

  lightbox.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    trapFocusInDialog(lightbox,event);
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
  const duration = 4800;

  $$("[data-product-carousel]").forEach(carousel => {
    const slides = $$(".product-slide", carousel);
    const dots = $$(".product-dots button", carousel);
    const prev = $(".product-arrow.prev", carousel);
    const next = $(".product-arrow.next", carousel);
    if (slides.length < 2) return;

    let current = 0;
    let timer = null;
    let startedAt = 0;
    let remaining = duration;
    let paused = false;

    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    };

    const schedule = (ms = duration) => {
      clearTimeout(timer);
      remaining = ms;
      startedAt = performance.now();
      timer = setTimeout(() => {
        show(current + 1);
        schedule(duration);
      }, ms);
    };

    const pause = () => {
      if (paused) return;
      paused = true;
      carousel.classList.add("is-paused");
      clearTimeout(timer);
      remaining = Math.max(60, remaining - (performance.now() - startedAt));
    };

    const resume = () => {
      if (!paused) return;
      paused = false;
      carousel.classList.remove("is-paused");
      schedule(remaining);
    };

    const jump = index => {
      show(index);
      paused = false;
      carousel.classList.remove("is-paused");
      schedule(duration);
    };

    prev?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      jump(current - 1);
    });

    next?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      jump(current + 1);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        jump(i);
      });
    });

    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);
    carousel.addEventListener("focusin", pause);
    carousel.addEventListener("focusout", event => {
      if (!carousel.contains(event.relatedTarget)) resume();
    });

    // Métodos expuestos solo al helper de navegación del catálogo/buscador.
    carousel.productCarouselShow = show;
    carousel.productCarouselRestart = () => jump(0);

    show(0);
    schedule(duration);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    // Al volver a la pestaña, cada carrusel continúa con su temporizador propio.
  });
}


function initBackToTop(){
  const button = $("#back-to-top");
  if (!button) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    button.classList.toggle("visible", window.scrollY > 620);
  };

  window.addEventListener("scroll", update, {passive:true});
  update();

  button.addEventListener("click", () => {
    window.scrollTo({
      top:0,
      behavior:reduced ? "auto" : "smooth"
    });
  });
}

function initInteractiveFeedback(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const selector = [
    ".btn",
    ".nav-catalog",
    ".nav-quote",
    ".text-action",
    ".catalog-item",
    ".wizard-options button",
    ".carousel-arrow",
    ".product-arrow",
    ".projects-controls > button",
    ".back-to-top"
  ].join(",");

  $$(selector).forEach(element => {
    element.classList.add("ripple-host");

    element.addEventListener("pointerdown", event => {
      if (element.disabled) return;

      const rect = element.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ui-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;

      element.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), {once:true});
    });
  });
}


let cardPreviewApi = null;

function initCardPreview(){
  const modal = $("#card-preview-modal");
  const content = $("#card-preview-content");
  const closeButton = $("#card-preview-close");
  if (!modal || !content || !closeButton) return;

  let lastTrigger = null;

  const close = () => {
    modal.classList.remove("open");
    document.body.classList.remove("card-preview-open");
    setDialogAccessibility(modal,false);
    content.innerHTML = "";
    if (lastTrigger?.focus){
      try { lastTrigger.focus({preventScroll:true}); } catch (_) {}
    }
  };

  const open = card => {
    if (!card) return;
    lastTrigger = card;

    const clone = card.cloneNode(true);
    clone.classList.remove("scroll-reveal","animate-in","product-focus");
    clone.classList.add("card-preview-clone");
    clone.removeAttribute("id");
    clone.removeAttribute("tabindex");

    clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
    clone.querySelectorAll(".product-arrow,.product-dots").forEach(el => el.remove());

    // En el preview se muestra la fotografía que estaba activa.
    clone.querySelectorAll(".product-slide").forEach(img => {
      if (!img.classList.contains("active")) img.remove();
    });

    const quoteButton = clone.querySelector(".quote-solution");
    if (quoteButton){
      quoteButton.addEventListener("click", event => {
        event.preventDefault();
        const solution = quoteButton.dataset.solution || "";
        close();
        const target = $("#cotizacion");
        target?.scrollIntoView({behavior:"smooth",block:"start"});
        setTimeout(() => {
          const wizard = $("#open-wizard");
          if (wizard){
            wizard.dataset.preselect = solution;
            wizard.focus({preventScroll:true});
          }
        }, 520);
      });
    }

    content.innerHTML = "";
    content.appendChild(clone);

    modal.classList.add("open");
    document.body.classList.add("card-preview-open");
    setDialogAccessibility(modal,true,closeButton);
  };

  cardPreviewApi = {open, close};

  closeButton.addEventListener("click", close);
  $$("[data-close-card-preview]").forEach(el => el.addEventListener("click", close));

  modal.addEventListener("keydown", event => {
    trapFocusInDialog(modal,event);
    if (event.key === "Escape" && modal.classList.contains("open")) close();
  });

  // Clic en tarjetas: ampliar. Botones/enlaces mantienen su función normal.
  $$(".service-card, .solution-card").forEach(card => {
    card.setAttribute("role","button");
    card.setAttribute("aria-label", `${card.querySelector("h3")?.textContent || "Tarjeta"} — ampliar`);
    if (!card.hasAttribute("tabindex")) card.tabIndex = 0;

    const openFromCard = event => {
      if (event?.target?.closest("button,a,input,textarea,select,.product-arrow,.product-dots")) return;
      open(card);
    };

    card.addEventListener("click", openFromCard);
    card.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && !event.target.closest("button,a,input,textarea,select")){
        event.preventDefault();
        open(card);
      }
    });
  });
}

function openCardPreview(card){
  if (cardPreviewApi?.open) cardPreviewApi.open(card);
}
