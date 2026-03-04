DEFAULT_DATA = {
 codex/create-website-for-copenhagen-airtaxi-virtual-mqxcvr
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
      fleet: ["B737-800"],
      callsign: "AIRSEVEN"
    },
    {
      name: "Pop!",
      style: "Low-cost Leisure",
      description: "Colorful, high-energy low-cost network connecting key city pairs and holiday routes.",
      bases: ["EDDF", "EKCH", "ESGG"],
      fleet: [B77W", "B748", "A333"],
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

function cloneValue(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(base, patch) {
  if (Array.isArray(base)) return Array.isArray(patch) ? patch : base;
  if (typeof base !== "object" || base === null) return patch ?? base;
  if (typeof patch !== "object" || patch === null) patch = {};

  const out = { ...base };
  for (const key of Object.keys(base)) {
    out[key] = mergeDeep(base[key], patch[key]);
  }
  for (const key of Object.keys(patch)) {
    if (!(key in out)) out[key] = patch[key];
  }
  return out;
}

function toStringSafe(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toArraySafe(value) {
  return Array.isArray(value) ? value : [];
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

  siteName: "Copenhagen AirTaxi Virtual",
  tagline: "Fly smart routes across Europe with style, reliability and Scandinavian precision.",
  about:
    "Copenhagen AirTaxi Virtual is a modern VA with two unique airline brands. We focus on realistic operations, friendly community flying, and clear progression for every pilot.",
  airlines: [
    {
      name: "Airseven",
      description: "Regional and business routes with efficient daily operations.",
      bases: ["EDDM", "ESGJ", "ESSA"],
      fleet: ["C208B", "PC-12", "B737-800"]
    },
    {
      name: "Pop!",
      description: "Energetic low-cost network connecting major and secondary cities.",
      bases: ["EDDF", "EKCH", "ESGG"],
      fleet: ["A320neo", "E195", "B737-700"]
    }
  ],
  routes: [
    { from: "EKCH", to: "ESSA", airline: "Pop!" },
    { from: "EDDM", to: "ESGJ", airline: "Airseven" },
    { from: "EDDF", to: "ESGG", airline: "Pop!" }
  ],
  contactEmail: "ops@copenhagen-airtaxi-virtual.com"
};

const STORAGE_KEY = "vcatData";

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return structuredClone(DEFAULT_DATA);
  }
  try {
    return { ...structuredClone(DEFAULT_DATA), ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_DATA);
 main
  }
}

function saveData(data) {
 codex/create-website-for-copenhagen-airtaxi-virtual-mqxcvr
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeData(data)));
}

const byId = (id) => document.getElementById(id);

function renderNav(data) {
  const siteNameNodes = document.querySelectorAll('[data-bind="siteName"]');
  siteNameNodes.forEach((el) => {
    el.textContent = data.brand.name;
  });
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
  const host = byId("airlineCards");
  if (!host) return;

  host.replaceChildren(
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
    .map((r) => `<tr><td>${r.from}</td><td>${r.to}</td><td>${r.airline}</td><td>${r.duration || "TBD"}</td></tr>`)
    .join("");
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

  const page = document.body.dataset.page;
  if (page === "home") renderHome(data);
  if (page === "airlines") renderAirlines(data);
  if (page === "routes") renderRoutes(data);
  if (page === "operations") renderOperations(data);
}

function setupAdminPage() {
  if (!byId("adminRoot")) return;

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
    paint();
  };

  byId("addAirline").onclick = () => {
    const name = byId("airlineName").value.trim();
    if (!name) return;

    const exists = data.airlines.some((a) => a.name.toLowerCase() === name.toLowerCase());
    if (exists) {
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
      const parsed = JSON.parse(rawJson.value);
      data = normalizeData(parsed);
      saveData(data);
      data = loadData();
      jsonStatus.textContent = "JSON saved.";
      paint();
    } catch {
      jsonStatus.textContent = "Invalid JSON.";
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
=======
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function byId(id) {
  return document.getElementById(id);
}

function renderPublicSite(data) {
  byId("siteName").textContent = data.siteName;
  byId("heroTitle").textContent = data.siteName;
  byId("heroTagline").textContent = data.tagline;
  byId("aboutText").textContent = data.about;
  byId("contactEmail").textContent = data.contactEmail;

  const airlinesContainer = byId("airlinesContainer");
  airlinesContainer.innerHTML = "";

  data.airlines.forEach((airline) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h4>${airline.name}</h4>
      <p>${airline.description || "No description yet."}</p>
      <p><strong>Bases:</strong> ${airline.bases.join(", ") || "-"}</p>
      <div>${airline.fleet.map((f) => `<span class="tag">${f}</span>`).join("")}</div>
    `;
    airlinesContainer.appendChild(card);
  });

  const routeList = byId("routeList");
  routeList.innerHTML = "";
  data.routes.forEach((route) => {
    const item = document.createElement("li");
    item.textContent = `${route.from} → ${route.to} (${route.airline})`;
    routeList.appendChild(item);
  });

  byId("countAirlines").textContent = data.airlines.length;
  byId("countBases").textContent = data.airlines.reduce((sum, a) => sum + a.bases.length, 0);
  byId("countRoutes").textContent = data.routes.length;
}

function setupAdminPage() {
  const adminRoot = byId("adminRoot");
  if (!adminRoot) {
    return;
  }

  let data = loadData();

  const siteNameInput = byId("siteNameInput");
  const taglineInput = byId("taglineInput");
  const aboutInput = byId("aboutInput");
  const contactInput = byId("contactInput");
  const airlineList = byId("adminAirlineList");
  const routeTable = byId("adminRouteList");
  const routeAirlineSelect = byId("routeAirline");

  function syncGeneralForm() {
    siteNameInput.value = data.siteName;
    taglineInput.value = data.tagline;
    aboutInput.value = data.about;
    contactInput.value = data.contactEmail;
  }

  function syncAirlineSelector() {
    routeAirlineSelect.innerHTML = data.airlines
      .map((airline) => `<option value="${airline.name}">${airline.name}</option>`)
      .join("");
  }

  function renderAirlinesAdmin() {
    airlineList.innerHTML = "";
    data.airlines.forEach((airline, index) => {
      const item = document.createElement("div");
      item.className = "card";
      item.innerHTML = `
        <h4>${airline.name}</h4>
        <p class="tiny">Bases: ${airline.bases.join(", ") || "-"}</p>
        <p class="tiny">Fleet: ${airline.fleet.join(", ") || "-"}</p>
        <button class="btn danger" data-remove-airline="${index}">Delete airline</button>
      `;
      airlineList.appendChild(item);
    });
  }

  function renderRoutesAdmin() {
    routeTable.innerHTML = "";
    data.routes.forEach((route, index) => {
      const line = document.createElement("li");
      line.innerHTML = `${route.from} → ${route.to} <span class="tiny">(${route.airline})</span>
        <button class="btn danger" style="margin-left:.5rem" data-remove-route="${index}">Delete</button>`;
      routeTable.appendChild(line);
    });
  }

  function commit() {
    saveData(data);
    syncAirlineSelector();
    renderAirlinesAdmin();
    renderRoutesAdmin();
  }

  byId("saveGeneral").addEventListener("click", () => {
    data.siteName = siteNameInput.value.trim() || DEFAULT_DATA.siteName;
    data.tagline = taglineInput.value.trim();
    data.about = aboutInput.value.trim();
    data.contactEmail = contactInput.value.trim();
    commit();
    alert("General content saved.");
  });

  byId("addAirline").addEventListener("click", () => {
    const name = byId("airlineName").value.trim();
    if (!name) return;
    const description = byId("airlineDescription").value.trim();
    const bases = byId("airlineBases").value
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    const fleet = byId("airlineFleet").value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    data.airlines.push({ name, description, bases, fleet });

    byId("airlineName").value = "";
    byId("airlineDescription").value = "";
    byId("airlineBases").value = "";
    byId("airlineFleet").value = "";
    commit();
  });

  airlineList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const removeIndex = target.dataset.removeAirline;
    if (removeIndex === undefined) return;

    const index = Number(removeIndex);
    const removed = data.airlines[index];
    data.airlines.splice(index, 1);
    data.routes = data.routes.filter((route) => route.airline !== removed.name);
    commit();
  });

  byId("addRoute").addEventListener("click", () => {
    const from = byId("routeFrom").value.trim().toUpperCase();
    const to = byId("routeTo").value.trim().toUpperCase();
    const airline = routeAirlineSelect.value;
    if (!from || !to || !airline) return;
    data.routes.push({ from, to, airline });
    byId("routeFrom").value = "";
    byId("routeTo").value = "";
    commit();
  });

  routeTable.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const removeIndex = target.dataset.removeRoute;
    if (removeIndex === undefined) return;

    data.routes.splice(Number(removeIndex), 1);
    commit();
  });

  byId("resetData").addEventListener("click", () => {
    data = structuredClone(DEFAULT_DATA);
    syncGeneralForm();
    commit();
  });

  syncGeneralForm();
  commit();
}

window.vcat = { loadData, saveData, renderPublicSite, setupAdminPage };
 main
