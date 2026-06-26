/* =========================================================
   PORTFOLIO SCRIPT
   1. Hamburger menu
   2. Dark / light mode toggle (persisted with localStorage)
   3. Scroll-triggered fade-in animations
   4. Project filters
   5. Image lightbox
   6. Contact form (Formspree)
   7. CV modal + Certificate modals
   8. Typing animation on hero title
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initThemeToggle();
  initScrollAnimations();
  initProjectFilters();
  initLightbox();
  initContactForm();
  initModals();
  initTypingEffect();
  initSkillBars();
  initCounters();
  initBackToTop();
});

/* 1. HAMBURGER MENU */
function initHamburgerMenu() {
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const menuLinks = document.getElementById("menu-links");
  if (!hamburgerIcon || !menuLinks) return;
  const toggleMenu = () => {
    menuLinks.classList.toggle("open");
    hamburgerIcon.classList.toggle("open");
  };
  hamburgerIcon.addEventListener("click", toggleMenu);
  menuLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuLinks.classList.remove("open");
      hamburgerIcon.classList.remove("open");
    });
  });
}

/* 2. DARK / LIGHT MODE TOGGLE — persisted with localStorage */
function initThemeToggle() {
  const desktopToggle = document.getElementById("theme-toggle");
  const mobileToggle = document.getElementById("theme-toggle-mobile");
  const root = document.documentElement;

  const applyTheme = (theme) => {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    document.querySelectorAll(".theme-icon").forEach((icon) => {
      icon.textContent = theme === "dark" ? "☀️" : "🌙";
    });
    try { localStorage.setItem("theme", theme); } catch (_) {}
  };

  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("theme") || "light"; } catch (_) {}
  applyTheme(savedTheme);

  const toggle = () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  };

  if (desktopToggle) desktopToggle.addEventListener("click", toggle);
  if (mobileToggle) mobileToggle.addEventListener("click", toggle);
}

/* 3. SCROLL FADE-IN */
function initScrollAnimations() {
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => section.classList.add("fade-in-section"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach((section) => observer.observe(section));
}

/* 4. PROJECT FILTERS */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  if (!filterButtons.length) return;
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      projectCards.forEach((card) => {
        const tags = card.dataset.tags || "";
        const matches = filter === "all" || tags.includes(filter);
        card.style.display = matches ? "" : "none";
      });
    });
  });
}

/* 5. LIGHTBOX */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  if (!lightbox || !lightboxImg) return;
  window.openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add("open");
  };
  const close = () => lightbox.classList.remove("open");
  if (closeBtn) closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* 6. CONTACT FORM */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit-btn");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const action = form.getAttribute("action") || "";
    if (action.includes("YOUR_FORM_ID")) {
      status.textContent = "Contact form isn't connected yet — replace YOUR_FORM_ID with your real Formspree endpoint.";
      status.className = "form-status error";
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.textContent = "";
    status.className = "form-status";
    try {
      const response = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        status.textContent = "Thanks! Your message has been sent.";
        status.className = "form-status success";
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again.";
        status.className = "form-status error";
      }
    } catch (err) {
      status.textContent = "Network error. Please try again later.";
      status.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

/* 7. ALL MODALS (CV + Certificates) */
function initModals() {
  const allModals = document.querySelectorAll(".cv-modal");

  window.openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("open");
  };

  window.closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("open");
  };

  allModals.forEach((modal) => {
    const closeBtn = modal.querySelector(".cv-modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    }
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      allModals.forEach((modal) => modal.classList.remove("open"));
    }
  });
}

/* 8. TYPING ANIMATION ON HERO TITLE */
function initTypingEffect() {
  const el = document.getElementById("typing-text");
  if (!el) return;

  const phrases = ["Full-Stack Developer", "React Developer", "Problem Solver"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const TYPE_SPEED = 90;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER_TYPE = 1800;
  const PAUSE_AFTER_DELETE = 400;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* 9. SKILL BAR ANIMATION ON SCROLL */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  if (!bars.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("filled");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((bar) => observer.observe(bar));
}
/* 10. COUNTER ANIMATION (About section) */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const isRange = el.dataset.format === "range";
    const end = isRange ? parseInt(el.dataset.end, 10) : null;
    const duration = 1500;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      if (isRange) {
        const current = Math.round(target + (end - target) * eased);
        el.textContent = `${current}`;
        if (progress >= 1) el.textContent = `${target}-${end}`;
      } else {
        const current = Math.round(target * eased);
        el.textContent = `${current}${suffix}`;
      }

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}
/* 11. BACK TO TOP BUTTON */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}