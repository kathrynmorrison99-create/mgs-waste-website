// MGS Waste — shared site behavior

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initScrollReveal();
  initGalleryFilter();
  initContactForm();
  initFooterYear();
});

function initNavToggle() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

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

  items.forEach((el) => observer.observe(el));
}

function initGalleryFilter() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const match = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    const submitBtn = form.querySelector('button[type="submit"]');

    const data = new FormData(form);
    if (submitBtn) submitBtn.disabled = true;

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    })
      .then(() => {
        if (status) status.textContent = "Thanks — your message has been sent. We'll be in touch soon.";
        form.reset();
      })
      .catch(() => {
        if (status) status.textContent = "Something went wrong sending that. Please call or email us directly.";
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
}

function initFooterYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}
