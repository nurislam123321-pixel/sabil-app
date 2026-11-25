// Sabil: работа без интернета. Файл создаётся tool/web/make_sw.py (список файлов и их отпечатки — ниже).
// Каждый файл хранится по отпечатку содержимого: при обновлении скачиваются только изменившиеся файлы,
// а старая и новая версии никогда не смешиваются.
'use strict';

const VERSION = 'e3075099112e';
// путь → [отпечаток, группа]: 0 — нужно сразу, 1 — звуки (докачиваются после), 2 — движок (только тот, что нужен телефону)
const FILES = {".last_build_id":["e938478a9a9a3d37",0],"assets/AssetManifest.bin":["350b08ad4b9cacdc",0],"assets/AssetManifest.bin.json":["8680d17be06ad812",0],"assets/FontManifest.json":["f81a272530e67d38",0],"assets/assets/adhan/README.txt":["b879deccc150f5a0",1],"assets/assets/adhan/aaqib.mp3":["a3c2f4ed2ceec6b3",1],"assets/assets/adhan/mecca.mp3":["bbffdc0b3f42e16c",1],"assets/assets/alarm/README.txt":["f41172a18f8844f9",1],"assets/assets/alarm/birds.mp3":["987e41eee3de08db",1],"assets/assets/alarm/rain.mp3":["66f6a997da6d98ce",1],"assets/assets/alarm/sea.mp3":["13a670a719d368cb",1],"assets/assets/alarm/speech.mp3":["e1ade7d694860b5c",1],"assets/assets/fonts/AmiriQuran-Regular.ttf":["e2a47644762d16bd",0],"assets/assets/fonts/CormorantGaramond-Italic.ttf":["0f48ea6abb208453",0],"assets/assets/fonts/KFGQPC-UthmanicHafs-v22.ttf":["a6e59510dcaf3ec9",0],"assets/assets/fonts/SabilSymbols.ttf":["b725412792e90c03",0],"assets/assets/google_fonts/Amiri-Bold.ttf":["cfccb794268e7d57",0],"assets/assets/google_fonts/Amiri-Regular.ttf":["ab391c4147d054c4",0],"assets/assets/google_fonts/Fraunces-Regular.ttf":["177ff6c0f14e5550",0],"assets/assets/google_fonts/Fraunces-SemiBold.ttf":["177ff6c0f14e5550",0],"assets/assets/google_fonts/OFL-Amiri.txt":["72de68e5954f4fdd",0],"assets/assets/google_fonts/OFL-Cormorant.txt":["60700d351cac4650",0],"assets/assets/google_fonts/OFL-Fraunces.txt":["bdf4c22802eaf804",0],"assets/assets/google_fonts/OFL-Onest.txt":["071195d8806e226f",0],"assets/assets/google_fonts/Onest-Bold.ttf":["966c5c29b4755da8",0],"assets/assets/google_fonts/Onest-Medium.ttf":["966c5c29b4755da8",0],"assets/assets/google_fonts/Onest-Regular.ttf":["966c5c29b4755da8",0],"assets/assets/google_fonts/Onest-SemiBold.ttf":["966c5c29b4755da8",0],"assets/assets/prayer/dumk_points.txt":["5eda59e5df402826",0],"assets/assets/quran/kk_altai.txt":["5c8a504aa624a010",0],"assets/assets/quran/mushaf_lines.txt":["9e685f1eea6c2674",0],"assets/assets/quran/quran-data.xml":["8867c1d88191472a",0],"assets/assets/quran/quran-uthmani.txt":["bf4f57b968d03f41",0],"assets/assets/quran/tajweed.txt":["c85fe598cdf8cb6b",0],"assets/assets/quran/tajweed_qpc.txt":["a53623e879d55626",0],"assets/assets/sounds/bead.wav":["23e1df56ed9d87e2",0],"assets/assets/sounds/round.wav":["d1c40bb6fd8a0108",0],"assets/assets/voice/039b0e23.mp3":["1f31630a4d42b139",1],"assets/assets/voice/09e73438.mp3":["e1a3501993c7655f",1],"assets/assets/voice/0a1cda89.mp3":["62731693fd5ff1c7",1],"assets/assets/voice/0ae735cb.mp3":["f085af64dfd45a9e",1],"assets/assets/voice/0b901463.mp3":["0884d266b00df403",1],"assets/assets/voice/0c887156.mp3":["7023affcadbad7ae",1],"assets/assets/voice/0df7887a.mp3":["a1017162bceeeae6",1],"assets/assets/voice/0f8ee608.mp3":["66e2dd825f90e981",1],"assets/assets/voice/102078d7.mp3":["d48aaa1bee58a9b6",1],"assets/assets/voice/1330f6b5.mp3":["0f624c52ab5dd976",1],"assets/assets/voice/1613fd6d.mp3":["8c8002ab2f6d7cbd",1],"assets/assets/voice/176b16e6.mp3":["3474e7670012d153",1],"assets/assets/voice/17e74a42.mp3":["f9631c947906f45b",1],"assets/assets/voice/1c286f58.mp3":["d4659f191fd6f18e",1],"assets/assets/voice/1dc24c82.mp3":["45c35cd2a5ece4f6",1],"assets/assets/voice/1ea942e0.mp3":["feff264dd8352537",1],"assets/assets/voice/21036f14.mp3":["22c553e78f630fb7",1],"assets/assets/voice/248acdbf.mp3":["cb41ed778bae83c5",1],"assets/assets/voice/24aac798.mp3":["c0ef95177a80d1f6",1],"assets/assets/voice/254a96db.mp3":["50aae96435e5f9d6",1],"assets/assets/voice/25588f1e.mp3":["ec1525b7dd67d536",1],"assets/assets/voice/25aac92b.mp3":["327e018690480851",1],"assets/assets/voice/286c08a1.mp3":["37247a3e14def64a",1],"assets/assets/voice/296e60b3.mp3":["e056681f3c0a7a5f",1],"assets/assets/voice/2990bff3.mp3":["606fccab26ad8b7e",1],"assets/assets/voice/2c013735.mp3":["5921ec661ef39440",1],"assets/assets/voice/2d763da8.mp3":["453fbed504239e60",1],"assets/assets/voice/2eed289a.mp3":["17389dfd06064623",1],"assets/assets/voice/325e979a.mp3":["a38316b8c4618076",1],"assets/assets/voice/32aadda2.mp3":["cb02e19e52843959",1],"assets/assets/voice/35613917.mp3":["7dd966c551f985bd",1],"assets/assets/voice/39c0e6cb.mp3":["a426be642c263a88",1],"assets/assets/voice/3f11a14c.mp3":["c6afdee97203d594",1],"assets/assets/voice/40a7a41f.mp3":["52f22db3eb4e1c0e",1],"assets/assets/voice/4111a472.mp3":["c11d1ebe04b95a5d",1],"assets/assets/voice/4311a798.mp3":["0e672a8f03d32112",1],"assets/assets/voice/4411a92b.mp3":["8d2de746a83d853d",1],"assets/assets/voice/4511aabe.mp3":["9fc9e5e1b7293298",1],"assets/assets/voice/4611ac51.mp3":["5d544dae4b246f78",1],"assets/assets/voice/46496f4a.mp3":["ac7da43728ba2ecb",1],"assets/assets/voice/46c05979.mp3":["2e239b1046406692",1],"assets/assets/voice/4711ade4.mp3":["16ae7d8e3bd18200",1],"assets/assets/voice/473e158f.mp3":["b6541b1028d2cd24",1],"assets/assets/voice/4790916d.mp3":["eef147e2d507b200",1],"assets/assets/voice/47e858e6.mp3":["bb644b55950e8cfd",1],"assets/assets/voice/4811af77.mp3":["950020b3a249c64b",1],"assets/assets/voice/4a11b29d.mp3":["1b2c1976c1d74737",1],"assets/assets/voice/4a306806.mp3":["8f7efd290bd240dc",1],"assets/assets/voice/4a7ef3fd.mp3":["a1ba2f9e78c6b7c9",1],"assets/assets/voice/4b881fc0.mp3":["7e46aae578d7c064",1],"assets/assets/voice/4d154e40.mp3":["6f957a516def4d67",1],"assets/assets/voice/4f5564fa.mp3":["c04f70bc3fd63579",1],"assets/assets/voice/50af6794.mp3":["0fd433af826a9f74",1],"assets/assets/voice/541593f2.mp3":["ff853bfb1c3879f2",1],"assets/assets/voice/55604bc9.mp3":["caa135d3a2df6f17",1],"assets/assets/voice/55a7c52e.mp3":["8b3f9456c4a6e6ac",1],"assets/assets/voice/56a7c6c1.mp3":["1988f7f0a32c6e7c",1],"assets/assets/voice/57132a72.mp3":["1af16aa218897ee6",1],"assets/assets/voice/571598ab.mp3":["4897824c9a8ee1fe",1],"assets/assets/voice/57c79183.mp3":["2d2b0cb7ba66f6cf",1],"assets/assets/voice/58159a3e.mp3":["999d085241b30512",1],"assets/assets/voice/59159bd1.mp3":["3e202ba99d28ba7e",1],"assets/assets/voice/5a159d64.mp3":["791c56eece57bb77",1],"assets/assets/voice/5ae1c4de.mp3":["0885c8f33b9c0fdc",1],"assets/assets/voice/5b159ef7.mp3":["e49dd5310d2bf0da",1],"assets/assets/voice/5bddd8f1.mp3":["c9e0699a444d8713",1],"assets/assets/voice/5c15a08a.mp3":["4209a2ac2394e1e1",1],"assets/assets/voice/5c95adf8.mp3":["cc29a785f40dcf07",1],"assets/assets/voice/5d15a21d.mp3":["b0acff007e279652",1],"assets/assets/voice/5e15a3b0.mp3":["b7f7889eaade4a98",1],"assets/assets/voice/5f15a543.mp3":["4e059d244d974e8b",1],"assets/assets/voice/5f22d4ff.mp3":["649cb8d796222627",1],"assets/assets/voice/5fa52153.mp3":["2af247daa83967b9",1],"assets/assets/voice/6015a6d6.mp3":["3a828acefae2622e",1],"assets/assets/voice/6115a869.mp3":["3ead5638a782cd7a",1],"assets/assets/voice/6215a9fc.mp3":["8bc44f4a0e66b1fa",1],"assets/assets/voice/62363ad9.mp3":["6ece7d571958fe69",1],"assets/assets/voice/6315ab8f.mp3":["24cd40f6611c2b6e",1],"assets/assets/voice/6415ad22.mp3":["628867001176b9b2",1],"assets/assets/voice/64a4752d.mp3":["9cd09b42b4756bc4",1],"assets/assets/voice/64dde71c.mp3":["436552203733594c",1],"assets/assets/voice/6515aeb5.mp3":["f84fba3842bbeca5",1],"assets/assets/voice/658dd4a6.mp3":["30a416c40bb6c6be",1],"assets/assets/voice/65dde8af.mp3":["566f1e2adc8809cc",1],"assets/assets/voice/6615b048.mp3":["e51a1df75b317ce6",1],"assets/assets/voice/6715b1db.mp3":["59e7d4a1fa419058",1],"assets/assets/voice/679476f3.mp3":["4a0e022f68124cbb",1],"assets/assets/voice/6915b501.mp3":["ab9d8cc0d5726bc6",1],"assets/assets/voice/6aa4f3e0.mp3":["d9468178f47a3148",1],"assets/assets/voice/6dfc2fd6.mp3":["0000968cd4160d43",1],"assets/assets/voice/6ecf4ef1.mp3":["444f19b8268ddf57",1],"assets/assets/voice/7422f60e.mp3":["8724e44627c59a6d",1],"assets/assets/voice/7522f7a1.mp3":["45803225c29f1e81",1],"assets/assets/voice/7cc89505.mp3":["91de2170c68196d8",1],"assets/assets/voice/80856979.mp3":["1d6470835a1c521c",1],"assets/assets/voice/82565d68.mp3":["4c76699ba408b5a4",1],"assets/assets/voice/89f255f7.mp3":["52cc61fd2f7a04d7",1],"assets/assets/voice/8ca36ccb.mp3":["46544a5ad516be98",1],"assets/assets/voice/8dc8afc8.mp3":["e08e000d324d46a9",1],"assets/assets/voice/8e378704.mp3":["d6f6907ae4bbc7e5",1],"assets/assets/voice/8eb1ae47.mp3":["40a21c3c7ff622e5",1],"assets/assets/voice/8ec8b15b.mp3":["a0975061e32b549c",1],"assets/assets/voice/8f15f504.mp3":["689d50561672239c",1],"assets/assets/voice/README.txt":["9dd5f4853f2291f1",1],"assets/assets/voice/a39fb987.mp3":["512eabd8526d1956",1],"assets/assets/voice/a7fab007.mp3":["896bbd759e5aff1c",1],"assets/assets/voice/a9813374.mp3":["6b18c78c22544e64",1],"assets/assets/voice/ac4be3c5.mp3":["672f0dc80aa48634",1],"assets/assets/voice/aefad498.mp3":["c27f7b172a719d07",1],"assets/assets/voice/af58ebb8.mp3":["75261d7fa0be4925",1],"assets/assets/voice/af9f1e3b.mp3":["6988ebc506a2a28b",1],"assets/assets/voice/afce4331.mp3":["4827f4522b1ef364",1],"assets/assets/voice/b30ccee3.mp3":["0c42e25ea96080d3",1],"assets/assets/voice/b9b24864.mp3":["584504adf80fd480",1],"assets/assets/voice/bc18b487.mp3":["3eda5073d9c99baa",1],"assets/assets/voice/bcbd2cc2.mp3":["d6cd100774c53802",1],"assets/assets/voice/bd918cdd.mp3":["a62854662f75953c",1],"assets/assets/voice/be83e2b0.mp3":["1464c163d9a6feb7",1],"assets/assets/voice/bf989bb6.mp3":["747cc14f00b330eb",1],"assets/assets/voice/bfd92f55.mp3":["1510bef89038041d",1],"assets/assets/voice/bff26520.mp3":["336cbb27b6630519",1],"assets/assets/voice/c23104e2.mp3":["13bd9edc2a21e387",1],"assets/assets/voice/c2a84c12.mp3":["2bbbff3bd04b6c48",1],"assets/assets/voice/c3a84da5.mp3":["8cba4d098e2f8f47",1],"assets/assets/voice/c6681bb6.mp3":["40e0f049dffa801d",1],"assets/assets/voice/c78d2062.mp3":["74d8551c01048737",1],"assets/assets/voice/c827cb2c.mp3":["55d8269faddcd3ac",1],"assets/assets/voice/c8a8e426.mp3":["bafeda0c8b50302f",1],"assets/assets/voice/caa6514f.mp3":["e92c18ea0496b287",1],"assets/assets/voice/cb4b0946.mp3":["7d59ab1b71eb687f",1],"assets/assets/voice/cb54786e.mp3":["418795f1a6be520f",1],"assets/assets/voice/cf2ef2a9.mp3":["c6ed4b30bbee3c82",1],"assets/assets/voice/d15975a1.mp3":["e98946a0d9d142b3",1],"assets/assets/voice/d4a86868.mp3":["9f71233ae201a4a9",1],"assets/assets/voice/d56a9e2f.mp3":["a8c6b90ad370f091",1],"assets/assets/voice/d832ef98.mp3":["54f909b7acfd4245",1],"assets/assets/voice/dd6c7fe6.mp3":["d812f8965921c7ac",1],"assets/assets/voice/de27edce.mp3":["0a8d12a2637aae0b",1],"assets/assets/voice/de6c8179.mp3":["dda0633cd58a8c5f",1],"assets/assets/voice/df27ef61.mp3":["233d0cd2fcb4ad51",1],"assets/assets/voice/e21d85c1.mp3":["f9ec7fddeb6e9deb",1],"assets/assets/voice/e24d3636.mp3":["36b554610ee34aed",1],"assets/assets/voice/e61eac41.mp3":["b27b23891efba7a4",1],"assets/assets/voice/edc64f4b.mp3":["61eb0586250190bd",1],"assets/assets/voice/f08f9927.mp3":["7e719b8534a88bf7",1],"assets/assets/voice/f713cca0.mp3":["7751162c30c52733",1],"assets/assets/voice/f813ce33.mp3":["aa072a7df57742a1",1],"assets/assets/voice/f86caa67.mp3":["118dc2ca60881f89",1],"assets/assets/voice/index.txt":["679e36d363af0355",0],"assets/fonts/MaterialIcons-Regular.otf":["dd588270d3d6c21c",0],"assets/fonts/fallback/Roboto-Regular.ttf":["79e851404657dac2",0],"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf":["3d90c370aa4cf00d",0],"assets/packages/material_ui/shaders/ink_sparkle.frag":["2dca5ab93d4ec29e",0],"assets/shaders/ink_sparkle.frag":["2dca5ab93d4ec29e",0],"assets/shaders/stretch_effect.frag":["ab412f07a5b9b50b",0],"canvaskit/canvaskit.js":["bb559f6080c7d312",2],"canvaskit/canvaskit.wasm":["fbed517a43e82452",2],"canvaskit/chromium/canvaskit.js":["6018b12bd8ed37e6",2],"canvaskit/chromium/canvaskit.wasm":["ae8ff1d858140f7b",2],"canvaskit/skwasm.js":["71d7d3e34bf71b52",2],"canvaskit/skwasm.wasm":["e540fd5e8303b7b6",2],"canvaskit/skwasm_heavy.js":["cec554b46ddcf4c0",2],"canvaskit/skwasm_heavy.wasm":["565f5cc1cca6ab12",2],"canvaskit/webparagraph/canvaskit.js":["3110e3e4d9b7b565",2],"canvaskit/webparagraph/canvaskit.wasm":["0ce1b05082efdc85",2],"canvaskit/wimp.js":["8fd8a47480c6eb0a",2],"canvaskit/wimp.wasm":["e924eaafd801d41e",2],"favicon.png":["f7e1a96a54ff640f",0],"flutter.js":["2beb1ce6b159c715",0],"flutter_bootstrap.js":["9ffae9a4ebec9d7e",0],"icons/Icon-192.png":["0f5fa245d5ac42cd",0],"icons/Icon-512.png":["c2f45ba4b9989b23",0],"icons/Icon-maskable-192.png":["0f5fa245d5ac42cd",0],"icons/Icon-maskable-512.png":["c2f45ba4b9989b23",0],"icons/apple-touch-icon.png":["1d5d2dd3aff82a60",0],"index.html":["329dcf3e7987d89a",0],"main.dart.js":["3afbe6ed8ebead85",2],"main.dart.mjs":["2fa981eb8d1c7d5a",2],"main.dart.wasm":["5778d8d653cfd180",2],"manifest.json":["01866e7ec70da5aa",0]};
const CACHE = 'sabil-files';
const OUTSIDE = 'sabil-outside-fonts';
const SCOPE = self.registration.scope;

const keyOf = (hash) => new Request(SCOPE + '__sabil/' + hash);
const pathOf = (url) => {
  if (!url.href.startsWith(SCOPE)) return null;
  const p = decodeURIComponent(url.href.slice(SCOPE.length).split(/[?#]/)[0]);
  return p === '' ? 'index.html' : p;
};

async function digest(buf) {
  const h = new Uint8Array(await crypto.subtle.digest('SHA-256', buf));
  return Array.from(h.slice(0, 8), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Скачать файл и положить в кеш, если его отпечаток — тот самый. */
async function store(cache, path) {
  const [hash] = FILES[path];
  if (await cache.match(keyOf(hash))) return true;
  const res = await fetch(SCOPE + path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(path + ' ' + res.status);
  const buf = await res.arrayBuffer();
  if ((await digest(buf)) !== hash) throw new Error(path + ': другая версия');
  const type = res.headers.get('content-type') || 'application/octet-stream';
  await cache.put(keyOf(hash), new Response(buf, { headers: { 'content-type': type, 'content-length': String(buf.byteLength) } }));
  return true;
}

/** Скачать список по несколько файлов сразу. strict — любая ошибка отменяет всё. */
async function storeAll(paths, strict) {
  const cache = await caches.open(CACHE);
  const queue = paths.slice();
  let failed = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const p = queue.shift();
      try { await store(cache, p); } catch (e) { failed++; if (strict) throw e; }
    }
  }));
  return failed === 0;
}

const group = (g) => Object.keys(FILES).filter((p) => FILES[p][1] === g);

/** Движок, которым телефон пользовался в прошлой версии, — взять и для новой. */
async function previousEngine() {
  try {
    const res = await (await caches.open(CACHE)).match(keyOf('engine-list'));
    const list = res ? await res.json() : [];
    return list.filter((p) => FILES[p]);
  } catch (e) { return []; }
}

self.addEventListener('install', (e) => {
  e.waitUntil((async () => { await storeAll(group(0).concat(await previousEngine()), true); })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const keep = new Set(Object.values(FILES).map((f) => keyOf(f[0]).url));
    keep.add(keyOf('engine-list').url);
    for (const k of await cache.keys()) if (!keep.has(k.url)) await cache.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  const m = e.data || {};
  if (m.type === 'update') self.skipWaiting();
  if (m.type === 'warm') {
    // Приложение запустилось: запомнить его движок и докачать звуки.
    e.waitUntil((async () => {
      const engine = (m.engine || []).filter((p) => FILES[p] && FILES[p][1] === 2);
      if (engine.length) {
        const cache = await caches.open(CACHE);
        await cache.put(keyOf('engine-list'), new Response(JSON.stringify(engine), { headers: { 'content-type': 'application/json' } }));
      }
      const core = await storeAll(group(0).concat(engine), false);
      if (e.source) e.source.postMessage({ type: 'offline', part: 'core', ok: core && engine.length > 0 });
      const sounds = await storeAll(group(1), false);
      if (e.source) e.source.postMessage({ type: 'offline', part: 'all', ok: core && sounds && engine.length > 0 });
    })());
  }
});

/** Звук: Safari просит файл кусочками (Range). */
async function ranged(req, res) {
  const r = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('range') || '');
  if (!r) return res;
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  let from = r[1] === '' ? size - Number(r[2]) : Number(r[1]);
  let to = r[1] === '' || r[2] === '' ? size - 1 : Math.min(Number(r[2]), size - 1);
  if (from < 0) from = 0;
  if (from >= size || from > to) return new Response(null, { status: 416, headers: { 'content-range': 'bytes */' + size } });
  return new Response(buf.slice(from, to + 1), {
    status: 206,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/octet-stream',
      'content-range': 'bytes ' + from + '-' + to + '/' + size,
      'content-length': String(to - from + 1),
      'accept-ranges': 'bytes',
    },
  });
}

async function answer(req, path) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(keyOf(FILES[path][0]));
  if (hit) return ranged(req, hit);
  try { await store(cache, path); } catch (e) { return fetch(req); }
  return ranged(req, await cache.match(keyOf(FILES[path][0])));
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === 'https://fonts.gstatic.com') {
    // Запасной шрифт для редких знаков (например, эмодзи в дневнике): однажды скачали — есть и без интернета.
    e.respondWith((async () => {
      const cache = await caches.open(OUTSIDE);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) await cache.put(req, res.clone());
      return res;
    })());
    return;
  }
  let path = pathOf(url);
  if (path === null || path === 'sw.js') return;
  if (req.mode === 'navigate' && !FILES[path]) path = 'index.html';
  if (FILES[path]) e.respondWith(answer(req, path));
});
