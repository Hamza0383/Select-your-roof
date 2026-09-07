/* THEME 9 — "Warm Community" front-end behaviours. Sections are inlined at
   generation time, so there is no client-side component loading.

   This file only powers the presentational behaviours (nav, accordions,
   process stepper, scroll-reveal, newsletter sign-up). The site currently
   has no lead-capture form, so that wiring was removed. */

function initNavbar() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-links");
  const closeBtn = menu && menu.querySelector(".nav-close");
  if (!toggle || !menu) return;
  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (!open) menu.querySelectorAll(".nav-dd.open").forEach((d) => d.classList.remove("open"));
  };
  const closeMenu = () => setMenu(false);

  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  // Services / Areas: on mobile, tapping the top-level item EXPANDS its submenu
  // (accordion) instead of navigating away — so submenus start collapsed.
  menu.querySelectorAll(".nav-dd > a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!isMobile()) return;
      event.preventDefault();
      const dd = link.parentElement;
      const wasOpen = dd.classList.contains("open");
      menu.querySelectorAll(".nav-dd.open").forEach((d) => d !== dd && d.classList.remove("open"));
      dd.classList.toggle("open", !wasOpen);
    });
  });

  // Real navigation links close the whole menu; the submenu toggles above do not.
  menu.querySelectorAll("a").forEach((link) => {
    if (link.parentElement && link.parentElement.classList.contains("nav-dd")) return;
    link.addEventListener("click", () => { if (isMobile()) closeMenu(); });
  });
  document.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());
}

function initAccordions() {
  document.querySelectorAll(".accordion article").forEach((item) => {
    const button = item.querySelector("button");
    if (!button) return;
    button.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".accordion article").forEach((other) => {
        other.classList.remove("open");
        other.querySelector("button")?.setAttribute("aria-expanded", "false");
        const s = other.querySelector("button b");
        if (s) s.textContent = "+";
      });
      if (!wasOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        const s = button.querySelector("b");
        if (s) s.textContent = "−";
      }
    });
  });
}

/* Interactive process stepper — reads step content from the clicked article's
   data attributes so it stays niche-driven (no hardcoded copy). */
function initProcess() {
  const title = document.getElementById("process-title");
  const description = document.getElementById("process-description");
  const label = document.getElementById("process-step");
  const meter = document.querySelector(".process-meter span");
  const buttons = document.querySelectorAll("[data-process]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.getAttribute("data-process"));
      document.querySelectorAll(".process-list article").forEach((item) => item.classList.remove("active"));
      button.closest("article")?.classList.add("active");
      if (label) label.textContent = "STEP " + String(index + 1).padStart(2, "0");
      if (title) title.textContent = button.getAttribute("data-title") || "";
      if (description) description.textContent = button.getAttribute("data-desc") || "";
      if (meter) meter.style.width = ((index + 1) / buttons.length) * 100 + "%";
    });
  });
}

/* Scroll-reveal without any external library (replaces sal.js). Adds
   `.sal-animate` as each [data-sal] element scrolls into view; honours
   data-sal-delay and prefers-reduced-motion, and degrades to "show all"
   when IntersectionObserver is unavailable. */
function initReveal() {
  var els = document.querySelectorAll("[data-sal]");
  if (!els.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("sal-animate"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseInt(el.getAttribute("data-sal-delay") || "0", 10);
      if (delay) el.style.transitionDelay = delay + "ms";
      el.classList.add("sal-animate");
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  els.forEach(function (el) { io.observe(el); });
}

/* Newsletter is a presentational-only sign-up (not a lead form). */
function initNewsletter() {
  document.getElementById("newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button");
    if (button) {
      button.textContent = "You're on the list ✓";
      button.disabled = true;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initAccordions();
  initProcess();
  initNewsletter();
  initReveal();
});
