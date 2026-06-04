document.addEventListener("DOMContentLoaded", () => {
  loadSiteContent();
});

async function loadSiteContent() {
  try {
    const response = await fetch("/content/site.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    applySiteContent(data);
  } catch (error) {
    console.warn("CMS content could not be loaded.", error);
  }
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el && value !== undefined && value !== null) el.textContent = value;
}

function setLink(selector, text, href) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (text) el.textContent = text;
  if (href) el.setAttribute("href", href);
}

function applySiteContent(data) {
  document.title = `${data.business_name || "JT Offroad"} | ${data.headline || "Built Beyond the Pavement"}`;

  const logo = document.querySelector("#site-logo");
  if (logo && data.logo_image) {
    logo.src = data.logo_image;
    logo.style.display = "block";
  }

  setText("[data-cms='business_name']", data.business_name);
 const hero = document.querySelector(".hero");
if (hero && data.hero_image) {
  hero.style.backgroundImage = `url("${data.hero_image}")`;
  hero.style.backgroundSize = "600px auto";
  hero.style.backgroundPosition = "center 22%";
  hero.style.backgroundRepeat = "no-repeat";
}
}
setText("[data-cms='headline']", data.headline);
setText("[data-cms='subheadline']", data.subheadline);
  setText("[data-cms='headline']", data.headline);
  setText("[data-cms='subheadline']", data.subheadline);
  setText("[data-cms='about_title']", data.about_title);
  setText("[data-cms='about_text']", data.about_text);
  setText("[data-cms='location']", data.location);
  setText("[data-cms='quote_intro']", data.quote_intro);

  setLink("[data-cms='primary_button']", data.primary_button_text, data.primary_button_link);
  setLink("[data-cms='secondary_button']", data.secondary_button_text, data.secondary_button_link);

  document.querySelectorAll("[data-cms='phone']").forEach(el => {
    el.textContent = data.phone || "Add phone in CMS";
    if (data.phone && el.tagName === "A") el.href = `tel:${data.phone.replace(/[^0-9+]/g, "")}`;
  });

  document.querySelectorAll("[data-cms='email']").forEach(el => {
    el.textContent = data.email || "Add email in CMS";
    if (data.email && el.tagName === "A") el.href = `mailto:${data.email}`;
  });

  document.querySelectorAll("[data-cms='instagram']").forEach(el => {
    el.textContent = data.instagram || "Add Instagram in CMS";
    if (data.instagram && el.tagName === "A") {
      el.href = data.instagram.startsWith("http") ? data.instagram : `https://instagram.com/${data.instagram.replace("@", "")}`;
    }
  });

  renderCards("#services-list", data.services, service => `
    <article class="card">
      <h3>${escapeHtml(service.title)}</h3>
      <p>${escapeHtml(service.description)}</p>
    </article>
  `);

  renderCards("#reviews-list", data.reviews, review => `
    <article class="review-card">
      <p>“${escapeHtml(review.text)}”</p>
      <strong>— ${escapeHtml(review.name)}</strong>
    </article>
  `);

  renderCards("#merch-list", data.merch, item => `
    <article class="card">
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.description)}</p>
      ${item.link ? `<a class="text-link" href="${escapeAttr(item.link)}">View Item</a>` : ""}
    </article>
  `);
}

function renderCards(selector, items, template) {
  const container = document.querySelector(selector);
  if (!container || !Array.isArray(items)) return;
  container.innerHTML = items.map(template).join("");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttr(value = "") {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
