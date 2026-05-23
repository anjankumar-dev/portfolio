/* ===========================
   PORTFOLIO — script.js
   Anjan Kumar Gogu
   =========================== */

'use strict';

/* ─── Scroll Progress Bar ─────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? scrolled / total : 0;
    bar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
}

/* ─── Page Loader ─────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loader-fill');
  if (!loader || !fill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 280);
    }
    fill.style.width = progress + '%';
  }, 60);

  document.body.style.overflow = 'hidden';
}

/* ─── Custom Cursor ───────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }, { passive: true });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const interactives = document.querySelectorAll(
    'a, button, .btn, .skill-group, .project-card, .cert-item, .stat-card, .contact-link'
  );
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      ring.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      ring.classList.remove('cursor--hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* ─── Navbar ──────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--accent)';
      }
    });
  }, { passive: true });
}

/* ─── Hamburger Menu ──────────────────────────────────────── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const overlay = document.getElementById('mobile-overlay');
  if (!btn || !overlay) return;

  let open = false;

  function toggle() {
    open = !open;
    btn.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (open) toggle();
    });
  });
}

/* ─── Scroll Reveal (IntersectionObserver) ────────────────── */
function initScrollReveal() {
  // Generic reveal
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-label'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.revealDelay || 0;
        setTimeout(() => el.classList.add('visible'), parseInt(delay));
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Stat cards with stagger
  const statCards = document.querySelectorAll('.stat-card');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.statDelay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  statCards.forEach(el => statObserver.observe(el));

  // Cert items with stagger
  const certItems = document.querySelectorAll('.cert-item');
  const certObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.certDelay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        certObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  certItems.forEach(el => certObserver.observe(el));
}

/* ─── Count-up Animation ──────────────────────────────────── */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1200;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.round(eased * target) + '+';
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ─── Skill Tag Stagger ───────────────────────────────────── */
function initSkillStagger() {
  const groups = document.querySelectorAll('.skill-group');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'translateY(10px)';
          setTimeout(() => {
            tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, i * 60 + 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  groups.forEach(el => observer.observe(el));
}

/* ─── Parallax Hero Elements ─────────────────────────────── */
function initParallax() {
  const glow = document.querySelector('.hero-glow');
  const codeFloats = document.querySelectorAll('.code-float');

  if (!glow) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      glow.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
      codeFloats.forEach((el, i) => {
        const speed = 0.05 + i * 0.03;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }, { passive: true });

  // Hero content subtle parallax
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${window.scrollY * 0.08}px)`;
        heroContent.style.opacity = 1 - (window.scrollY / (window.innerHeight * 0.7));
      }
    }, { passive: true });
  }
}

/* ─── Smooth Scroll for Nav Links ─────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Marquee Pause on Hover ──────────────────────────────── */
function initMarquee() {
  const inner = document.getElementById('marquee-inner');
  if (!inner) return;

  const wrap = inner.closest('.marquee-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => {
      inner.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      inner.style.animationPlayState = 'running';
    });
  }
}

/* ─── Project Card — Tilt Effect ──────────────────────────── */
function initTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(800px)
        rotateY(${x * 6}deg)
        rotateX(${-y * 6}deg)
        translateY(-6px)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease-out)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, border-color 0.3s';
    });
  });
}

/* ─── Text Scramble Effect (section labels) ───────────────── */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789—·';
    this.original = el.textContent;
  }

  scramble() {
    const original = this.original;
    let iteration = 0;
    const maxIter = original.length * 2;

    clearInterval(this._interval);
    this._interval = setInterval(() => {
      this.el.textContent = original
        .split('')
        .map((char, i) => {
          if (i < iteration / 2) return char;
          if (char === ' ') return ' ';
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');

      if (iteration >= maxIter) {
        this.el.textContent = original;
        clearInterval(this._interval);
      }
      iteration++;
    }, 28);
  }
}

function initTextScramble() {
  const labels = document.querySelectorAll('.section-label');
  labels.forEach(label => {
    const scrambler = new TextScramble(label);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => scrambler.scramble(), 300);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(label);
  });
}

/* ─── Contact Links Stagger ───────────────────────────────── */
function initContactStagger() {
  const links = document.querySelectorAll('.contact-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach((link, i) => {
          link.style.opacity = '0';
          link.style.transform = 'translateY(20px)';
          setTimeout(() => {
            link.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, color 0.25s, transform 0.25s var(--ease-out)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
          }, i * 80 + 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (links.length) observer.observe(links[0].closest('.contact-links') || links[0]);
}

/* ─── Footer reveal ───────────────────────────────────────── */
function initFooterReveal() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  footer.style.opacity = '0';
  footer.style.transform = 'translateY(20px)';
  footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footer.style.opacity = '1';
        footer.style.transform = 'translateY(0)';
        observer.unobserve(footer);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(footer);
}

/* ─── Init All ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollProgress();
  initCursor();
  initNavbar();
  initHamburger();
  initSmoothScroll();
  initMarquee();
  initParallax();

  // Slight delay to let DOM settle
  setTimeout(() => {
    initScrollReveal();
    initCountUp();
    initSkillStagger();
    initTilt();
    initTextScramble();
    initContactStagger();
    initFooterReveal();
  }, 100);
});
