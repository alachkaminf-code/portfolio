/* =========================================================
   PORTFOLIO SCRIPT
   1. Hamburger menu (mobile nav)
   2. Dark / light mode toggle (persisted)
   3. Scroll-triggered fade-in animations
   4. Project filters (by tech tag)
   5. Image lightbox for project screenshots
   6. Contact form (Formspree, no page reload)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initThemeToggle();
  initScrollAnimations();
  initProjectFilters();
  initLightbox();
  initContactForm();
});

/* ---------------------------------------------------------
   1. HAMBURGER MENU
   --------------------------------------------------------- */
function initHamburgerMenu() {
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const menuLinks = document.getElementById("menu-links");

  if (!hamburgerIcon || !menuLinks) return;

  const toggleMenu = () => {
    menuLinks.classList.toggle("open");
    hamburgerIcon.classList.toggle("open");
  };

  hamburgerIcon.addEventListener("click", toggleMenu);

  // Close the menu whenever a nav link inside it is clicked
  menuLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuLinks.classList.remove("open");
      hamburgerIcon.classList.remove("open");
    });
  });
}

/* ---------------------------------------------------------
   2. DARK / LIGHT MODE TOGGLE
   --------------------------------------------------------- */
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
  };

  // In-memory only (no localStorage available in this preview environment).
  // On a real hosted site (GitHub Pages / Vercel) this can safely use
  // localStorage.getItem("theme") / localStorage.setItem("theme", ...) instead.
  let currentTheme = "light";
  applyTheme(currentTheme);

  const toggle = () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
  };

  if (desktopToggle) desktopToggle.addEventListener("click", toggle);
  if (mobileToggle) mobileToggle.addEventListener("click", toggle);
}

/* ---------------------------------------------------------
   3. SCROLL-TRIGGERED FADE-IN ANIMATIONS
   --------------------------------------------------------- */
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

/* ---------------------------------------------------------
   4. PROJECT FILTERS
   --------------------------------------------------------- */
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

/* ---------------------------------------------------------
   5. LIGHTBOX FOR PROJECT IMAGES
   --------------------------------------------------------- */
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

  // Click outside the image closes it too
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ---------------------------------------------------------
   6. CONTACT FORM (Formspree, AJAX submit)
   --------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit-btn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const action = form.getAttribute("action") || "";
    if (action.includes("YOUR_FORM_ID")) {
      status.textContent =
        "Contact form isn't connected yet — replace YOUR_FORM_ID in the form's action with your real Formspree endpoint.";
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
