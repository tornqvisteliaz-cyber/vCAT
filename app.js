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

function mergeDeep(base, patch) {
  if (Array.isArray(base)) return Array.isArray(patch) ? patch : base;
  if (typeof base !== "object" || base === null) return patch ?? base;
  const out = { ...base };
  for (const key of Object.keys(base)) {
    out[key] = mergeDeep(base[key], patch?.[key]);
  }
  for (const key of Object.keys(patch || {})) {
    if (!(key in out)) out[key] = patch[key];
  }
  return out;
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("vcatData");
  if (!raw) return structuredClone(DEFAULT_DATA);
  try {
    return mergeDeep(structuredClone(DEFAULT_DATA), JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const byId = (id) => document.getElementById(id);

function renderNav(data) {
  const siteName = document.querySelectorAll('[data-bind="siteName"]');
  siteName.forEach((el) => (el.textContent = data.brand.name));
}

function renderHome(data) {
  byId("heroTitle").textContent = data.brand.name;
  byId("heroSlogan").textContent = data.brand.slogan;
  byId("heroIntro").textContent = data.brand.shortIntro;
  byId("quickStats").innerHTML = `
    <article><strong>${data.airlines.length}</strong><span>Airline Brands</span></article>
    <article><strong>${data.routes.length}</strong><span>Live Routes</span></article>
    <article><strong>${new Set(data.airlines.flatMap((a) => a.bases)).size}</strong><span>Base Airports</span></article>
  `;

  byId("newsGrid").innerHTML = data.news
    .map((item) => `<article class="card"><h3>${item.title}</h3><p>${item.text}</p></article>`)
    .join("");
}

function renderAirlines(data) {
  byId("airlineCards")?.replaceChildren(
    ...data.airlines.map((airline) => {
      const el = document.createElement("article");
      el.className = "card airline";
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

function renderRoutes(data) {
  const body = byId("routeRows");
  if (!body) return;
  body.innerHTML = data.routes
    .map(
      (r) => `<tr><td>${r.from}</td><td>${r.to}</td><td>${r.airline}</td><td>${r.duration || "TBD"}</td></tr>`
    )
    .join("");
}

function renderOperations(data) {
  const list = byId("opsHighlights");
  if (list) list.innerHTML = data.operations.highlights.map((h) => `<li>${h}</li>`).join("");
  const t = byId("trainingText");
  if (t) t.textContent = data.operations.training;
  const c = byId("contactLine");
  if (c) c.textContent = `${data.brand.contactEmail} · ${data.brand.discord}`;
}

function renderByPage() {
  const data = loadData();
  renderNav(data);
  const page = document.body.dataset.page;
  if (page === "home") renderHome(data);
  if (page === "airlines") renderAirlines(data);
  if (page === "routes") renderRoutes(data);
  if (page === "operations") renderOperations(data);
  if (page === "community") renderOperations(data);
}

function setupAdminPage() {
  if (!byId("adminRoot")) return;
  let data = loadData();
  const rawJson = byId("rawJson");

  function paint() {
    byId("siteNameInput").value = data.brand.name;
    byId("sloganInput").value = data.brand.slogan;
    byId("introInput").value = data.brand.shortIntro;
    byId("emailInput").value = data.brand.contactEmail;
    byId("discordInput").value = data.brand.discord;
    byId("airlineList").innerHTML = data.airlines
      .map(
        (a, i) => `<li>${a.name} (${a.bases.join(", ")}) <button class="ghost" data-del-airline="${i}">Delete</button></li>`
      )
      .join("");
    byId("routeList").innerHTML = data.routes
      .map(
        (r, i) => `<li>${r.from}→${r.to} ${r.airline} <button class="ghost" data-del-route="${i}">Delete</button></li>`
      )
      .join("");
    rawJson.value = JSON.stringify(data, null, 2);
  }

  byId("saveGeneral").onclick = () => {
    data.brand.name = byId("siteNameInput").value.trim();
    data.brand.slogan = byId("sloganInput").value.trim();
    data.brand.shortIntro = byId("introInput").value.trim();
    data.brand.contactEmail = byId("emailInput").value.trim();
    data.brand.discord = byId("discordInput").value.trim();
    saveData(data);
    paint();
  };

  byId("addAirline").onclick = () => {
    const name = byId("airlineName").value.trim();
    if (!name) return;
    data.airlines.push({
      name,
      style: byId("airlineStyle").value.trim() || "Custom",
      description: byId("airlineDescription").value.trim(),
      bases: byId("airlineBases").value.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean),
      fleet: byId("airlineFleet").value.split(",").map((s) => s.trim()).filter(Boolean),
      callsign: byId("airlineCallsign").value.trim().toUpperCase() || "CUSTOM"
    });
    saveData(data);
    paint();
  };

  byId("addRoute").onclick = () => {
    const from = byId("routeFrom").value.trim().toUpperCase();
    const to = byId("routeTo").value.trim().toUpperCase();
    if (!from || !to) return;
    data.routes.push({ from, to, airline: byId("routeAirline").value.trim(), duration: byId("routeDuration").value.trim() });
    saveData(data);
    paint();
  };

  byId("airlineList").onclick = (e) => {
    const i = e.target?.dataset?.delAirline;
    if (i === undefined) return;
    const removed = data.airlines.splice(Number(i), 1)[0];
    data.routes = data.routes.filter((r) => r.airline !== removed.name);
    saveData(data);
    paint();
  };

  byId("routeList").onclick = (e) => {
    const i = e.target?.dataset?.delRoute;
    if (i === undefined) return;
    data.routes.splice(Number(i), 1);
    saveData(data);
    paint();
  };

  byId("saveJson").onclick = () => {
    try {
      const parsed = JSON.parse(rawJson.value);
      data = mergeDeep(structuredClone(DEFAULT_DATA), parsed);
      saveData(data);
      byId("jsonStatus").textContent = "JSON saved.";
      paint();
    } catch {
      byId("jsonStatus").textContent = "Invalid JSON.";
    }
  };

  byId("resetData").onclick = () => {
    data = structuredClone(DEFAULT_DATA);
    saveData(data);
    paint();
  };

  paint();
}

window.vcat = { loadData, saveData, renderByPage, setupAdminPage };
