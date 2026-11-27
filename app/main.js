// FridayFinder: a deal finder that runs entirely from its own files. No network
// request is made at run time — the deals live in data.js and every control below
// filters them in the browser.
//
//   #/                 the list, with search + filters
//   #/?min=50          the list with a filter preset (used for screenshots)
//   #/deal/<id>        one deal, with its verdict and evidence
//
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { deals, CATEGORIES, STORES, CHECKED_AT } from "./data.js";
import {
  percentOff,
  saved,
  byBest,
  byDiscount,
  byPriceLow,
  byPriceHigh,
  bySavings,
} from "./verdict.js";
import { cards, listPage, dealPage, missingPage } from "./views.js";

const app = document.getElementById("app");

const state = {
  q: "",
  category: "All",
  store: "All",
  minOff: 0,
  sort: "best",
  newLowsOnly: false,
};

function readHashPreset() {
  const hash = location.hash;
  const query = hash.split("?")[1] || "";
  const params = new URLSearchParams(query);
  if (params.has("min")) state.minOff = Number(params.get("min")) || 0;
  if (params.has("cat")) state.category = params.get("cat");
  if (params.has("store")) state.store = params.get("store");
  if (params.has("newlows")) state.newLowsOnly = params.get("newlows") === "1";
  if (params.has("q")) state.q = params.get("q");
  if (params.has("sort")) state.sort = params.get("sort");
}

function applyFilters() {
  const q = state.q.trim().toLowerCase();
  let list = deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (percentOff(d) < state.minOff) return false;
    if (state.newLowsOnly && d.verdict !== "new-low") return false;
    if (
      q &&
      !`${d.title} ${d.store} ${d.category} ${d.note}`.toLowerCase().includes(q)
    )
      return false;
    return true;
  });
  const sorts = {
    best: byBest,
    discount: byDiscount,
    savings: bySavings,
    low: byPriceLow,
    high: byPriceHigh,
  };
  list = [...list].sort(sorts[state.sort] || byBest);
  return list;
}

function stats() {
  return {
    total: deals.length,
    newLows: deals.filter((d) => d.verdict === "new-low").length,
    totalSaved: Math.round(deals.reduce((s, d) => s + saved(d), 0)),
    stores: STORES.length,
    categories: CATEGORIES.length,
  };
}

function renderResults() {
  const list = applyFilters();
  const results = document.getElementById("results");
  const count = document.getElementById("count");
  if (!results) return;
  results.innerHTML = cards(list);
  const sortNames = {
    best: "best deals first",
    discount: "biggest discount first",
    savings: "biggest saving first",
    low: "lowest price first",
    high: "highest price first",
  };
  count.textContent = `Showing ${list.length} of ${deals.length} deals — sorted ${sortNames[state.sort] || "best deals first"}. All prices checked ${new Date(CHECKED_AT).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: false, timeZone: "UTC" })} UTC.`;
}

function wireControls() {
  const q = document.getElementById("q");
  const cat = document.getElementById("cat");
  const store = document.getElementById("store");
  const minoff = document.getElementById("minoff");
  const sort = document.getElementById("sort");
  const newlows = document.getElementById("newlows");
  if (!q) return;
  q.addEventListener("input", () => {
    state.q = q.value;
    renderResults();
  });
  cat.addEventListener("change", () => {
    state.category = cat.value;
    renderResults();
  });
  store.addEventListener("change", () => {
    state.store = store.value;
    renderResults();
  });
  minoff.addEventListener("change", () => {
    state.minOff = Number(minoff.value);
    renderResults();
  });
  sort.addEventListener("change", () => {
    state.sort = sort.value;
    renderResults();
  });
  newlows.addEventListener("change", () => {
    state.newLowsOnly = newlows.checked;
    renderResults();
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | FridayFinder`;
    app.innerHTML = found
      ? dealPage(
          found,
          deals.filter((d) => d.category === found.category),
        )
      : missingPage();
  } else {
    readHashPreset();
    document.title = "FridayFinder — Real Black Friday deals, checked today";
    app.innerHTML = listPage(stats(), CATEGORIES, STORES, state);
    wireControls();
    renderResults();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
