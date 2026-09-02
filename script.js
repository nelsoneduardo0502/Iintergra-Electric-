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
    id: "materiales",
    name: "VENTA DE MATERIAL ELÉCTRICO",
    description: "Suministro por pieza o por proyecto de componentes y material eléctrico de baja tensión.",
    keywords: ["material", "componentes", "venta", "pieza", "interruptores", "breakers", "cables", "conductores", "abb", "siemens", "condumex"]
  },
  {
    id: "pruebas",
    name: "PRUEBAS Y DIAGNÓSTICO",
    description: "Comprueba continuidad, aislamiento y funcionamiento antes de energizar o entregar el tablero.",
    keywords: ["pruebas", "diagnostico", "aislamiento", "continuidad", "soporte"]
  }
];


const QUOTE_PROFILES = {
  "Tablero de distribución": {
    step2Title: "2. DATOS DEL TABLERO DE DISTRIBUCIÓN",
    help: "Estos datos nos permiten dimensionar el tablero sin pedir información que no aplica a tu proyecto.",
    detailsTitle: "3. APLICACIÓN Y REQUERIMIENTOS",
    detailsPlaceholder: "Ej. área que alimentará, tipo de cargas, espacio disponible, interior/exterior, fecha requerida...",
    detailsRequired: true,
    fields: [
      {key:"voltage", label:"Tensión del sistema", placeholder:"EJ. 220 / 440 V", required:true},
      {key:"mainCurrent", label:"Corriente o capacidad principal", placeholder:"EJ. 225 A / 400 A"},
      {key:"circuits", label:"Número aproximado de circuitos", placeholder:"EJ. 24 CIRCUITOS", type:"number", min:1},
      {key:"quantity", label:"Cantidad de tableros", placeholder:"CANTIDAD", type:"number", min:1, value:"1", required:true}
    ]
  },
  "Centro de Control de Motores CCM": {
    step2Title: "2. DATOS DEL CCM",
    help: "Para un CCM necesitamos conocer principalmente los motores y la forma en que se controlarán.",
    detailsTitle: "3. PROCESO Y CONTROL",
    detailsPlaceholder: "Describe el proceso, arranques requeridos, interbloqueos, señales, PLC existente o condiciones especiales...",
    detailsRequired: true,
    fields: [
      {key:"voltage", label:"Tensión del sistema", placeholder:"EJ. 220 / 440 V", required:true},
      {key:"motors", label:"Número de motores", placeholder:"EJ. 8 MOTORES", type:"number", min:1, required:true},
      {key:"motorPower", label:"Potencia de motores", placeholder:"EJ. 5–30 HP / kW"},
      {key:"starter", label:"Tipo de arranque o control", type:"select", options:["Por definir","Contactor","Variador de frecuencia","Arrancador suave","Combinado"]}
    ]
  },
  "Medidores digitales": {
    step2Title: "2. DATOS DE MEDICIÓN",
    help: "Aquí importa cuántos puntos se medirán y qué variables o comunicación necesita el proyecto.",
    detailsTitle: "3. VARIABLES Y MONITOREO",
    detailsPlaceholder: "Indica qué deseas visualizar o registrar: energía, corriente, tensión, demanda, comunicación con PLC/BMS, etc.",
    detailsRequired: true,
    fields: [
      {key:"points", label:"Puntos de medición", placeholder:"EJ. 4 PUNTOS", type:"number", min:1, required:true},
      {key:"voltage", label:"Tensión a medir", placeholder:"EJ. 220 / 440 V"},
      {key:"communication", label:"Comunicación requerida", type:"select", options:["No requerida / por definir","Modbus RTU","Modbus TCP","Ethernet / integración","Otra"]},
      {key:"quantity", label:"Cantidad de equipos", placeholder:"CANTIDAD", type:"number", min:1, value:"1", required:true}
    ]
  },
  "Transferencias automáticas": {
    step2Title: "2. DATOS DE LA TRANSFERENCIA",
    help: "Para seleccionar una transferencia necesitamos conocer la capacidad y las fuentes entre las que se realizará el cambio.",
    detailsTitle: "3. FUENTES Y OPERACIÓN",
    detailsPlaceholder: "Ej. red normal + generador, tiempos de transferencia, señal de arranque, operación manual/automática, espacio...",
    detailsRequired: true,
    fields: [
      {key:"voltage", label:"Tensión del sistema", placeholder:"EJ. 220 / 440 V", required:true},
      {key:"capacity", label:"Corriente / capacidad", placeholder:"EJ. 400 A", required:true},
      {key:"backupSource", label:"Fuente de respaldo", type:"select", options:["Generador","Segunda acometida","UPS / sistema de respaldo","Por definir"]},
      {key:"quantity", label:"Cantidad de transferencias", placeholder:"CANTIDAD", type:"number", min:1, value:"1", required:true}
    ]
  },
  "Tablero de alumbrado": {
    step2Title: "2. DATOS DEL TABLERO DE ALUMBRADO",
    help: "Para alumbrado necesitamos principalmente la tensión, el número de circuitos y la capacidad general.",
    detailsTitle: "3. DISTRIBUCIÓN DE CIRCUITOS",
    detailsPlaceholder: "Indica si es interior/exterior, tipos de cargas de iluminación, espacios de reserva o alguna condición especial...",
    detailsRequired: true,
    fields: [
      {key:"voltage", label:"Tensión del sistema", placeholder:"EJ. 127/220 V", required:true},
      {key:"circuits", label:"Número de circuitos", placeholder:"EJ. 30 CIRCUITOS", type:"number", min:1, required:true},
      {key:"mainCurrent", label:"Capacidad principal", placeholder:"EJ. 100 A"},
      {key:"quantity", label:"Cantidad de tableros", placeholder:"CANTIDAD", type:"number", min:1, value:"1", required:true}
    ]
  },
  "Control y automatización": {
    step2Title: "2. DATOS DE AUTOMATIZACIÓN",
    help: "En automatización la corriente no es el dato principal; necesitamos entender el proceso, las señales y la integración.",
    detailsTitle: "3. LÓGICA Y FUNCIONAMIENTO",
    detailsPlaceholder: "Describe qué debe hacer el sistema, secuencias, alarmas, HMI, equipos existentes, protocolos o condiciones especiales...",
    detailsRequired: true,
    fields: [
      {key:"process", label:"Equipo o proceso a controlar", placeholder:"EJ. BOMBAS, BANDA, PROCESO DE DOSIFICACIÓN", required:true},
      {key:"signals", label:"Señales / E/S aproximadas", placeholder:"EJ. 24 DI + 16 DO + 4 AI"},
      {key:"communication", label:"Comunicación / protocolo", placeholder:"EJ. PROFINET, MODBUS, ETHERNET/IP"},
      {key:"existingControl", label:"Control existente", type:"select", options:["Proyecto nuevo","PLC existente","HMI existente","PLC + HMI existente","Por definir"]}
    ]
  },
  "Pruebas y diagnóstico eléctrico": {
    step2Title: "2. DATOS DEL SERVICIO",
    help: "Para diagnóstico no te pedimos corriente o capacidad si no es necesaria; primero necesitamos saber qué equipo se revisará y qué problema presenta.",
    detailsTitle: "3. SÍNTOMA O PRUEBA REQUERIDA",
    detailsPlaceholder: "Describe la falla, comportamiento, prueba requerida, antecedentes o cualquier dato que ayude al diagnóstico...",
    detailsRequired: true,
    fields: [
      {key:"serviceType", label:"Tipo de servicio", type:"select", options:["Diagnóstico de falla","Prueba de aislamiento","Prueba de continuidad","Prueba funcional","Puesta en marcha","Revisión general","Otro"], required:true},
      {key:"equipment", label:"Equipo / tablero a revisar", placeholder:"EJ. TABLERO DE DISTRIBUCIÓN, CCM, CONTROL", required:true},
      {key:"location", label:"Ubicación del servicio", placeholder:"CIUDAD / PLANTA / SITIO"},
      {key:"urgency", label:"Prioridad", type:"select", options:["Programable","Lo antes posible","Paro de operación / urgente"]}
    ]
  },
  "Venta de material eléctrico": {
    step2Title: "2. MATERIAL QUE NECESITAS",
    help: "Para venta por pieza lo más útil es el material, marca, modelo o número de parte y la cantidad.",
    detailsTitle: "3. ESPECIFICACIONES ADICIONALES",
    detailsPlaceholder: "Agrega calibre, capacidad, características, equivalencias aceptables o cualquier dato adicional. Si tienes foto o ficha, podrás enviarla por WhatsApp.",
    detailsRequired: false,
    fields: [
      {key:"material", label:"Material / componente", placeholder:"EJ. INTERRUPTOR, CONTACTOR, CABLE, MEDIDOR", required:true},
      {key:"brand", label:"Marca preferida", type:"select", options:["Sin preferencia","ABB","Siemens","Condumex","Otra"]},
      {key:"partNumber", label:"Modelo / número de parte", placeholder:"SI LO CONOCES"},
      {key:"quantity", label:"Cantidad", placeholder:"CANTIDAD", type:"number", min:1, value:"1", required:true}
    ]
  },
  "Necesito asesoría": {
    step2Title: "2. CUÉNTANOS QUÉ NECESITAS RESOLVER",
    help: "No necesitas conocer datos eléctricos todavía. Describe el objetivo y nosotros te ayudamos a identificar la solución adecuada.",
    detailsTitle: "3. CONTEXTO DEL PROYECTO",
    detailsPlaceholder: "Cuéntanos qué quieres lograr, qué equipo tienes actualmente, qué problema existe o qué información te gustaría recibir...",
    detailsRequired: true,
    fields: [
      {key:"objective", label:"Objetivo principal", placeholder:"EJ. NUEVO TABLERO, FALLA, AMPLIACIÓN, AUTOMATIZAR", required:true},
      {key:"installation", label:"Tipo de instalación", type:"select", options:["Industrial","Comercial","Servicios / edificio","Por definir"]},
      {key:"location", label:"Ubicación aproximada", placeholder:"CIUDAD / ZONA"},
      {key:"timeline", label:"Cuándo lo necesitas", type:"select", options:["Solo información","Este mes","Próximas semanas","Urgente","Por definir"]}
    ]
  }
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];


const WIZARD_STORAGE_KEY = "iintegra_quote_session_v3";

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
    const raw=sessionStorage.getItem(WIZARD_STORAGE_KEY);
    if (!raw) return null;
    const data=JSON.parse(raw);
    if (!data || typeof data!=="object") return null;
    if (data.savedAt && Date.now()-data.savedAt>7*24*60*60*1000){
      sessionStorage.removeItem(WIZARD_STORAGE_KEY); return null;
    }
    return data;
  }catch(_){return null}
}
function clearWizardDraft(){try{sessionStorage.removeItem(WIZARD_STORAGE_KEY)}catch(_){}}


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
  initCardPreview();
  initMobileScrollFix();
  initSmartMobileHeader();
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
    setTimeout(() => card.classList.remove("product-focus"), 2200);

    const carousel = $("[data-product-carousel]", card);
    if (carousel?.productCarouselShow) carousel.productCarouselShow(0);
    if (carousel?.productCarouselRestart) carousel.productCarouselRestart();

    setTimeout(() => {
      try { card.focus({preventScroll:true}); } catch (_) {}
    }, 520);

    if (openPreview){
      setTimeout(() => openCardPreview(card), 1050);
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
    box.replaceChildren();

    if (!items.length){
      const result = document.createElement("div");
      result.className = "search-result";

      const title = document.createElement("strong");
      title.textContent = "SIN COINCIDENCIAS";

      const hint = document.createElement("small");
      hint.textContent = "Prueba con “CCM”, “material”, “medidores”, “transferencias”, “alumbrado” o “distribución”.";

      result.append(title, hint);
      box.appendChild(result);
      box.classList.add("open");
      return;
    }

    items.slice(0,6).forEach(item => {
      const button = document.createElement("button");
      button.className = "search-result";
      button.type = "button";

      const title = document.createElement("strong");
      title.textContent = item.name;

      const description = document.createElement("small");
      description.textContent = item.description;

      button.append(title, description);
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
    button.type="button";
    button.className="catalog-item";

    const title=document.createElement("strong");
    title.textContent=item.name;

    const description=document.createElement("p");
    description.textContent=item.description;

    button.append(title,description);
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

  let progressAnimation = null;

  const setProgress = (ms, fromFraction = 0) => {
    const from = Math.max(0, Math.min(1, fromFraction));

    progressAnimation?.cancel();
    progress.style.width = `${from * 100}%`;

    progressAnimation = progress.animate(
      [
        {width:`${from * 100}%`},
        {width:"100%"}
      ],
      {
        duration:Math.max(0,ms),
        easing:"linear",
        fill:"forwards"
      }
    );
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
    progressAnimation?.cancel();
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
  const form = $("#wizard-form");
  const error = $("#wizard-error");
  const dynamicFields = $("#wizard-dynamic-fields");
  const step2Title = $("#wizard-step2-title");
  const step2Help = $("#wizard-step2-help");
  const step3Title = $("#wizard-step3-title");
  const details = $("#wizard-details");
  const detailsHelp = $("#wizard-details-help");
  const name = $("#wizard-name");
  const email = $("#wizard-email");
  const privacyConsent = $("#wizard-privacy-consent");

  if (!modal || !open || !close || !form || !dynamicFields) return;

  let wizardValues = {};

  const profileFor = solution => QUOTE_PROFILES[solution] || QUOTE_PROFILES["Necesito asesoría"];

  const fieldId = key => `wizard-dynamic-${key}`;


  const renderDynamicFields = (solution, values = {}) => {
    const profile = profileFor(solution);
    wizardValues = {...values};
    dynamicFields.replaceChildren();

    step2Title.textContent = profile.step2Title;
    step2Help.textContent = profile.help;
    step3Title.textContent = profile.detailsTitle;
    details.placeholder = profile.detailsPlaceholder;
    details.required = !!profile.detailsRequired;
    details.minLength = profile.detailsRequired ? 10 : 0;
    detailsHelp.textContent = profile.detailsRequired
      ? "Incluye la información que conozcas. Si tienes plano, ficha o fotografía, podrás adjuntarla al abrir WhatsApp."
      : "Este campo es opcional. Si tienes foto, ficha o lista de material, podrás adjuntarla al abrir WhatsApp.";

    profile.fields.forEach(field => {
      const wrapper = document.createElement("label");
      wrapper.className = "wizard-field";
      wrapper.htmlFor = fieldId(field.key);

      const label = document.createElement("span");
      label.className = "wizard-field-label";
      label.append(document.createTextNode(field.label));
      if (field.required){
        label.append(document.createTextNode(" "));
        const requiredMark = document.createElement("b");
        requiredMark.textContent = "*";
        label.appendChild(requiredMark);
      }
      wrapper.appendChild(label);

      let control;
      if (field.type === "select"){
        control = document.createElement("select");
        (field.options || []).forEach(option => {
          const opt = document.createElement("option");
          opt.value = option;
          opt.textContent = option;
          control.appendChild(opt);
        });
      } else {
        control = document.createElement("input");
        control.type = field.type || "text";
        if (control.type === "text") control.maxLength = field.maxLength || 160;
        if (field.placeholder) control.placeholder = field.placeholder;
        if (field.min != null) control.min = field.min;
        if (field.max != null) control.max = field.max;
        if (control.type === "number") control.inputMode = "numeric";
        else control.autocomplete = "off";
      }

      control.id = fieldId(field.key);
      control.dataset.quoteKey = field.key;
      control.dataset.quoteLabel = field.label;
      if (field.required) control.required = true;

      const saved = values[field.key];
      if (saved !== undefined && saved !== null && saved !== ""){
        control.value = saved;
      } else if (field.value !== undefined){
        control.value = field.value;
      }

      control.addEventListener("input", () => {
        control.classList.remove("wizard-invalid");
        control.removeAttribute("aria-invalid");
        clearNativeValidity(control);
        if (error) error.textContent = "";
        wizardValues[field.key] = control.value;
        saveDraft();
      });
      control.addEventListener("change", () => {
        clearNativeValidity(control);
        wizardValues[field.key] = control.value;
        saveDraft();
      });

      wrapper.appendChild(control);
      dynamicFields.appendChild(wrapper);
    });
  };

  const collectDynamicValues = () => {
    const values = {};
    $$("[data-quote-key]", dynamicFields).forEach(control => {
      values[control.dataset.quoteKey] = control.value.trim ? control.value.trim() : control.value;
    });
    wizardValues = values;
    return values;
  };

  const clearErrors = () => {
    if (error) error.textContent = "";
    $$("[data-quote-key]", dynamicFields).forEach(field => {
      field.classList.remove("wizard-invalid");
      field.removeAttribute("aria-invalid");
      clearNativeValidity(field);
    });
    [details,name,email,privacyConsent].forEach(field => {
      field?.classList.remove("wizard-invalid");
      field?.removeAttribute("aria-invalid");
      clearNativeValidity(field);
    });
  };

  const fail = (message, field = null) => {
    if (error) error.textContent = message;
    if (field){
      field.classList.add("wizard-invalid");
      field.setAttribute("aria-invalid","true");

      // Mostrar también el aviso nativo del navegador cuando aplique.
      // Así el usuario recibe el mensaje típico de "completa este campo".
      if (typeof field.setCustomValidity === "function"){
        field.setCustomValidity(message);
      }

      field.focus({preventScroll:true});

      if (typeof field.reportValidity === "function"){
        requestAnimationFrame(() => field.reportValidity());
      }
    }
    return false;
  };

  const clearNativeValidity = field => {
    if (field && typeof field.setCustomValidity === "function"){
      field.setCustomValidity("");
    }
  };

  const collectDraft = () => ({
    savedAt: Date.now(),
    solution: wizardSolution,
    step: wizardStep,
    values: collectDynamicValues(),
    details: details.value.trim(),
    name: name.value.trim(),
    email: email.value.trim()
  });

  const saveDraft = () => {
    try{
      sessionStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(collectDraft()));
    }catch(_){}
  };

  const restoreDraft = preferredSolution => {
    const draft = readWizardDraft();
    wizardSolution = preferredSolution || draft?.solution || "";

    const restoredValues = (!preferredSolution || preferredSolution === draft?.solution)
      ? (draft?.values || {})
      : {};

    renderDynamicFields(wizardSolution || "Necesito asesoría", restoredValues);

    if (draft){
      if (!preferredSolution || preferredSolution === draft.solution){
        details.value = draft.details || "";
      } else {
        details.value = "";
      }
      name.value = draft.name || "";
      email.value = draft.email || "";
    }

    $$(".wizard-options button").forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.value === wizardSolution);
    });
  };

  const validateStep = step => {
    clearErrors();

    if (step === 1){
      if (!wizardSolution){
        return fail("Selecciona una solución o elige “NO ESTOY SEGURO”.");
      }
      return true;
    }

    if (step === 2){
      for (const field of $$("[data-quote-key]", dynamicFields)){
        const value = field.value.trim ? field.value.trim() : field.value;
        if (field.required && !value){
          return fail(`Completa: ${field.dataset.quoteLabel}.`, field);
        }
        if (field.type === "number" && value && Number(value) < Number(field.min || 0)){
          return fail(`Revisa el valor de: ${field.dataset.quoteLabel}.`, field);
        }
      }
      collectDynamicValues();
      return true;
    }

    if (step === 3){
      if (details.required && details.value.trim().length < 10){
        return fail("Agrega una breve descripción para que podamos entender mejor tu solicitud.", details);
      }
      return true;
    }

    if (step === 4){
      if (!name.value.trim()){
        return fail("Agrega tu nombre o el nombre de la empresa.", name);
      }
      if (email.value && !email.checkValidity()){
        return fail("Revisa el formato del correo electrónico.", email);
      }
      if (!privacyConsent?.checked){
        return fail("Para enviar la solicitud, confirma que has leído el Aviso de Privacidad y autorizas el tratamiento de tus datos.", privacyConsent);
      }
      return true;
    }

    return true;
  };

  window.openWizard = solution => {
    restoreDraft(solution || "");
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    setDialogAccessibility(modal,true,close);
    if (privacyConsent) privacyConsent.checked = false;
    setWizardStep(1);
    saveDraft();
  };

  const closeWizard = () => {
    saveDraft();
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    setDialogAccessibility(modal,false);
  };

  open.addEventListener("click", () => {
    const preselect = open.dataset.preselect || "";
    delete open.dataset.preselect;
    openWizard(preselect);
  });
  close.addEventListener("click", closeWizard);
  $$("[data-close-wizard]").forEach(el => el.addEventListener("click", closeWizard));

  $$(".wizard-options button").forEach(btn => {
    btn.addEventListener("click", () => {
      wizardSolution = btn.dataset.value;
      $$(".wizard-options button").forEach(b => b.classList.toggle("selected", b === btn));
      details.value = "";
      renderDynamicFields(wizardSolution, {});
      clearErrors();
      saveDraft();
    });
  });

  [details,name,email].forEach(field => {
    field?.addEventListener("input", () => {
      field.classList.remove("wizard-invalid");
      field.removeAttribute("aria-invalid");
      clearNativeValidity(field);
      if (error) error.textContent = "";
      saveDraft();
    });
    field?.addEventListener("change", () => {
      clearNativeValidity(field);
      saveDraft();
    });
  });

  privacyConsent?.addEventListener("change", () => {
    privacyConsent.classList.remove("wizard-invalid");
    privacyConsent.removeAttribute("aria-invalid");
    clearNativeValidity(privacyConsent);
    if (error) error.textContent = "";
  });

  prev.addEventListener("click", () => {
    clearErrors();
    setWizardStep(wizardStep - 1);
    saveDraft();
  });

  next.addEventListener("click", () => {
    if (!validateStep(wizardStep)) return;
    setWizardStep(wizardStep + 1);
    saveDraft();
  });

  form.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;

    const target = event.target;

    // En textarea, Enter conserva su función normal: salto de línea.
    if (target instanceof HTMLTextAreaElement) return;

    // En botones, enlaces y selects dejamos el comportamiento nativo.
    if (
      target instanceof HTMLButtonElement ||
      target instanceof HTMLAnchorElement ||
      target instanceof HTMLSelectElement
    ) return;

    event.preventDefault();

    // Enter funciona como "Siguiente" mientras no estemos en el último paso.
    if (wizardStep < 4){
      if (validateStep(wizardStep)){
        setWizardStep(wizardStep + 1);
        saveDraft();
      }
      return;
    }

    // En el último paso, Enter intenta enviar.
    // Las mismas validaciones (incluido el checkbox) siguen aplicando.
    if (validateStep(4)){
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    for (const step of [1,2,3,4]){
      if (!validateStep(step)){
        setWizardStep(step);
        return;
      }
    }

    const profile = profileFor(wizardSolution);
    const values = collectDynamicValues();

    const technicalLines = profile.fields
      .map(field => {
        const value = values[field.key];
        if (!value) return null;
        return `• ${field.label}: ${value}`;
      })
      .filter(Boolean);

    const message = [
      "Hola, muy buenas tardes. 👋",
      "Me gustaría solicitar una cotización con IINTEGRA ELECTRIC.",
      "",
      "*SOLICITUD*",
      `• Solución: ${wizardSolution}`,
      ...technicalLines,
      "",
      ...(details.value.trim() ? ["*INFORMACIÓN ADICIONAL*", details.value.trim(), ""] : []),
      "*DATOS DE CONTACTO*",
      `• Nombre / empresa: ${name.value.trim()}`,
      `• Correo: ${email.value.trim() || "No indicado"}`,
      "",
      "Quedo atento(a) a su asesoría. Muchas gracias."
    ].join("\n");

    clearWizardDraft();
    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });

  modal.addEventListener("keydown", event => {
    trapFocusInDialog(modal,event);
    if (event.key === "Escape") closeWizard();
  });

  restoreDraft("");
}

function setWizardStep(step){
  wizardStep = Math.max(1, Math.min(4, step));
  $$(".wizard-step").forEach(section => {
    section.classList.toggle("active", Number(section.dataset.step) === wizardStep);
  });

  $("#wizard-progress").style.width = `${wizardStep * 25}%`;
  $("#wizard-prev").style.visibility = wizardStep === 1 ? "hidden" : "visible";
  $("#wizard-next").classList.toggle("hidden", wizardStep === 4);
  $("#wizard-submit").classList.toggle("hidden", wizardStep !== 4);

  const error = $("#wizard-error");
  if (error) error.textContent = "";

  // Elimina mensajes nativos antiguos al cambiar de paso.
  $$("#wizard-form input, #wizard-form select, #wizard-form textarea").forEach(field => {
    if (typeof field.setCustomValidity === "function") field.setCustomValidity("");
  });

  if (wizardStep === 4){
    const profile = QUOTE_PROFILES[wizardSolution] || QUOTE_PROFILES["Necesito asesoría"];
    const values = {};
    $$("[data-quote-key]", $("#wizard-dynamic-fields")).forEach(control => {
      values[control.dataset.quoteKey] = control.value;
    });

    const summary = $("#wizard-summary");
    summary.replaceChildren();

    const heading = document.createElement("strong");
    heading.textContent = wizardSolution || "Solución por definir";
    summary.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "wizard-summary-grid";

    let added = 0;
    profile.fields.forEach(field => {
      const value = values[field.key];
      if (!value) return;

      const row = document.createElement("span");
      const label = document.createElement("b");
      label.textContent = `${field.label}: `;
      row.append(label, document.createTextNode(value));
      grid.appendChild(row);
      added += 1;
    });

    if (!added){
      const row = document.createElement("span");
      row.textContent = "Datos técnicos por definir.";
      grid.appendChild(row);
    }

    summary.appendChild(grid);
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
  const shell = $(".card-preview-shell", modal);
  const backdrop = $(".card-preview-backdrop", modal);
  const closeButton = $("#card-preview-close");

  if (!modal || !content || !shell || !backdrop || !closeButton) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastTrigger = null;
  let sourceRect = null;
  let closing = false;

  const geometryTransform = (fromRect, toRect) => {
    if (!fromRect || !toRect || !toRect.width || !toRect.height) return "translate3d(0,18px,0) scale(.97)";
    const fromX = fromRect.left + fromRect.width / 2;
    const fromY = fromRect.top + fromRect.height / 2;
    const toX = toRect.left + toRect.width / 2;
    const toY = toRect.top + toRect.height / 2;
    const dx = fromX - toX;
    const dy = fromY - toY;
    const sx = Math.max(.28, Math.min(1, fromRect.width / toRect.width));
    const sy = Math.max(.28, Math.min(1, fromRect.height / toRect.height));
    return `translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`;
  };

  const finalizeClose = () => {
    modal.classList.remove("open","is-morphing");
    document.body.classList.remove("card-preview-open");
    setDialogAccessibility(modal,false);
    content.replaceChildren();
    shell.getAnimations().forEach(a => a.cancel());
    backdrop.getAnimations().forEach(a => a.cancel());
    closing = false;

    if (lastTrigger?.focus){
      try { lastTrigger.focus({preventScroll:true}); } catch (_) {}
    }
  };

  const close = () => {
    if (!modal.classList.contains("open") || closing) return;
    closing = true;

    if (reduced){
      finalizeClose();
      return;
    }

    const currentRect = shell.getBoundingClientRect();
    const destinationRect = lastTrigger?.isConnected ? lastTrigger.getBoundingClientRect() : sourceRect;
    const endTransform = geometryTransform(destinationRect, currentRect);

    shell.animate(
      [
        {transform:"translate3d(0,0,0) scale(1)", opacity:1, filter:"blur(0px)"},
        {transform:endTransform, opacity:.35, filter:"blur(1.5px)"}
      ],
      {duration:560, easing:"cubic-bezier(.55,.05,.67,.19)", fill:"forwards"}
    ).finished.finally(finalizeClose);

    backdrop.animate(
      [{opacity:1, backdropFilter:"blur(14px)"}, {opacity:0, backdropFilter:"blur(0px)"}],
      {duration:500, easing:"ease", fill:"forwards"}
    );
  };

  const open = card => {
    if (!card || modal.classList.contains("open")) return;

    lastTrigger = card;
    sourceRect = card.getBoundingClientRect();

    const clone = card.cloneNode(true);
    clone.classList.remove("scroll-reveal","animate-in","product-focus");
    clone.classList.add("card-preview-clone");
    clone.removeAttribute("id");
    clone.removeAttribute("tabindex");
    clone.removeAttribute("role");

    clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
    clone.querySelectorAll(".product-arrow,.product-dots").forEach(el => el.remove());

    clone.querySelectorAll(".product-slide").forEach(img => {
      if (!img.classList.contains("active")) img.remove();
    });

    const quoteButton = clone.querySelector(".quote-solution");
    if (quoteButton){
      quoteButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const solution = quoteButton.dataset.solution || "";
        close();
        setTimeout(() => openWizard(solution), reduced ? 0 : 600);
      });
    }

    content.replaceChildren();
    content.appendChild(clone);

    modal.classList.add("open","is-morphing");
    document.body.classList.add("card-preview-open");
    modal.removeAttribute("inert");
    modal.inert = false;
    modal.setAttribute("aria-hidden","false");

    requestAnimationFrame(() => {
      const targetRect = shell.getBoundingClientRect();

      if (!reduced){
        const startTransform = geometryTransform(sourceRect, targetRect);

        shell.animate(
          [
            {transform:startTransform, opacity:.42, filter:"blur(2px)"},
            {transform:"translate3d(0,0,0) scale(1.012)", opacity:1, filter:"blur(0px)", offset:.82},
            {transform:"translate3d(0,0,0) scale(1)", opacity:1, filter:"blur(0px)"}
          ],
          {
            duration:760,
            easing:"cubic-bezier(.16,1,.3,1)",
            fill:"both"
          }
        );

        backdrop.animate(
          [
            {opacity:0, backdropFilter:"blur(0px)"},
            {opacity:1, backdropFilter:"blur(14px)"}
          ],
          {duration:520, easing:"cubic-bezier(.22,.61,.36,1)", fill:"both"}
        );
      }

      setTimeout(() => {
        modal.classList.remove("is-morphing");
        setDialogAccessibility(modal,true,closeButton);
      }, reduced ? 0 : 620);
    });
  };

  cardPreviewApi = {open, close};

  closeButton.addEventListener("click", close);
  $$("[data-close-card-preview]").forEach(el => el.addEventListener("click", close));

  modal.addEventListener("keydown", event => {
    trapFocusInDialog(modal,event);
    if (event.key === "Escape" && modal.classList.contains("open")) close();
  });

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


function initMobileScrollFix(){
  const isTouchDevice =
    matchMedia("(hover:none) and (pointer:coarse)").matches ||
    navigator.maxTouchPoints > 0;

  if (!isTouchDevice) return;

  const root = document.documentElement;
  const body = document.body;

  const hasOpenOverlay = () =>
    !!document.querySelector(
      ".modal.open, .image-lightbox.open, .card-preview-modal.open, #nav-links.open"
    );

  /*
    Safari puede conservar temporalmente el bloqueo de overflow usado
    por la intro. Si ya no hay ninguna ventana abierta, lo liberamos.
  */
  const releaseStaleScrollLock = () => {
    if (hasOpenOverlay()) return;

    body.classList.remove(
      "menu-open",
      "mobile-menu-active",
      "modal-open",
      "lightbox-open",
      "card-preview-open"
    );
    root.classList.remove("mobile-menu-active");

    body.style.removeProperty("overflow");
    body.style.removeProperty("height");
    body.style.removeProperty("position");
    root.style.removeProperty("overflow");
    root.style.removeProperty("height");

    // Forzar a Safari a recalcular el área desplazable después de la intro.
    void body.offsetHeight;
  };

  window.addEventListener("iintegra:intro-complete", () => {
    releaseStaleScrollLock();
    requestAnimationFrame(() => {
      releaseStaleScrollLock();
      setTimeout(releaseStaleScrollLock, 120);
    });
  });

  window.addEventListener("pageshow", releaseStaleScrollLock);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) releaseStaleScrollLock();
  });

  /*
    Un gesto de scroll que empieza encima de una tarjeta/carrusel no
    debe terminar abriendo accidentalmente la vista ampliada.
  */
  const guarded = [
    ...document.querySelectorAll(
      ".carousel-slide, .service-card, .solution-card, .project-slide"
    )
  ];

  guarded.forEach(element => {
    let startX = 0;
    let startY = 0;
    let suppressUntil = 0;

    element.addEventListener("touchstart", event => {
      const touch = event.touches?.[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
    }, {passive:true});

    element.addEventListener("touchmove", event => {
      const touch = event.touches?.[0];
      if (!touch) return;

      const dx = Math.abs(touch.clientX - startX);
      const dy = Math.abs(touch.clientY - startY);

      if (dx > 8 || dy > 8){
        suppressUntil = Date.now() + 450;
      }
    }, {passive:true});

    element.addEventListener("click", event => {
      if (Date.now() < suppressUntil){
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  });

  // Evitar el arrastre nativo de imágenes en navegadores que lo soportan.
  document.addEventListener("dragstart", event => {
    if (event.target instanceof HTMLImageElement){
      event.preventDefault();
    }
  });

  // Por si la página ya terminó la intro antes de registrar el listener.
  if (!body.classList.contains("intro-active")){
    releaseStaleScrollLock();
  }
}


function initSmartMobileHeader(){
  const header=document.querySelector('.navbar');
  if(!header) return;
  const mobileQuery=window.matchMedia('(max-width: 900px)');
  let lastY=Math.max(0,window.scrollY);
  let accumulatedDown=0, accumulatedUp=0, ticking=false;
  const HIDE_AFTER=24, SHOW_AFTER=8, ALWAYS_SHOW_UNTIL=80;

  const overlayOpen=()=>
    document.body.classList.contains('menu-open') ||
    document.body.classList.contains('mobile-menu-active') ||
    document.body.classList.contains('modal-open') ||
    document.body.classList.contains('lightbox-open') ||
    document.body.classList.contains('card-preview-open') ||
    !!document.querySelector('.modal.open, .image-lightbox.open, .card-preview-modal.open, #nav-links.open');

  const showHeader=()=>{
    header.classList.remove('header-auto-hidden');
    header.classList.add('header-auto-visible');
  };
  const hideHeader=()=>{
    if(overlayOpen()) return;
    header.classList.remove('header-auto-visible');
    header.classList.add('header-auto-hidden');
  };
  const reset=()=>{
    accumulatedDown=0; accumulatedUp=0; lastY=Math.max(0,window.scrollY); showHeader();
  };
  const update=()=>{
    ticking=false;
    if(!mobileQuery.matches){ reset(); return; }
    const currentY=Math.max(0,window.scrollY);
    const delta=currentY-lastY;
    if(currentY<=ALWAYS_SHOW_UNTIL || overlayOpen()){
      showHeader(); accumulatedDown=0; accumulatedUp=0; lastY=currentY; return;
    }
    if(Math.abs(delta)<2){ lastY=currentY; return; }
    if(delta>0){
      accumulatedDown+=delta; accumulatedUp=0;
      if(accumulatedDown>=HIDE_AFTER){ hideHeader(); accumulatedDown=0; }
    }else{
      accumulatedUp+=Math.abs(delta); accumulatedDown=0;
      if(accumulatedUp>=SHOW_AFTER){ showHeader(); accumulatedUp=0; }
    }
    lastY=currentY;
  };
  window.addEventListener('scroll',()=>{
    if(!ticking){ ticking=true; requestAnimationFrame(update); }
  },{passive:true});
  mobileQuery.addEventListener?.('change',reset);
  window.addEventListener('pageshow',reset);
  window.addEventListener('orientationchange',()=>setTimeout(reset,120));
  showHeader();
}
