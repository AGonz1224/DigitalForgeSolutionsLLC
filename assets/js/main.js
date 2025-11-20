// Author: Alberto Gonzalez
// File Name: main.js
// Date Created: October 28, 2025
// Date Last Edited: November 20, 2025

// ===============================
// Global motion preference
// ===============================
const prefersReducedMotion =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===============================
   Footer year
================================ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===============================
   Mobile menu toggle
================================ */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn?.addEventListener("click", () =>
  mobileMenu.classList.toggle("hidden")
);

/* ===============================
   Smooth scroll with header offset
================================ */
const headerHeight = 64; // ~4rem
document
  .querySelectorAll('.nav a[href^="#"], .mobile-menu a[href^="#"]')
  .forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight +
        1;
      window.scrollTo({ top, behavior: "smooth" });
      mobileMenu?.classList.add("hidden");
    });
  });

/* ===============================
   Reveal-on-scroll animations
================================ */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ===============================
   Active nav link highlighting
================================ */
const sections = document.querySelectorAll("section[id]");
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const highlight = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const link = navLinks.find(
          (a) => a.getAttribute("href") === `#${id}`
        );
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    {
      rootMargin: "-50% 0px -45% 0px",
    }
  );
  sections.forEach((s) => highlight.observe(s));
}

/* ===============================
   Mailto form handler
================================ */
const form = document.getElementById("mailtoForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const to = "inquiries@digitalforgesolutions.net";
  const subject = encodeURIComponent(`New inquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nProject details:\n${message}`
  );
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});

/* ===============================
   Page Transitions (fade out → fade in)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("pageRoot");
  if (!root) return;

  // Fade-in when page loads
  root.classList.add("page-enter");
  void root.offsetWidth; // force reflow
  root.classList.add("page-enter-active");

  // All internal links
  const links = document.querySelectorAll("a[href]");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    // Skip external links, section links, and new-tab links
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("http") ||
      link.target === "_blank"
    ) {
      return;
    }

    link.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();

      // Trigger fade-out animation
      root.classList.remove("page-enter", "page-enter-active");
      root.classList.add("page-leave");
      void root.offsetWidth;
      root.classList.add("page-leave-active");

      setTimeout(() => {
        window.location.href = href;
      }, 220); // match CSS .page-leave-active duration
    });
  });
});

/* ===============================
   Parallax metal texture scroll
================================ */
if (!prefersReducedMotion) {
  window.addEventListener(
    "scroll",
    () => {
      const offset = window.scrollY || window.pageYOffset || 0;
      // move the metal texture slower than scroll for subtle parallax
      document.body.style.setProperty("--metal-offset", String(offset));
    },
    { passive: true }
  );
}

/* ===============================
   Respect reduced motion
================================ */
if (prefersReducedMotion) {
  document.documentElement.style.scrollBehavior = "auto";
}

/* ===============================
   Forge particles: embers + smoke
   (uses same prefersReducedMotion flag)
================================ */
if (!prefersReducedMotion) {
  const particleLayer = document.getElementById("forgeParticles");

  if (particleLayer) {
    // --- tiny pixel embers ---
    const emberCount = 16; // between 5–20, tweak to taste

    for (let i = 0; i < emberCount; i++) {
      const ember = document.createElement("div");
      ember.className = "ember-particle";

      // random horizontal position (slightly inset so they don't hug edges)
      const left = 8 + Math.random() * 84; // 8–92 vw
      // start near bottom third of screen
      const bottom = -5 + Math.random() * 25; // -5–20 vh

      // random drift & rise
      const driftX = (Math.random() * 40 - 20) + "px"; // -20–20 px
      const riseMid = -(30 + Math.random() * 20) + "vh";
      const riseEnd = -(60 + Math.random() * 30) + "vh";

      // random timing
      const duration = 8 + Math.random() * 10; // 8–18s
      const delay = Math.random() * 15; // 0–15s

      ember.style.left = left + "vw";
      ember.style.bottom = bottom + "vh";
      ember.style.animationDuration = duration + "s";
      ember.style.animationDelay = delay + "s";

      ember.style.setProperty("--drift-x", driftX);
      ember.style.setProperty("--rise-mid", riseMid);
      ember.style.setProperty("--rise-y", riseEnd);

      particleLayer.appendChild(ember);
    }

    // --- subtle smoke plumes ---
    const smokeCount = 6;

    for (let i = 0; i < smokeCount; i++) {
      const smoke = document.createElement("div");
      smoke.className = "smoke-particle";

      // cluster smoke roughly near bottom center-ish
      const left = 25 + Math.random() * 50; // 25–75 vw
      const bottom = -10 + Math.random() * 15; // -10–5 vh

      const driftX = (Math.random() * 60 - 30) + "px"; // -30–30 px
      const riseMid = -(20 + Math.random() * 10) + "vh";
      const riseEnd = -(35 + Math.random() * 15) + "vh";

      const duration = 20 + Math.random() * 14; // 20–34s
      const delay = Math.random() * 25; // 0–25s

      smoke.style.left = left + "vw";
      smoke.style.bottom = bottom + "vh";
      smoke.style.animationDuration = duration + "s";
      smoke.style.animationDelay = delay + "s";

      smoke.style.setProperty("--smoke-drift-x", driftX);
      smoke.style.setProperty("--smoke-rise-mid", riseMid);
      smoke.style.setProperty("--smoke-rise-y", riseEnd);

      particleLayer.appendChild(smoke);
    }
  }
}
