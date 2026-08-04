const $ = id => document.getElementById(id);

const SLIDERS = ['brightness', 'contrast', 'sepia'];
const CHECKS = ['preserveMedia', 'handleBgImages', 'skipDarkSites'];

let host = '';
let store = { defaults: {}, sites: {} };
let scope = 'site';              // 'site' | 'global'
let lang = DV_FALLBACK_LANG;     // 'en' | 'es' | ...

const t = key => dvT(lang, key);

// ------------------------------------------------------------------ lectura

function globals() { return { ...DV_DEFAULTS, ...store.defaults }; }
function siteRaw() { return dvNormalizeSite(store.sites[host]); }
function shown() { return scope === 'global' ? globals() : dvResolve(store, host); }

// ---------------------------------------------------------------- escritura

async function writeGlobals(patch) {
  store.defaults = { ...globals(), ...patch };
  await chrome.storage.local.set({ defaults: store.defaults });
}

async function writeSite(patch) {
  store.sites[host] = { ...siteRaw(), ...patch };
  await chrome.storage.local.set({ sites: store.sites });
}

async function write(patch) {
  if (!host && scope === 'site') return;
  if (scope === 'global') await writeGlobals(patch);
  else await writeSite(patch);
  render();
}

// ------------------------------------------------------------------ idioma

function buildLangPicker() {
  const box = $('lang');
  for (const l of DV_LANGS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lang__btn';
    b.setAttribute('role', 'radio');
    b.dataset.lang = l.code;
    b.textContent = l.label;
    b.addEventListener('click', async () => {
      lang = l.code;
      await chrome.storage.local.set({ lang });
      applyLang();
      rebuildSupport();
      render();
    });
    box.appendChild(b);
  }
}

/* Vuelca el diccionario sobre todo lo que lleve data-i18n. */
function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  $('scopeSeg').setAttribute('aria-label', t('scope.aria'));
  $('modeSeg').setAttribute('aria-label', t('mode.aria'));
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.setAttribute('aria-checked', String(b.dataset.lang === lang));
  });
}

// ------------------------------------------------------------------ pintado

function render() {
  const on = dvResolve(store, host).enabled;
  const v = shown();

  $('site').textContent = host || t('site.none');
  $('site').title = host;

  $('siteToggle').setAttribute('aria-pressed', String(on));
  $('siteState').textContent = on ? t('dimmer.on') : t('dimmer.off');
  $('siteToggle').disabled = !host;

  document.querySelectorAll('[data-scope]').forEach(b => {
    b.setAttribute('aria-checked', String(b.dataset.scope === scope));
  });

  const custom = scope === 'site' && dvHasCustom(store, host);
  $('badge').hidden = !custom;
  $('clearSite').hidden = !custom;

  document.querySelectorAll('[data-mode]').forEach(b => {
    b.setAttribute('aria-checked', String(b.dataset.mode === v.mode));
  });

  const isFilter = v.mode === 'filter';
  $('sliders').style.display = isFilter ? '' : 'none';
  $('wrapPreserveMedia').style.display = isFilter ? '' : 'none';
  $('wrapHandleBgImages').style.display = isFilter ? '' : 'none';
  $('wrapEnabled').style.display = scope === 'global' ? '' : 'none';
  $('enabled').checked = !!globals().enabled;

  for (const k of SLIDERS) {
    $(k).value = v[k];
    $(k + 'Out').textContent = v[k];
  }
  for (const k of CHECKS) $(k).checked = !!v[k];

  const open = !$('support').hidden;
  $('supportLabel').textContent = open ? t('support.close') : t('support.open');
  $('supportToggle').setAttribute('aria-expanded', String(open));
}

// ------------------------------------------------------------------ apoyo

function hasSupport() {
  const paypal = DV_SUPPORT.paypal && DV_SUPPORT.paypal.trim();
  const wallets = (DV_SUPPORT.wallets || []).filter(w => w.address && w.address.trim());
  return DV_SUPPORT.enabled && (paypal || wallets.length);
}

function rebuildSupport() {
  const box = $('supportItems');
  box.textContent = '';
  if (!hasSupport()) return;

  if (DV_SUPPORT.paypal && DV_SUPPORT.paypal.trim()) {
    const item = document.createElement('div');
    item.className = 'support__item';

    const head = document.createElement('div');
    head.className = 'support__head';
    const name = document.createElement('span');
    name.className = 'support__name';
    name.textContent = 'PayPal';
    head.appendChild(name);

    const a = document.createElement('a');
    a.className = 'support__link';
    a.href = DV_SUPPORT.paypal;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.textContent = t('support.paypal');

    item.append(head, a);
    box.appendChild(item);
  }

  for (const w of (DV_SUPPORT.wallets || [])) {
    if (!w.address || !w.address.trim()) continue;

    const item = document.createElement('div');
    item.className = 'support__item';

    const head = document.createElement('div');
    head.className = 'support__head';
    const name = document.createElement('span');
    name.className = 'support__name';
    name.textContent = dvText(w.label, lang) || t('support.crypto');
    head.appendChild(name);
    if (w.network) {
      const net = document.createElement('span');
      net.className = 'support__net';
      net.textContent = dvText(w.network, lang);
      head.appendChild(net);
    }

    const row = document.createElement('div');
    row.className = 'addr';
    const val = document.createElement('code');
    val.className = 'addr__value';
    val.textContent = w.address;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'addr__copy';
    btn.textContent = t('copy');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(w.address);
        btn.textContent = t('copied');
        btn.dataset.done = 'true';
      } catch (_) {
        btn.textContent = t('copyError');
      }
      setTimeout(() => {
        btn.textContent = t('copy');
        delete btn.dataset.done;
      }, 1600);
    });

    row.append(val, btn);
    item.append(head, row);

    const warn = dvText(w.warning, lang);
    if (warn) {
      const p = document.createElement('p');
      p.className = 'warn';
      p.textContent = '⚠ ' + warn;
      item.appendChild(p);
    }

    box.appendChild(item);
  }
}

// ---------------------------------------------------------------- arranque

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try { host = new URL(tab.url).hostname; } catch (_) { host = ''; }
  if (!host) scope = 'global';

  const data = await chrome.storage.local.get(['defaults', 'sites', 'lang']);
  store = { defaults: data.defaults || {}, sites: data.sites || {} };
  if (data.lang && DV_I18N[data.lang]) lang = data.lang;

  $('ver').textContent = 'v' + chrome.runtime.getManifest().version;

  buildLangPicker();
  applyLang();
  if (hasSupport()) {
    $('supportToggle').hidden = false;
    rebuildSupport();
  }
  render();
})();

// ----------------------------------------------------------------- eventos

$('siteToggle').addEventListener('click', async () => {
  if (!host) return;
  await writeSite({ enabled: !dvResolve(store, host).enabled });
  render();
});

document.querySelectorAll('[data-scope]').forEach(b => {
  b.addEventListener('click', () => { scope = b.dataset.scope; render(); });
});

document.querySelectorAll('[data-mode]').forEach(b => {
  b.addEventListener('click', () => write({ mode: b.dataset.mode }));
});

for (const k of SLIDERS) {
  $(k).addEventListener('input', e => {
    $(k + 'Out').textContent = e.target.value;
    write({ [k]: Number(e.target.value) });
  });
}

for (const k of CHECKS) {
  $(k).addEventListener('change', e => write({ [k]: e.target.checked }));
}

$('enabled').addEventListener('change', async e => {
  await writeGlobals({ enabled: e.target.checked });
  render();
});

$('clearSite').addEventListener('click', async () => {
  const kept = siteRaw().enabled;
  store.sites[host] = kept === undefined ? {} : { enabled: kept };
  await chrome.storage.local.set({ sites: store.sites });
  render();
});

$('supportToggle').addEventListener('click', () => {
  $('support').hidden = !$('support').hidden;
  render();
});
