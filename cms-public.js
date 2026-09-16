(() => {
  "use strict";

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const cleanText = (value, max = 1000) => {
    if (typeof value !== "string") return "";
    return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
  };

  const setText = (el, value, max = 1000) => {
    const safe = cleanText(value, max);
    if (el && safe) el.textContent = safe;
  };

  const safeImageUrl = (value) => {
    if (typeof value !== "string" || !value.trim() || value.length > 512) return null;
    try {
      const url = new URL(value.trim(), document.baseURI);
      if (url.origin !== window.location.origin) return null;
      if (!/\.(?:jpe?g|png|webp|gif|avif)$/i.test(url.pathname)) return null;
      return url.href;
    } catch (_) {
      return null;
    }
  };

  const setImage = (img, rawUrl, alt) => {
    if (!img) return;
    const url = safeImageUrl(rawUrl);
    if (!url) return;
    img.src = url;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.removeAttribute("fetchpriority");
    const safeAlt = cleanText(alt, 180);
    if (safeAlt) img.alt = safeAlt;
  };

  function applyHero(content) {
    const hero = content.hero || {};
    setText(qs(".hero-copy > p"), hero.description, 320);

    const slides = qsa("#carousel .carousel-slide");
    (Array.isArray(content.heroSlides) ? content.heroSlides : []).slice(0, slides.length).forEach((item, i) => {
      if (!item || typeof item !== "object") return;
      const slide = slides[i];
      setImage(qs("img", slide), item.image, item.alt || item.label);
      setText(qs("figcaption", slide), item.label, 100);
    });
  }

  function applyAbout(content) {
    const mission = content.mission || {};
    const vision = content.vision || {};
    setText(qs(".about-card.mission h3"), mission.title, 140);
    setText(qs(".about-card.mission p"), mission.text, 900);
    setText(qs(".about-card.vision h3"), vision.title, 140);
    setText(qs(".about-card.vision p"), vision.text, 900);
  }

  function applyProjects(content) {
    const slides = qsa("#projects-carousel .project-slide");
    (Array.isArray(content.projects) ? content.projects : []).slice(0, slides.length).forEach((item, i) => {
      if (!item || typeof item !== "object") return;
      const slide = slides[i];
      setImage(qs("img", slide), item.image, item.alt || item.title);
      const cap = qs("figcaption", slide);
      if (!cap) return;
      setText(qs("span", cap), item.category, 80);
      setText(qs("strong", cap), item.title, 120);
      setText(qs("p", cap), item.description, 420);
    });
  }

  function applyBrands(content) {
    const pills = qsa("#marcas .brand-pill");
    (Array.isArray(content.brands) ? content.brands : []).slice(0, pills.length).forEach((item, i) => {
      if (!item || typeof item !== "object") return;
      const pill = pills[i];
      const name = cleanText(item.name, 60);
      setText(qs("strong", pill), name, 60);
      setText(qs("small", pill), item.category, 100);
      if (name) pill.setAttribute("aria-label", name);
    });
  }

  async function loadContent() {
    try {
      const contentUrl = new URL("content/site.json", document.baseURI);
      contentUrl.searchParams.set("cms", Date.now().toString());
      const res = await fetch(contentUrl, {
        cache: "no-store",
        credentials: "same-origin",
        redirect: "error"
      });
      if (!res.ok) throw new Error(`CMS ${res.status}`);
      const content = await res.json();
      if (!content || typeof content !== "object" || Array.isArray(content)) return;
      applyHero(content);
      applyAbout(content);
      applyProjects(content);
      applyBrands(content);
      document.documentElement.dataset.cms = "ready";
    } catch (err) {
      console.warn("IINTEGRA CMS: usando contenido estático de respaldo.", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadContent, { once: true });
  } else {
    loadContent();
  }
})();
