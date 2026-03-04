const DEFAULT_DATA = {
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
  }
}

function saveData(data) {
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
