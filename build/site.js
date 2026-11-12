// Standalone website copy of the customer page (for Netlify / GitHub Pages / any static host).
const fs = require("fs");
const body = fs.readFileSync("rushup-order.html", "utf8").replace(/<title>[^<]*<\/title>/, "");
const head = `<!doctype html><html lang="lo"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="ສັ່ງນ້ຳຫອມແທ້ແບ່ງຂາຍ Rush Up Perfume · ຈ່າຍຜ່ານ BCEL One QR">
<meta property="og:title" content="Rush Up Perfume · ສັ່ງນ້ຳຫອມ">
<meta property="og:description" content="ນ້ຳຫອມແທ້ ແບ່ງຂາຍ 2 · 5 · 10 · 20 ml · ເລືອກກິ່ນ ສະແກນຈ່າຍ ສົ່ງສະລິບທາງ WhatsApp">
<meta name="theme-color" content="#07080a">
<title>Rush Up Perfume · ນ້ຳຫອມແທ້ແບ່ງຂາຍ 2 · 5 · 10 · 20 ml</title>
<link rel="canonical" href="https://www.rushupperfume.com/">
<meta property="og:url" content="https://www.rushupperfume.com/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Rush Up Perfume">
<meta property="og:image" content="https://www.rushupperfume.com/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/icon.png">
<link rel="apple-touch-icon" href="/icon.png">
<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "39a723205f7a4a7bb867184a7ea4d022"}'></script><!-- End Cloudflare Web Analytics -->
<style>:root{box-sizing:border-box}body{margin:0;background:#07080a}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>`;
fs.mkdirSync("site", { recursive: true });
fs.writeFileSync("site/index.html", head + body + "</body></html>");
console.log("site/index.html", fs.statSync("site/index.html").size);
