const fs = require("fs");
let h = fs.readFileSync("template.html", "utf8");
h = h.replace("__LOGO__", fs.readFileSync("logo.txt", "utf8").trim()).replace("__MARK__", fs.readFileSync("mark.txt", "utf8").trim())
     .replace("__PHOTOS__", JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync("img/map.json","utf8"))).map(([n,f]) => [n.toLowerCase().replace(/\s+/g," ").trim(), f])))).replace("__PHOTO_SRC__", JSON.stringify(Object.fromEntries([...new Set(Object.values(JSON.parse(fs.readFileSync("img/map.json","utf8"))))].map(f => [f, "data:image/webp;base64," + fs.readFileSync(f).toString("base64")]))))
     .replace("__NOTES__", (process.env.NOTES_PREVIEW || fs.existsSync("notes.approved")) ? fs.readFileSync("notes.json", "utf8").replace(/</g, "\\u003c") : "{}")
     .replace("__STOCK__", fs.readFileSync("stock.json", "utf8").replace(/</g, "\\u003c"));
fs.writeFileSync("rushup-order.html", h); console.log(h.length, "bytes");
