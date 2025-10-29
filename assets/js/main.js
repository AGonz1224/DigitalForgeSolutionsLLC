// Author: Alberto Gonzalez
// File Name: main.js
// Date Created: October 28, 2025
// Date Last Edited: October 29, 2025

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// Smooth scroll with header offset
const headerHeight = 64; // ~4rem
document.querySelectorAll('.nav a[href^="#"], .mobile-menu a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
    window.scrollTo({ top, behavior: 'smooth' });
    mobileMenu?.classList.add('hidden');
  });
});

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const highlight = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: "-50% 0px -45% 0px" });
sections.forEach(s => highlight.observe(s));

// Mailto form handler
const form = document.getElementById('mailtoForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const to = 'inquiries@digitalforgesolutions.com'; // set your actual inbox
  const subject = encodeURIComponent(`New inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject details:\n${message}`);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});

// Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}
