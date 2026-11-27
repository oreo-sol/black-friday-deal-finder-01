// HTML for FridayFinder's pages, built from the deal data. Every value is escaped
// before it goes into the page, and every price on a card is computed by verdict.js,
// so the discount a shopper sees always matches the two prices beside it.

import { percentOff, saved, verdictLabel } from "./verdict.js";

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });
const checkedAt = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }) + " UTC";

// One deal as a card on the list. Everything a shopper needs to judge it is on the
// card: product, store, both prices, the discount, the verdict badge, when it was
// checked and where the price was read — plus the link out to the store.
export function card(d) {
  return `<article class="card verdict-${d.verdict}">
  <div class="card-top"><span class="badge">${verdictLabel(d.verdict)}</span><span class="off">${percentOff(d)}% off</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="meta">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="save">save ${usd(saved(d))}</span></p>
  <p class="note">${escape(d.note)}</p>
  <p class="checked">Checked ${checkedAt(d.checked)} &middot; via ${escape(d.source)}</p>
  <p class="actions"><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &nearr;</a>
  <a class="details" href="#/deal/${encodeURIComponent(d.id)}">Details</a></p>
</article>`;
}

export function cards(list) {
  if (list.length === 0)
    return '<p class="empty">No deal matches those filters. Loosen the discount or clear the search.</p>';
  return `<div class="grid">${list.map(card).join("")}</div>`;
}

// The list page: header stats, the search and filter controls, then the cards.
// The controls are real form elements; main.js wires them to re-render the grid.
export function listPage(stats, categories, stores, state) {
  const catOptions = ["All", ...categories]
    .map(
      (c) =>
        `<option value="${escape(c)}"${state.category === c ? " selected" : ""}>${escape(c)}</option>`,
    )
    .join("");
  const storeOptions = ["All", ...stores]
    .map(
      (s) =>
        `<option value="${escape(s)}"${state.store === s ? " selected" : ""}>${escape(s)}</option>`,
    )
    .join("");
  return `<section class="hero">
  <h1>Real Black Friday deals, checked today.</h1>
  <p class="lede">Every price below was read at the store or in a deals source that names the store, on Friday 27 November 2026. The badge on each deal says honestly whether it is really a deal — a new low, a strong cut, or just a routine sale.</p>
  <ul class="stats">
    <li><strong>${stats.total}</strong> deals checked</li>
    <li><strong>${stats.newLows}</strong> new lows</li>
    <li><strong>${usd(stats.totalSaved)}</strong> total savings</li>
    <li><strong>${stats.stores}</strong> stores</li>
    <li><strong>${stats.categories}</strong> categories</li>
  </ul>
</section>
<section class="controls" aria-label="Search and filter deals">
  <label class="search">Search <input id="q" type="search" placeholder="Try &ldquo;AirPods&rdquo;, &ldquo;OLED&rdquo;, &ldquo;LEGO&rdquo;&hellip;" value="${escape(state.q)}"></label>
  <label>Category <select id="cat">${catOptions}</select></label>
  <label>Store <select id="store">${storeOptions}</select></label>
  <label>Discount <select id="minoff">
    <option value="0"${state.minOff === 0 ? " selected" : ""}>Any discount</option>
    <option value="25"${state.minOff === 25 ? " selected" : ""}>25% off or more</option>
    <option value="40"${state.minOff === 40 ? " selected" : ""}>40% off or more</option>
    <option value="50"${state.minOff === 50 ? " selected" : ""}>50% off or more</option>
  </select></label>
  <label>Sort <select id="sort">
    <option value="best"${state.sort === "best" ? " selected" : ""}>Best deals first</option>
    <option value="discount"${state.sort === "discount" ? " selected" : ""}>Biggest discount</option>
    <option value="savings"${state.sort === "savings" ? " selected" : ""}>Biggest saving ($)</option>
    <option value="low"${state.sort === "low" ? " selected" : ""}>Lowest price</option>
    <option value="high"${state.sort === "high" ? " selected" : ""}>Highest price</option>
  </select></label>
  <label class="check"><input id="newlows" type="checkbox"${state.newLowsOnly ? " checked" : ""}> New lows only</label>
</section>
<p class="count" id="count"></p>
<div id="results"></div>
<section class="method">
  <h2>How a deal earns its badge</h2>
  <p><span class="badge">NEW LOW</span> — a deals source calls this the lowest price ever tracked for the product.</p>
  <p><span class="badge strong">STRONG DEAL</span> — 25% or more off, or $150 or more saved. A genuine Black Friday cut.</p>
  <p><span class="badge routine">ROUTINE DEAL</span> — a real discount, but a small one. Worth it only if you already want the product.</p>
  <p>Usual price is the store's list price the source quoted. Prices move fast on Black Friday — always check the store page before you buy. All prices in US dollars, checked 27 Nov 2026, 06:30 UTC.</p>
</section>`;
}

// One deal on its own page: the full facts, the verdict with its evidence, the
// source, and the store link — plus the other deals in its category.
export function dealPage(d, related) {
  const others = related
    .filter((x) => x.id !== d.id)
    .slice(0, 3)
    .map(
      (x) =>
        `<li><a href="#/deal/${encodeURIComponent(x.id)}">${escape(x.title)}</a> — ${escape(x.store)}, ${usd(x.price)} <s>${usd(x.was)}</s> (${percentOff(x)}% off)</li>`,
    )
    .join("");
  return `<p class="back"><a href="#/">&larr; All ${escape(d.category)} deals</a></p>
<article class="detail verdict-${d.verdict}">
  <p><span class="badge big">${verdictLabel(d.verdict)}</span> <span class="off big">${percentOff(d)}% off</span></p>
  <h1>${escape(d.title)}</h1>
  <p class="meta">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s></p>
  <p class="save-line">You save ${usd(saved(d))} (${percentOff(d)}% off the usual price).</p>
  <p class="note big">${escape(d.note)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Sale price</dt><dd>${usd(d.price)}</dd>
    <dt>Usual price</dt><dd>${usd(d.was)}</dd>
    <dt>Discount</dt><dd>${percentOff(d)}% off — ${usd(saved(d))} saved</dd>
    <dt>Price checked</dt><dd>${checkedAt(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="btn big" href="${escape(d.url)}" target="_blank" rel="noopener">Buy it at ${escape(d.store)} &nearr;</a></p>
  <p class="fine">Link opens the store's own search for this product. Price may have moved since it was checked — the store page is the final word.</p>
</article>
${others ? `<section class="related"><h2>More ${escape(d.category)} deals</h2><ul>${others}</ul></section>` : ""}`;
}

export function missingPage() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
