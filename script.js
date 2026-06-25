/* =========================================================
   PORTFOLIO SCRIPT
   1. Hamburger menu
   2. Dark / light mode toggle (persisted with localStorage)
   3. Scroll-triggered fade-in animations
   4. Project filters
   5. Image lightbox
   6. Contact form (Formspree)
   7. CV modal + Certificate modals
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initThemeToggle();
  initScrollAnimations();
  initProjectFilters();
  initLightbox();
  initContactForm();
  initModals();
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

  // global open function — call it from any onclick in HTML
  window.openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("open");
  };

  // global close function
  window.closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("open");
  };

  allModals.forEach((modal) => {
    // close on X button click
    const closeBtn = modal.querySelector(".cv-modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    }
    // close on backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  });

  // close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      allModals.forEach((modal) => modal.classList.remove("open"));
    }
  });
}