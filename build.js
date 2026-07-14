#!/usr/bin/env node
/**
 * 꿈해몽 정적 페이지 생성기
 * 사용법: node build.js  →  dist/{한글슬러그}/index.html × 78 + sitemap + robots + 앱 본체
 * 데이터: ./index.html의 `const DREAMS = [...]` 자동 추출
 */
const fs = require("fs");
const path = require("path");

/* ── 설정 ── */
const SITE = "https://kkum.onlyonecorpceo.workers.dev";   // ⚠️ 실제 배포 URL로 수정
const GA_ID = "G-ECXMNH1D3N";                              // ⚠️ index.html과 동일 GA ID로 수정
const HUB = "https://main.onlyonecorpceo.workers.dev";
const EMAIL = "onlyonecorpceo@gmail.com";
const COUPANG_URL = "https://link.coupang.com/a/fmTQyDVw28";    // ⚠️ 쿠팡 딥링크 (꿈해몽 책 등)
const AMAZON_URL = "https://www.amazon.com/s?k=dream+interpretation+book&tag=onlyone0c-20";
const INDEX = path.join(__dirname, "index.html");

/* ── index.html에서 DREAMS 추출 ── */
const src = fs.readFileSync(INDEX, "utf8");
const m = src.match(/const DREAMS = (\[[\s\S]*?\n\]);/);
if (!m) { console.error("❌ index.html에서 DREAMS 블록을 찾지 못했습니다."); process.exit(1); }
const DREAMS = eval("(" + m[1] + ")");

const CATS = { animal:{ko:"동물",en:"Animals"}, body:{ko:"신체",en:"Body"}, people:{ko:"사람",en:"People"}, nature:{ko:"자연",en:"Nature"}, money:{ko:"돈·사물",en:"Money & Objects"}, situation:{ko:"상황",en:"Situations"} };
const V = {
  good:{ko:"길몽이에요",en:"An auspicious dream",badge:"✨ 길몽",badgeEn:"✨ Auspicious",cls:"v-good"},
  bad:{ko:"흉몽으로 봐요 — 하지만 경고는 선물이죠",en:"Read as a caution — but warnings are gifts",badge:"🌫️ 흉몽 주의",badgeEn:"🌫️ Caution",cls:"v-bad"},
  mixed:{ko:"상황에 따라 달라요",en:"It depends on the details",badge:"🌗 상황 따라",badgeEn:"🌗 It depends",cls:"v-mixed"}
};
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");

/* ── 페이지 템플릿 ── */
function pageHtml(d) {
  const v = V[d.v];
  const cat = CATS[d.g];
  const titleKo = `${d.ko} 해몽 — 길몽일까 흉몽일까?`;
  const desc = `${d.ko} 꿈의 의미: ${d.s[0]}`;

  const varsHtml = d.c.map(c => `<div class="var">
    <div class="vk"><span data-ko>${esc(c.k[0])}</span><span data-en class="hidden">${esc(c.k[1])}</span></div>
    <div class="vm"><span data-ko>${esc(c.m[0])}</span><span data-en class="hidden">${esc(c.m[1])}</span></div>
  </div>`).join("");

  const related = DREAMS.filter(x => x.g === d.g && x.id !== d.id).slice(0, 8);
  const relHtml = related.map(r =>
    `<a href="/${encodeURIComponent(r.id)}/">${r.e} <span data-ko>${r.ko}</span><span data-en class="hidden">${esc(r.en)}</span></a>`).join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titleKo)} | 꿈해몽 사전</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}/${encodeURIComponent(d.id)}/">
<meta property="og:title" content="${esc(titleKo)} | 꿈해몽 사전">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}/${encodeURIComponent(d.id)}/">
<meta property="og:type" content="article">
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});</script>
<style>
:root{--bg:#FAFAF8;--ink:#3D4248;--accent:#B5342E;--line:#E8E6E1;--dim:#8A8F94;--card:#fff;
--good:#7A5AC2;--bad:#5A6B7A;--mixed:#C77E00;--goodbg:#F1EDFA;--badbg:#EDF1F4;--mixedbg:#FBF3E4}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Pretendard Variable',Pretendard,-apple-system,sans-serif;background:var(--bg);color:var(--ink);line-height:1.75;-webkit-font-smoothing:antialiased}
.wrap{max-width:640px;margin:0 auto;padding:24px 20px 60px}
header{display:flex;justify-content:space-between;align-items:center;padding:8px 0 28px}
.logo{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--ink);font-weight:700;font-size:15px}
.lang-btn{border:1px solid var(--line);background:var(--card);border-radius:99px;padding:6px 14px;font-size:13px;cursor:pointer;color:var(--ink);font-family:inherit}
.crumb{font-size:13px;color:var(--dim);margin-bottom:10px}
.crumb a{color:var(--dim);text-decoration:none}
h1{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.35;margin-bottom:16px}
.verdict{border-radius:20px;padding:22px 24px;margin-bottom:24px;border:1px solid var(--line)}
.v-good{background:var(--goodbg)}.v-bad{background:var(--badbg)}.v-mixed{background:var(--mixedbg)}
.verdict .vb{font-size:14px;font-weight:800;margin-bottom:6px}
.v-good .vb{color:var(--good)}.v-bad .vb{color:var(--bad)}.v-mixed .vb{color:var(--mixed)}
.verdict .vs{font-size:15px}
h2{font-size:19px;font-weight:700;margin:30px 0 10px;letter-spacing:-.01em}
p{font-size:15px;margin-bottom:14px}
.var{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:10px}
.var .vk{font-weight:700;font-size:15px;margin-bottom:4px}
.var .vm{font-size:14px;color:#5A6066}
.psy{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--ink);border-radius:12px;padding:16px 18px;font-size:14px}
.psy .pl{font-weight:700;font-size:13px;color:var(--dim);margin-bottom:4px}
.rels{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.rels a{border:1px solid var(--line);background:var(--card);border-radius:99px;padding:8px 14px;font-size:14px;text-decoration:none;color:var(--ink)}
.cta{display:block;text-align:center;background:var(--ink);color:#fff;text-decoration:none;border-radius:14px;padding:16px;font-weight:700;font-size:16px;margin:30px 0 10px;transition:opacity .15s}
.cta:hover{opacity:.85}
.cta-sub{text-align:center;font-size:13px;color:var(--dim)}
.shop{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-top:26px;font-size:14px}
.shop a{display:inline-block;margin-top:8px;border:1px solid var(--line);border-radius:99px;padding:7px 16px;font-size:13px;text-decoration:none;color:var(--ink);font-weight:600}
.note{font-size:12px;color:var(--dim);margin-top:26px;line-height:1.7}
footer{margin-top:44px;padding-top:24px;border-top:1px solid var(--line);font-size:12px;color:#A0A4A8;text-align:center;line-height:2}
footer a{color:#A0A4A8}
.disc{font-size:11px;color:#B6B6BB;margin-top:8px}
.hidden{display:none}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <a class="logo" href="${HUB}" aria-label="OnlyOne">
      <svg width="20" height="26" viewBox="0 0 20 26" fill="none"><circle cx="10" cy="8" r="6.5" stroke="#3D4248" stroke-width="3"/><rect x="8.5" y="14" width="3" height="10" rx="1.5" fill="#3D4248"/></svg>
      OnlyOne
    </a>
    <button class="lang-btn" onclick="toggleLang()"><span data-ko>EN</span><span data-en class="hidden">한국어</span></button>
  </header>

  <article>
    <div class="crumb">🌙 <a href="${SITE}/"><span data-ko>꿈해몽 사전</span><span data-en class="hidden">Dream Dictionary</span></a> · <span data-ko>${cat.ko}</span><span data-en class="hidden">${cat.en}</span></div>
    <h1>${d.e} <span data-ko>${esc(d.ko)}, 무슨 의미일까?</span><span data-en class="hidden">Dreaming of ${esc(d.en.toLowerCase())} — what does it mean?</span></h1>

    <div class="verdict ${v.cls}">
      <div class="vb"><span data-ko>${v.badge} · ${v.ko}</span><span data-en class="hidden">${v.badgeEn} · ${v.en}</span></div>
      <div class="vs"><span data-ko>${esc(d.s[0])}</span><span data-en class="hidden">${esc(d.s[1])}</span></div>
    </div>

    <h2><span data-ko>📜 전통 해몽</span><span data-en class="hidden">📜 Traditional reading</span></h2>
    <p><span data-ko>${esc(d.t[0])}</span><span data-en class="hidden">${esc(d.t[1])}</span></p>

    <h2><span data-ko>🔀 이런 꿈이었다면?</span><span data-en class="hidden">🔀 Was your dream like this?</span></h2>
    ${varsHtml}

    <h2><span data-ko>🧠 심리학에서는</span><span data-en class="hidden">🧠 The psychological view</span></h2>
    <div class="psy">
      <span data-ko>${esc(d.p[0])}</span><span data-en class="hidden">${esc(d.p[1])}</span>
    </div>

    <a class="cta" href="${SITE}/?utm_source=seo&utm_medium=static&utm_campaign=${encodeURIComponent(d.id)}">
      <span data-ko>🌙 다른 꿈도 3초 검색</span><span data-en class="hidden">🌙 Look up another dream</span>
    </a>
    <p class="cta-sub"><span data-ko>꿈 상징 ${DREAMS.length}가지 · 길몽/흉몽 판정 · 오늘의 꿈 랜덤 열기</span><span data-en class="hidden">${DREAMS.length} dream symbols · verdicts · random dream button</span></p>

    <h2><span data-ko>${cat.ko} 꿈 더 보기</span><span data-en class="hidden">More ${cat.en.toLowerCase()} dreams</span></h2>
    <div class="rels">${relHtml}</div>

    <div class="shop">
      <span data-ko>📖 꿈이 자주 기억난다면, 머리맡에 꿈 일기장이나 해몽 책 한 권 어때요?</span><span data-en class="hidden">📖 Dreaming vividly? A dream journal by the bed goes a long way.</span><br>
      <a data-ko href="${COUPANG_URL}" target="_blank" rel="noopener sponsored">쿠팡에서 꿈해몽 책·꿈 일기장 보기</a>
      <a data-en class="hidden" href="${AMAZON_URL}" target="_blank" rel="noopener sponsored">Dream books on Amazon</a>
    </div>

    <p class="note"><span data-ko>※ 해몽은 전통 민속과 심리학적 관점을 정리한 재미·참고용 콘텐츠예요. 꿈보다 오늘 하루가 더 중요합니다 🙂</span><span data-en class="hidden">※ Interpretations blend folklore and psychology, offered for fun and reflection. Your waking day matters more 🙂</span></p>
  </article>

  <footer>
    <a href="${HUB}">OnlyOne — For a Happy Day</a><br>
    Contact: <a href="mailto:${EMAIL}">${EMAIL}</a>
    <div class="disc"><span data-ko>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</span><span data-en class="hidden">As an Amazon Associate, OnlyOne earns from qualifying purchases.</span></div>
  </footer>
</div>

<div id="consent" style="display:none;position:fixed;bottom:16px;left:16px;right:16px;max-width:480px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:16px;padding:18px 20px;box-shadow:0 8px 30px rgba(0,0,0,.08);font-size:13px;z-index:99">
  <p style="margin-bottom:12px;font-size:13px"><span data-ko>방문 통계를 위해 Google Analytics 쿠키를 사용해도 될까요? 거부해도 그대로 이용할 수 있어요.</span><span data-en class="hidden">May we use Google Analytics cookies for visit stats? You can decline and still use everything.</span></p>
  <div style="display:flex;gap:8px;justify-content:flex-end">
    <button onclick="consent(false)" style="border:1px solid var(--line);background:#fff;border-radius:99px;padding:8px 16px;cursor:pointer;font-family:inherit;font-size:13px;color:var(--ink)"><span data-ko>거부</span><span data-en class="hidden">Decline</span></button>
    <button onclick="consent(true)" style="border:none;background:var(--ink);color:#fff;border-radius:99px;padding:8px 18px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600"><span data-ko>동의</span><span data-en class="hidden">Accept</span></button>
  </div>
</div>

<script>
function applyLang(l){
  document.querySelectorAll('[data-ko]').forEach(e=>e.classList.toggle('hidden',l==='en'));
  document.querySelectorAll('[data-en]').forEach(e=>e.classList.toggle('hidden',l!=='en'));
  document.documentElement.lang=l==='en'?'en':'ko';
}
function toggleLang(){
  const l=(localStorage.getItem('oo_lang')==='en')?'ko':'en';
  localStorage.setItem('oo_lang',l);applyLang(l);
}
applyLang(localStorage.getItem('oo_lang')||(navigator.language.startsWith('ko')?'ko':'en'));

const EEA=['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'];
function grant(){gtag('consent','update',{analytics_storage:'granted'})}
function consent(ok){
  localStorage.setItem('oo_consent',ok?'granted':'denied');
  if(ok)grant();
  document.getElementById('consent').style.display='none';
}
(function(){
  const saved=localStorage.getItem('oo_consent');
  if(saved==='granted'){grant();return}
  if(saved==='denied')return;
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
  const isEU=/Europe\\//.test(tz)||EEA.includes((navigator.language.split('-')[1]||'').toUpperCase());
  if(isEU){document.getElementById('consent').style.display='block'}
  else{localStorage.setItem('oo_consent','granted');grant()}
})();
</script>
</body>
</html>`;
}

/* ── 빌드 ── */
const DIST = path.join(__dirname, "dist");
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const urls = [];
for (const d of DREAMS) {
  const dir = path.join(DIST, d.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(d));
  urls.push(`${SITE}/${encodeURIComponent(d.id)}/`);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[SITE + "/", ...urls].map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>`);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.copyFileSync(INDEX, path.join(DIST, "index.html"));

console.log(`✅ ${DREAMS.length}개 페이지 + sitemap.xml + robots.txt + 앱 본체 → dist/`);
