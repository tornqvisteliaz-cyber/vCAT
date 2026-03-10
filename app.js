const DEFAULT_DATA = {
  brand: {
    name: "Copenhagen AirTaxi Virtual",
    slogan: "Precision. Personality. Scandinavian skies.",
    shortIntro:
      "A next-generation virtual airline group blending premium charter operations and playful low-cost flying.",
    contactEmail: "ops@copenhagen-airtaxi-virtual.com",
    discord: "https://discord.gg/catv"
  },
  airlines: [
    {
      name: "Airseven",
      style: "Premium Regional",
      description: "Regional and executive-focused operation with clean procedures and high dispatch reliability.",
      bases: ["EDDM", "ESGJ", "ESSA"],
      fleet: ["C208B", "PC-12", "B737-800"],
      callsign: "AIRSEVEN"
    },
    {
      name: "Pop!",
      style: "Low-cost Leisure",
      description: "Colorful, high-energy low-cost network connecting key city pairs and holiday routes.",
      bases: ["EDDF", "EKCH", "ESGG"],
      fleet: ["A320neo", "E195", "B737-700"],
      callsign: "POPAIR"
    }
  ],
  routes: [
    { from: "EKCH", to: "ESSA", airline: "Pop!", duration: "1h 10m" },
    { from: "EDDM", to: "ESGJ", airline: "Airseven", duration: "1h 45m" },
    { from: "EDDF", to: "ESGG", airline: "Pop!", duration: "1h 20m" },
    { from: "ESSA", to: "EDDM", airline: "Airseven", duration: "2h 5m" }
  ],
  news: [
    { title: "Spring schedule released", text: "15 new city pairs and expanded weekend traffic." },
    { title: "Pilot rank refresh", text: "New progression badges and monthly challenge flights are live." },
    { title: "Shared dispatch center", text: "Airseven and Pop! now share smarter route planning tools." }
  ],
  operations: {
    highlights: [
      "SmartCrew dispatch packs",
      "Real weather + SOP-based ops",
      "Weekly events on VATSIM/IVAO",
      "Performance tracking dashboard"
    ],
    training:
      "New pilots start in the Academy with guided check rides, route familiarization and structured progression."
  }
};

const STORAGE_KEY = "vcatDataV2";
const ADMIN_PASSWORD = "popwings";
const byId = (id) => document.getElementById(id);
const toStringSafe = (value, fallback = "") => (typeof value === "string" ? value : fallback);
const toArraySafe = (value) => (Array.isArray(value) ? value : []);

function cloneValue(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(base, patch) {
  if (Array.isArray(base)) return Array.isArray(patch) ? patch : base;
  if (typeof base !== "object" || base === null) return patch ?? base;
  if (typeof patch !== "object" || patch === null) patch = {};

  const out = { ...base };
  for (const key of Object.keys(base)) out[key] = mergeDeep(base[key], patch[key]);
  for (const key of Object.keys(patch)) if (!(key in out)) out[key] = patch[key];
  return out;
}

function normalizeData(data) {
  const merged = mergeDeep(cloneValue(DEFAULT_DATA), data || {});

  merged.brand = {
    name: toStringSafe(merged.brand?.name, DEFAULT_DATA.brand.name) || DEFAULT_DATA.brand.name,
    slogan: toStringSafe(merged.brand?.slogan),
    shortIntro: toStringSafe(merged.brand?.shortIntro),
    contactEmail: toStringSafe(merged.brand?.contactEmail),
    discord: toStringSafe(merged.brand?.discord)
  };

  merged.airlines = toArraySafe(merged.airlines)
    .map((a) => ({
      name: toStringSafe(a?.name).trim(),
      style: toStringSafe(a?.style),
      description: toStringSafe(a?.description),
      bases: toArraySafe(a?.bases).map((b) => toStringSafe(b).trim().toUpperCase()).filter(Boolean),
      fleet: toArraySafe(a?.fleet).map((f) => toStringSafe(f).trim()).filter(Boolean),
      callsign: toStringSafe(a?.callsign).trim().toUpperCase()
    }))
    .filter((a) => a.name);

  const validAirlineNames = new Set(merged.airlines.map((a) => a.name));
  merged.routes = toArraySafe(merged.routes)
    .map((r) => ({
      from: toStringSafe(r?.from).trim().toUpperCase(),
      to: toStringSafe(r?.to).trim().toUpperCase(),
      airline: toStringSafe(r?.airline).trim(),
      duration: toStringSafe(r?.duration).trim()
    }))
    .filter((r) => r.from && r.to && r.airline && validAirlineNames.has(r.airline));

  merged.news = toArraySafe(merged.news)
    .map((n) => ({ title: toStringSafe(n?.title), text: toStringSafe(n?.text) }))
    .filter((n) => n.title || n.text);

  merged.operations = {
    highlights: toArraySafe(merged.operations?.highlights).map((h) => toStringSafe(h)).filter(Boolean),
    training: toStringSafe(merged.operations?.training)
  };

  return merged;
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("vcatData");
  if (!raw) return cloneValue(DEFAULT_DATA);
  try {
    return normalizeData(JSON.parse(raw));
  } catch {
    return cloneValue(DEFAULT_DATA);
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeData(data)));
}

function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = byId("siteMenu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

function initRevealAnimations() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length || typeof IntersectionObserver !== "function") return;

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

  nodes.forEach((node) => io.observe(node));
}

function renderNav(data) {
  document.querySelectorAll('[data-bind="siteName"]').forEach((el) => {
    el.textContent = data.brand.name;
  });
}

function renderHome(data) {
  byId("heroTitle").textContent = data.brand.name;
  byId("heroSlogan").textContent = data.brand.slogan;
  byId("heroIntro").textContent = data.brand.shortIntro;

  byId("quickStats").innerHTML = `
    <article class="reveal"><strong>${data.airlines.length}</strong><span>Airline Brands</span></article>
    <article class="reveal"><strong>${data.routes.length}</strong><span>Live Routes</span></article>
    <article class="reveal"><strong>${new Set(data.airlines.flatMap((a) => a.bases)).size}</strong><span>Base Airports</span></article>
  `;

  byId("newsGrid").innerHTML = data.news
    .map((item) => `<article class="card reveal"><h3>${item.title}</h3><p>${item.text}</p></article>`)
    .join("");

  const featured = byId("featuredAirlines");
  if (featured) {
    featured.innerHTML = data.airlines
      .map(
        (a) => `<article class="card reveal"><h3>${a.name}</h3><p class="muted">${a.style} · ${a.callsign}</p><p>${a.description}</p></article>`
      )
      .join("");
  }
}

function renderAirlines(data) {
  const host = byId("airlineCards");
  if (!host) return;

  host.replaceChildren(
    ...data.airlines.map((airline) => {
      const el = document.createElement("article");
      el.className = "card airline reveal";
      el.innerHTML = `
        <h3>${airline.name}</h3>
        <p class="muted">${airline.style} · Callsign ${airline.callsign}</p>
        <p>${airline.description}</p>
        <p><strong>Bases:</strong> ${airline.bases.join(", ")}</p>
        <div>${airline.fleet.map((f) => `<span class="chip">${f}</span>`).join("")}</div>
      `;
      return el;
    })
  );
}

function renderFleet(data) {
  const host = byId("fleetGrid");
  if (!host) return;
  const rows = [];
  data.airlines.forEach((a) => {
    a.fleet.forEach((aircraft) => {
      rows.push(`<article class="card reveal"><h3>${aircraft}</h3><p class="muted">${a.name}</p><p>Operational in ${a.bases.join(", ")}</p></article>`);
    });
  });
  host.innerHTML = rows.join("");
}

function renderDestinations(data) {
  const host = byId("destinationGrid");
  if (!host) return;
  host.innerHTML = data.routes
    .map(
      (r) =>
        `<article class="card reveal"><h3>${r.from} → ${r.to}</h3><p class="muted">${r.airline}</p><p>Block time: ${r.duration || "TBD"}</p></article>`
    )
    .join("");
}

function renderRouteRows(routes) {
  const body = byId("routeRows");
  if (!body) return;
  body.innerHTML = routes
    .map((r) => `<tr><td>${r.from}</td><td>${r.to}</td><td>${r.airline}</td><td>${r.duration || "TBD"}</td></tr>`)
    .join("");
}

function renderRoutes(data) {
  const routes = data.routes;
  renderRouteRows(routes);

  const fromFilter = byId("routeFilterFrom");
  const toFilter = byId("routeFilterTo");
  const airlineFilter = byId("routeFilterAirline");
  const resetBtn = byId("routeFilterReset");
  if (!fromFilter || !toFilter || !airlineFilter || !resetBtn) return;

  airlineFilter.innerHTML = ["<option value=''>All airlines</option>"]
    .concat(data.airlines.map((a) => `<option value="${a.name}">${a.name}</option>`))
    .join("");

  const applyFilters = () => {
    const from = fromFilter.value.trim().toUpperCase();
    const to = toFilter.value.trim().toUpperCase();
    const airline = airlineFilter.value.trim();

    renderRouteRows(
      routes.filter((r) => {
        const fromMatch = !from || r.from.includes(from);
        const toMatch = !to || r.to.includes(to);
        const airlineMatch = !airline || r.airline === airline;
        return fromMatch && toMatch && airlineMatch;
      })
    );
  };

  fromFilter.oninput = applyFilters;
  toFilter.oninput = applyFilters;
  airlineFilter.onchange = applyFilters;
  resetBtn.onclick = () => {
    fromFilter.value = "";
    toFilter.value = "";
    airlineFilter.value = "";
    renderRouteRows(routes);
  };
}

function renderOperations(data) {
  const list = byId("opsHighlights");
  if (list) list.innerHTML = data.operations.highlights.map((h) => `<li>${h}</li>`).join("");
  const training = byId("trainingText");
  if (training) training.textContent = data.operations.training;
  const contact = byId("contactLine");
  if (contact) contact.textContent = `${data.brand.contactEmail} · ${data.brand.discord}`;
}

function renderByPage() {
  const data = loadData();
  renderNav(data);
  initMenu();

  const page = document.body.dataset.page;
  if (page === "home") renderHome(data);
  if (page === "airlines") renderAirlines(data);
  if (page === "fleet") renderFleet(data);
  if (page === "destinations") renderDestinations(data);
  if (page === "routes") renderRoutes(data);
  if (page === "operations") renderOperations(data);

  initRevealAnimations();
}

function setupAdminPage() {
  const adminRoot = byId("adminRoot");
  if (!adminRoot) return;

  const gate = byId("adminGate");
  const gateInput = byId("adminPassword");
  const gateStatus = byId("gateStatus");
  const unlockBtn = byId("unlockAdmin");

  const unlock = () => {
    gate.hidden = true;
    adminRoot.hidden = false;
    initRevealAnimations();
  };

  unlockBtn?.addEventListener("click", () => {
    if ((gateInput?.value || "") === ADMIN_PASSWORD) {
      unlock();
    } else {
      gateStatus.textContent = "Wrong password.";
    }
  });

  gateInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlockBtn?.click();
  });

  let data = loadData();
  const rawJson = byId("rawJson");
  const jsonStatus = byId("jsonStatus");

  function syncRouteAirlineSelect() {
    const routeAirline = byId("routeAirline");
    routeAirline.innerHTML = data.airlines.map((a) => `<option value="${a.name}">${a.name}</option>`).join("");
  }

  function paint() {
    byId("siteNameInput").value = data.brand.name;
    byId("sloganInput").value = data.brand.slogan;
    byId("introInput").value = data.brand.shortIntro;
    byId("emailInput").value = data.brand.contactEmail;
    byId("discordInput").value = data.brand.discord;

    byId("airlineList").innerHTML = data.airlines
      .map((a, i) => `<li>${a.name} (${a.bases.join(", ")}) <button class="ghost" data-del-airline="${i}">Delete</button></li>`)
      .join("");

    byId("routeList").innerHTML = data.routes
      .map((r, i) => `<li>${r.from}→${r.to} ${r.airline} <button class="ghost" data-del-route="${i}">Delete</button></li>`)
      .join("");

    syncRouteAirlineSelect();
    rawJson.value = JSON.stringify(data, null, 2);
  }

  byId("saveGeneral").onclick = () => {
    data.brand.name = byId("siteNameInput").value.trim() || DEFAULT_DATA.brand.name;
    data.brand.slogan = byId("sloganInput").value.trim();
    data.brand.shortIntro = byId("introInput").value.trim();
    data.brand.contactEmail = byId("emailInput").value.trim();
    data.brand.discord = byId("discordInput").value.trim();
    saveData(data);
    data = loadData();
    jsonStatus.textContent = "Brand saved.";
    paint();
  };

  byId("addAirline").onclick = () => {
    const name = byId("airlineName").value.trim();
    if (!name) return;

    if (data.airlines.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
      jsonStatus.textContent = "Airline already exists.";
      return;
    }

    data.airlines.push({
      name,
      style: byId("airlineStyle").value.trim() || "Custom",
      description: byId("airlineDescription").value.trim(),
      bases: byId("airlineBases").value.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean),
      fleet: byId("airlineFleet").value.split(",").map((s) => s.trim()).filter(Boolean),
      callsign: byId("airlineCallsign").value.trim().toUpperCase() || "CUSTOM"
    });

    saveData(data);
    data = loadData();
    jsonStatus.textContent = "Airline added.";
    paint();
  };

  byId("addRoute").onclick = () => {
    const from = byId("routeFrom").value.trim().toUpperCase();
    const to = byId("routeTo").value.trim().toUpperCase();
    const airline = byId("routeAirline").value.trim();
    const duration = byId("routeDuration").value.trim();

    if (!from || !to || !airline) {
      jsonStatus.textContent = "Route requires from, to and airline.";
      return;
    }

    data.routes.push({ from, to, airline, duration });
    saveData(data);
    data = loadData();
    jsonStatus.textContent = "Route added.";
    paint();
  };

  byId("airlineList").onclick = (e) => {
    const i = e.target?.dataset?.delAirline;
    if (i === undefined) return;

    const removed = data.airlines.splice(Number(i), 1)[0];
    data.routes = data.routes.filter((r) => r.airline !== removed.name);
    saveData(data);
    data = loadData();
    jsonStatus.textContent = "Airline removed.";
    paint();
  };

  byId("routeList").onclick = (e) => {
    const i = e.target?.dataset?.delRoute;
    if (i === undefined) return;

    data.routes.splice(Number(i), 1);
    saveData(data);
    data = loadData();
    jsonStatus.textContent = "Route removed.";
    paint();
  };

  byId("saveJson").onclick = () => {
    try {
      data = normalizeData(JSON.parse(rawJson.value));
      saveData(data);
      data = loadData();
      jsonStatus.textContent = "JSON saved.";
      paint();
    } catch {
      jsonStatus.textContent = "Invalid JSON.";
    }
  };

  byId("copyJson").onclick = async () => {
    try {
      await navigator.clipboard.writeText(rawJson.value);
      jsonStatus.textContent = "JSON copied to clipboard.";
    } catch {
      jsonStatus.textContent = "Could not copy JSON in this browser.";
    }
  };

  byId("resetData").onclick = () => {
    data = cloneValue(DEFAULT_DATA);
    saveData(data);
    data = loadData();
    jsonStatus.textContent = "Defaults restored.";
    paint();
  };

  paint();
}

window.vcat = { loadData, saveData, renderByPage, setupAdminPage };
