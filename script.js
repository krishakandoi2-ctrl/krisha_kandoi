const caseStudies = {
  atlas: {
    category: "Fintech Platform",
    title: "Atlas Capital",
    description:
      "Reframed a dense investment offering into a confident, high-trust website with clear conversion paths and executive-friendly content blocks.",
    stats: [
      { value: "31%", label: "increase in qualified leads" },
      { value: "5 pages", label: "streamlined decision journey" },
      { value: "2 weeks", label: "from direction to launch-ready build" },
    ],
  },
  vivid: {
    category: "Hospitality Brand",
    title: "Vivid House",
    description:
      "Created a richer editorial homepage for a boutique hotel group, pairing expressive visuals with simplified booking intent and local storytelling.",
    stats: [
      { value: "22%", label: "more direct bookings" },
      { value: "48 sec", label: "average engagement increase" },
      { value: "Mobile-first", label: "experience tuned for travelers" },
    ],
  },
  harbor: {
    category: "B2B Consultancy",
    title: "Harbor Advisory",
    description:
      "Built a sober, premium redesign that clarified service lines, established authority, and made complex offerings easier to understand at a glance.",
    stats: [
      { value: "3x", label: "clearer service segmentation" },
      { value: "12 sections", label: "reorganized into a tighter story" },
      { value: "Fast", label: "lean codebase for easy maintenance" },
    ],
  },
};

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const revealItems = document.querySelectorAll(".reveal");
const showcaseTabs = [...document.querySelectorAll(".showcase-tab")];
const caseCategory = document.getElementById("case-category");
const caseTitle = document.getElementById("case-title");
const caseDescription = document.getElementById("case-description");
const caseStats = document.getElementById("case-stats");
const showcaseCard = document.getElementById("showcase-card");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

function toggleNav(forceState) {
  const nextOpen = typeof forceState === "boolean" ? forceState : !siteNav.classList.contains("is-open");
  siteNav.classList.toggle("is-open", nextOpen);
  navToggle.setAttribute("aria-expanded", String(nextOpen));
}

function renderCaseStudy(key) {
  const content = caseStudies[key];

  if (!content) {
    return;
  }

  caseCategory.textContent = content.category;
  caseTitle.textContent = content.title;
  caseDescription.textContent = content.description;
  caseStats.innerHTML = content.stats
    .map(
      (item) => `
        <div>
          <strong>${item.value}</strong>
          <span>${item.label}</span>
        </div>
      `
    )
    .join("");

  showcaseTabs.forEach((tab) => {
    const isActive = tab.dataset.case === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");

    if (isActive) {
      showcaseCard?.setAttribute("aria-labelledby", tab.id);
    }
  });
}

function setActiveNavLink(id) {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isMatch);
  });
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => toggleNav());
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => toggleNav(false));
});

showcaseTabs.forEach((tab) => {
  tab.addEventListener("click", () => renderCaseStudy(tab.dataset.case));
  tab.addEventListener("keydown", (event) => {
    const currentIndex = showcaseTabs.indexOf(tab);
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (!direction) {
      return;
    }

    event.preventDefault();
    const nextIndex = (currentIndex + direction + showcaseTabs.length) % showcaseTabs.length;
    const nextTab = showcaseTabs[nextIndex];
    renderCaseStudy(nextTab.dataset.case);
    nextTab.focus();
  });
});

document.addEventListener("click", (event) => {
  if (!siteNav.classList.contains("is-open")) {
    return;
  }

  if (event.target instanceof Node && !siteNav.contains(event.target) && !navToggle.contains(event.target)) {
    toggleNav(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    toggleNav(false);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id) {
        setActiveNavLink(entry.target.id);
      }
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0.1,
  }
);

document.querySelectorAll("section[id]").forEach((section) => sectionObserver.observe(section));

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());
  const values = Object.values(payload).map((value) => String(value).trim());
  const isComplete = values.every(Boolean);
  const hasValidEmail = /\S+@\S+\.\S+/.test(String(payload.email || ""));

  if (!isComplete) {
    formMessage.textContent = "Please complete all fields before sending your inquiry.";
    return;
  }

  if (!hasValidEmail) {
    formMessage.textContent = "Please enter a valid email address.";
    return;
  }

  formMessage.textContent = `Thanks, ${payload.name}. Your inquiry is ready to be connected to a backend or email workflow.`;
  contactForm.reset();
});

renderCaseStudy("atlas");
