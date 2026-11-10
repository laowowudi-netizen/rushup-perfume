// Build the customer-safe stock snapshot from exported bottles JSON (same rules as the stock app's priceRows).
// Only name, ml left and size prices leave this script: no cost, profit or bottle cost.
const fs = require("fs"), path = require("path");
const dir = process.argv[2], out = process.argv[3];
const DEFAULT_SIZES = [{ ml: 2, price: 0 }, { ml: 5, price: 0 }, { ml: 10, price: 0 }];
const MAX_PER_ML = 150000; // a size priced above this per ml is a data-entry slip; never show it to customers
const bottles = fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => JSON.parse(fs.readFileSync(path.join(dir, f))));
const mlLeft = b => Math.max(0, (+b.mlIn || 0) - (+b.mlOut || 0) + (+b.mlAdj || 0));
const sizesOf = b => (b.sizes?.length ? b.sizes : DEFAULT_SIZES);
const sizePrice = (b, s) => +s.price || Math.round((+s.ml || 0) * (+b.pricePerMl || 0));
const norm = n => String(n || "").toLowerCase().replace(/\s+/g, " ").trim();
// Same scent typed two ways in the stock app: show it once to customers (left side -> right side).
const ALIASES = { "lattfa khamrah": "lattafa khamrah" };
const key = n => ALIASES[norm(n)] || norm(n);
// Scents the owner asked to keep off the customer page for now (e.g. stock not arrived yet).
const HIDDEN = new Set([]);
const m = new Map();
for (const b of bottles.filter(b => mlLeft(b) > 0 && !HIDDEN.has(key(b.name)))) {
  const k = key(b.name), cur = m.get(k);
  if (!cur) m.set(k, { b, left: mlLeft(b), name: b.name });
  else { cur.left += mlLeft(b); if (mlLeft(b) > mlLeft(cur.b)) cur.b = b; }
  if (norm(b.name) === k) m.get(k).name = b.name; // display the correctly spelled name
}
// Brand for the customer page's brand filter (names in the stock app are free text).
const BRANDS = [[/^jpg\b|gaultier/i, "JPG"], [/\bysl\b|saint laurent/i, "YSL"], [/dior/i, "Dior"], [/armani|si passione/i, "Armani"],
  [/^amaf|armaf/i, "Armaf"], [/latt?a?fa/i, "Lattafa"], [/versace/i, "Versace"], [/le labo/i, "Le Labo"], [/issey/i, "Issey Miyake"],
  [/acqua di parma/i, "Acqua di Parma"], [/ex nihilo/i, "Ex Nihilo"], [/kilian/i, "Kilian"], [/^lv\b|vuitton/i, "Louis Vuitton"],
  [/mancera/i, "Mancera"], [/marwa|arabiyat/i, "Arabiyat"], [/^mfk\b|kurkdjian/i, "MFK"], [/montblanc/i, "Montblanc"],
  [/^pdm\b|de marly/i, "Parfums de Marly"], [/^ck\b|calvin klein/i, "Calvin Klein"], [/^bdk\b/i, "BDK"]];
const brandOf = n => (BRANDS.find(([re]) => re.test(n)) || [, String(n).trim().split(/\s+/)[0]])[1];
const skipped = [];
const rows = [...m.values()].map(({ b, left, name }) => {
  const sizes = sizesOf(b).filter(s => +s.ml > 0 && +s.ml <= left).map(s => ({ ml: +s.ml, price: sizePrice(b, s) }))
    .filter(s => { const ok = s.price > 0 && s.price / s.ml <= MAX_PER_ML; if (!ok && s.price > 0) skipped.push(`${b.name} ${s.ml}ml ${s.price}`); return ok; });
  return { name: String(name).trim(), brand: brandOf(String(name)), left: Math.round(left * 10) / 10, sizes };
}).filter(r => r.sizes.length).sort((a, b) => a.name.localeCompare(b.name));
// Keep the previous timestamp when nothing a customer sees changed, so open carts are not reset and no empty update is published.
let at = new Date().toISOString();
try { const prev = JSON.parse(fs.readFileSync(out, "utf8")); if (JSON.stringify(prev.items) === JSON.stringify(rows)) at = prev.at; } catch (e) {}
fs.writeFileSync(out, JSON.stringify({ at, items: rows }));
console.log(rows.length, "scents"); rows.forEach(r => console.log(`[${r.brand}]`, r.name, r.left, r.sizes.map(s => s.ml + ":" + s.price).join(" ")));
// flag other near-duplicate names (one letter apart) so they can be added to ALIASES
const ed = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] !== b[j-1]));
  return d[a.length][b.length]; };
const ks = [...m.keys()]; for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) if (ed(ks[i], ks[j]) <= 2) console.log("NEAR-DUPLICATE?", ks[i], "|", ks[j]);
if (skipped.length) console.log("SKIPPED (price looks wrong):", skipped);
