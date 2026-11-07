# Rush Up Perfume website

Customer ordering page for the Rush Up Perfume decant shop (Laos). Lao text, prices in Kip.
Live at https://www.rushupperfume.com (GitHub Pages from `main`, root). Also mirrored as a claude.ai artifact:
https://claude.ai/artifact/PbHij2JeYE7rmSAP9pHySV

## Data source
The stock app is a claude.ai artifact: https://claude.ai/artifact/DkkcMnv1MU1gP7XGz1BgQw
Read its `bottles` collection with the ArtifactData tool. Do NOT change, republish or write to the stock app.
Bottle docs contain cost, profit and bottleCost: never commit them or show them to customers.
`build/snapshot.js` keeps only name, brand, ml left and sale prices.

## Updating stock and prices ("Update")
1. ArtifactData `list` on the stock app, collection `bottles`, `query.limit` 1000, `out_dir` = `build/data` (gitignored).
2. `build/update.sh build/data/bottles`
3. Look at the snapshot output: report scents added/removed, price changes, any `SKIPPED` (price looks wrong) and `NEAR-DUPLICATE?` lines.
4. If `index.html` changed: commit and push to `main`. If nothing changed, do not commit.
5. Delete `build/data` afterwards.

## Rules kept in build/snapshot.js
- `HIDDEN`: scents the owner asked to keep off the page (currently YSL Y EDP, until new stock arrives).
- `ALIASES`: two spellings of one scent shown once (Lattfa Khamrah -> Lattafa Khamrah).
- `BRANDS`: brand chips. `MAX_PER_ML`: hides sizes whose price looks like a typo.
- Photos: `build/img/map.json` (scent name -> webp). Notes: `build/notes.json` (shown because `build/notes.approved` exists).

## Order message
The WhatsApp order text is built in `orderText()` in `build/template.html`; the stock app's "วางออเดอร์" paste parser reads it, so keep the item line format `N. name Xml × Q = price ກີບ` and the `ລວມທັງໝົດ:`, `ຊື່:`, `ເບີໂທ:` lines.
