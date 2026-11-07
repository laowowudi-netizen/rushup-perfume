// Renders the link-preview image (og.png, 1200x630) and printable website QR cards with Playwright.
const { chromium } = require("playwright"); const fs = require("fs");
const logo = fs.readFileSync("logo.txt", "utf8").trim(), qrlib = fs.readFileSync("node_modules/qrcode-generator/qrcode.js", "utf8");
const out = process.argv[2];
const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Noto+Sans+Lao:wght@500;700&display=swap">`;
const BG = `background:#08090b; background-image: radial-gradient(80% 55% at 50% 0%, rgb(255 255 255/.08), transparent 70%),
  radial-gradient(140% 100% at 50% 40%, transparent 55%, rgb(0 0 0/.6) 100%),
  repeating-linear-gradient(135deg, rgb(255 255 255/.03) 0 1px, transparent 1px 6px), linear-gradient(180deg,#101215,#050607);`;
const bar = (x, y, w, o) => `<i style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:9px;background:#19e3ec;opacity:${o};transform:skewX(-24deg)"></i>`;
const og = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;${BG};color:#f4f6f8;font-family:"Noto Sans Lao",sans-serif;position:relative;overflow:hidden;display:grid;grid-template-columns:400px 1fr;align-items:center;padding:0 80px;gap:40px}
img{width:390px;} h1{font-family:"Chakra Petch","Noto Sans Lao";font-size:54px;line-height:1.2;white-space:nowrap} .c{color:#19e3ec}
.sz{font-family:"Chakra Petch";font-weight:700;font-size:44px;margin-top:10px;letter-spacing:.01em} p b{color:#fff}
p{font-size:28px;color:#c9d1d9;margin-top:26px;white-space:nowrap}
.sz::after{content:"";display:block;width:90px;height:7px;background:#19e3ec;transform:skewX(-24deg);margin-top:20px} .u{margin-top:14px;font-family:"Chakra Petch","Noto Sans Lao";font-size:32px;font-weight:700;color:#19e3ec;letter-spacing:.02em}
</style></head><body>

<img src="${logo}"><div><h1>ນ້ຳຫອມແບ່ງຂາຍແທ້ <span class="c">100%</span></h1><div class="sz">2, 5, 10, 20, 30 ml</div>
<p>ສາມາດສອບຖາມ WhatsApp <b>020 55899555</b></p><div class="u">ຫຼື www.rushupperfume.com</div></div></body></html>`;
const qrSvg = `function svg(t){const q=qrcode(0,"H");q.addData(t);q.make();const n=q.getModuleCount(),m=4,s=n+2*m;let d="";for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+="M"+(c+m)+" "+(r+m)+"h1v1h-1z";return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+s+' '+s+'" shape-rendering="crispEdges"><rect width="'+s+'" height="'+s+'" fill="#fff"/><path d="'+d+'" fill="#000"/></svg>'}`;
const URL = "https://www.rushupperfume.com";
const card = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<script>${qrlib}</script><script>${qrSvg}</script><style>*{margin:0;box-sizing:border-box}
body{width:1000px;height:1400px;${BG};color:#f4f6f8;font-family:"Noto Sans Lao",sans-serif;display:grid;justify-items:center;align-content:center;gap:34px;text-align:center;position:relative;overflow:hidden}
.logo{width:420px;} .q{width:640px;height:640px;background:#fff;border-radius:36px;padding:26px;position:relative;box-shadow:0 0 0 6px #19e3ec}
.q svg{width:100%;height:100%;display:block} .q .m{position:absolute;inset:0;margin:auto;width:150px;height:150px;background:#07080a;border-radius:22px;display:grid;place-items:center}
.q .m img{width:120px} h2{font-size:54px;font-weight:700} .u{font-family:"Chakra Petch";font-size:44px;font-weight:700;color:#19e3ec}</style></head><body>

<img class="logo" src="${logo}"><div class="q"><div id="s"></div><div class="m"><img src="${logo}"></div></div>
<h2>ສະແກນເພື່ອສັ່ງນ້ຳຫອມ</h2><div class="u">www.rushupperfume.com</div>
<script>document.getElementById("s").outerHTML=svg("${URL}")</script></body></html>`;
const plain = `<!doctype html><html><head><script>${qrlib}</script><script>${qrSvg}</script><style>*{margin:0}body{width:1200px;height:1200px;background:#fff}svg{width:1200px;height:1200px;display:block}</style></head><body><script>document.write(svg("${URL}"))</script></body></html>`;
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const b = await chromium.launch({ proxy }); const p = await b.newPage({ deviceScaleFactor: 1 });
  for (const [html, w, h, f] of [[og, 1200, 630, "og.png"], [card, 1000, 1400, "rushup-qr-card.png"], [plain, 1200, 1200, "rushup-qr.png"]]) {
    await p.setViewportSize({ width: w, height: h }); await p.setContent(html, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: out + "/" + f }); console.log("wrote", f);
  }
  await b.close();
})();
