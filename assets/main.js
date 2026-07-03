/* ============================================================
   Dhanyaa Medical Centre — shared site script
   Loaded on every page. Every block below is guarded with an
   existence check so pages that don't include a given component
   (e.g. no Swiper reviews on the Blog page) never throw errors.
   ============================================================ */

/* ============================================================
   Preloader controller — a full-viewport overlay (with its own
   solid background) sits on top of the page while everything loads,
   so the page underneath can render normally with zero FOUC risk.
   We just fade the overlay out once load finishes + a minimum
   display time so the logo draw-in animation is never cut short.
   ============================================================ */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  const MIN_DISPLAY_MS = 2400; // lets the logo draw-in animation actually finish before hiding
  setTimeout(() => {
    preloader.classList.add("is-hidden");
    document.documentElement.classList.remove("is-preloading");
    setTimeout(() => preloader.remove(), 600);
  }, MIN_DISPLAY_MS);
});

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- AOS scroll reveal ---------- */
  if (window.AOS) AOS.init({ duration: 700, once: true, offset: 60 });

  /* ---------- Reviews / testimonials carousel ---------- */
  if (window.Swiper && document.querySelector(".reviews-swiper")) {
    new Swiper(".reviews-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true },
      pagination: { el: ".reviews-pagination", clickable: true },
      navigation: { nextEl: ".reviews-next", prevEl: ".reviews-prev" },
      breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
    });
  }

  /* ---------- Hero entrance timeline + cursor parallax (home page only) ---------- */
  if (window.gsap && document.querySelector(".hero h1")) {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".hero h1", { y: 24, opacity: 0, duration: 0.8 })
      .from(".hero .lead-copy", { y: 18, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(".hero-cta a, .hero-cta button", { y: 14, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
      .from(".heart-float-wrap", { scale: 0.85, opacity: 0, duration: 1 }, "-=0.6")
      .from(".float-card", { y: 20, opacity: 0, duration: 0.6, stagger: 0.15 }, "-=0.5");

    const heroVisual = document.querySelector(".hero-visual");
    const heartFrame = document.querySelector(".heart-video-frame");
    if (heroVisual && heartFrame && window.matchMedia("(min-width: 992px)").matches) {
      heroVisual.addEventListener("mousemove", (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(heartFrame, { x: x * 18, y: y * 14, duration: 0.6, ease: "power2.out" });
      });
      heroVisual.addEventListener("mouseleave", () => {
        gsap.to(heartFrame, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
      });
    }
  } else if (window.gsap && document.querySelector(".page-hero-content")) {
    /* Generic inner-page hero entrance for non-home pages */
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".page-hero-content > *", { y: 22, opacity: 0, duration: 0.7, stagger: 0.12 });
  }

  /* ---------- Scroll-to-top button ---------- */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    const toggleScrollBtn = () => {
      if (window.scrollY > 480) scrollTopBtn.classList.add("is-visible");
      else scrollTopBtn.classList.remove("is-visible");
    };
    window.addEventListener("scroll", toggleScrollBtn, { passive: true });
    toggleScrollBtn();
    scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById("galleryLightbox");
  if (lightbox) {
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxSub = document.getElementById("lightboxSub");
    document.querySelectorAll(".gallery-tile").forEach((tile) => {
      tile.addEventListener("click", () => {
        const img = tile.querySelector("img");
        lightboxImg.src = tile.dataset.full || (img ? img.src : "");
        lightboxImg.alt = img ? img.alt : tile.dataset.caption;
        lightboxCaption.textContent = tile.dataset.caption;
        if (lightboxSub) lightboxSub.textContent = tile.dataset.sub || "";
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    };
    document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  }

  /* ---------- Mini Appointment Booking Modal (site-wide) ---------- */
  const apptModal = document.getElementById("apptModal");
  if (apptModal) {
    const apptFormView = document.getElementById("apptFormView");
    const apptSuccessView = document.getElementById("apptSuccessView");
    const apptForm = document.getElementById("apptForm");
    const apptSuccessName = document.getElementById("apptSuccessName");

    const openApptModal = () => {
      apptFormView.classList.add("is-active");
      apptSuccessView.classList.remove("is-active");
      apptModal.classList.add("is-open");
      apptModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => document.getElementById("apptName")?.focus(), 300);
    };
    const closeApptModal = () => {
      apptModal.classList.remove("is-open");
      apptModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".js-open-appointment").forEach((btn) => {
      btn.addEventListener("click", openApptModal);
    });
    apptModal.querySelectorAll("[data-appt-close]").forEach((el) => {
      el.addEventListener("click", closeApptModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && apptModal.classList.contains("is-open")) closeApptModal();
    });

    // Front-end only for now — wire this to a real endpoint (Formspree/EmailJS/WhatsApp API/CRM)
    apptForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!apptForm.checkValidity()) { apptForm.reportValidity(); return; }
      const name = document.getElementById("apptName").value.trim();
      apptSuccessName.textContent = name ? `, ${name.split(" ")[0]}` : "";
      apptFormView.classList.remove("is-active");
      apptSuccessView.classList.add("is-active");
      apptForm.reset();
    });
  }

  /* ---------- Contact page form (if present) — front-end only, same disclosure as above ---------- */
  const contactForm = document.getElementById("pageContactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      const successEl = document.getElementById("pageContactSuccess");
      contactForm.style.display = "none";
      if (successEl) successEl.style.display = "block";
    });
  }

  /* ---------- Hero video graceful fallback + reduced-motion / data-saver respect ---------- */
  const heartVideo = document.getElementById("heartVideo");
  const bgVideo = document.querySelector(".hero-bg-video");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;

  [heartVideo, bgVideo].forEach((vid) => {
    if (!vid) return;
    vid.addEventListener("error", () => {
      vid.style.display = "none";
      const frame = vid.closest(".heart-video-frame") || vid.parentElement;
      if (frame) {
        frame.style.backgroundImage = `url('${vid.getAttribute("poster")}')`;
        frame.style.backgroundSize = "cover";
        frame.style.backgroundPosition = "center";
      }
    }, true);
    // Respect reduced-motion preference and metered/data-saver connections —
    // pause playback but keep the poster frame visible (no broken/blank hero).
    if (prefersReducedMotion || saveData) {
      vid.pause();
      vid.removeAttribute("autoplay");
    }
  });

  /* ---------- Mobile nav toggle ---------- */
  const mnav = document.getElementById("mnav");
  if (mnav) {
    document.querySelectorAll("[data-nav-open]").forEach(btn => btn.addEventListener("click", () => mnav.classList.add("open")));
    document.querySelectorAll("[data-nav-close]").forEach(btn => btn.addEventListener("click", () => mnav.classList.remove("open")));
  }

  /* ---------- Diagnostics accordion ---------- */
  document.querySelectorAll(".diag-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".diag-item");
      const wasOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".diag-item").forEach(i => i.classList.remove("is-open"));
      if (!wasOpen) item.classList.add("is-open");
    });
  });

  /* ---------- Gallery filter tabs ---------- */
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        document.querySelectorAll(".gallery-tile").forEach((tile) => {
          const match = filter === "all" || tile.dataset.category === filter;
          tile.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

});
