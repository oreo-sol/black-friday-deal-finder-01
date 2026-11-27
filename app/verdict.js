// Verdict math for FridayFinder: every number on the site comes from these helpers,
// so a card, a detail page and the stats strip can never disagree.
//
//   percentOff(d)  — whole-percent discount from sale vs usual price
//   saved(d)       — dollars saved, rounded to cents
//   verdictLabel   — the badge text for a deal's verdict
//   verdictRank    — sort order: a new low beats a strong deal beats a routine one
//   dealScore      — one number for "best deals first": verdict first, then % off

export function percentOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function saved(d) {
  return Math.round((d.was - d.price) * 100) / 100;
}

export function verdictLabel(v) {
  if (v === "new-low") return "NEW LOW";
  if (v === "strong") return "STRONG DEAL";
  return "ROUTINE DEAL";
}

export function verdictRank(v) {
  if (v === "new-low") return 0;
  if (v === "strong") return 1;
  return 2;
}

// Best first: verdict rank, then bigger discount, then bigger dollar saving.
export function dealScore(d) {
  return verdictRank(d.verdict) * 10000 - percentOff(d) * 100 - saved(d);
}

export function byBest(a, b) {
  return dealScore(a) - dealScore(b);
}

export function byDiscount(a, b) {
  return percentOff(b) - percentOff(a) || saved(b) - saved(a);
}

export function byPriceLow(a, b) {
  return a.price - b.price;
}

export function byPriceHigh(a, b) {
  return b.price - a.price;
}

export function bySavings(a, b) {
  return saved(b) - saved(a);
}
