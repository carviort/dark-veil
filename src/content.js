/* Dark Veil — content script
 *
 * Modo "filter":
 *   Marco principal:  html { filter: invert(1) hue-rotate(180deg) brightness(B) contrast(C) }
 *   Medios:           img, video, ... { filter: contrast(1/C) brightness(1/B) hue-rotate(180deg) invert(1) }
 *
 * Los filtros se componen: primero el del hijo, luego el del padre. Como
 * invert∘invert = identidad y hue-rotate(180)∘hue-rotate(180) = 360 = identidad,
 * y brillo/contraste se cancelan con sus inversos, las imágenes vuelven
 * exactamente a su color original mientras el resto queda oscuro.
 *
 * Los iframes NO se contra-invierten: el filtro del marco principal ya actúa
 * sobre el resultado compuesto. En su lugar este mismo script corre dentro de
 * cada iframe y solo contra-invierte los medios de ahí dentro.
 *
 * La configuración se resuelve por sitio: DV_DEFAULTS de base, machacado por
 * lo que ese dominio tenga guardado en sites[host].
 */
(() => {
  'use strict';

  /* Al instalar, background.js reinyecta el script en las pestañas ya
     abiertas. Si por lo que sea coincide con la inyección declarativa,
     este guardia evita listeners duplicados. */
  if (window.__darkVeilLoaded) return;
  window.__darkVeilLoaded = true;

  const IS_TOP = (() => {
    try { return window.top === window.self; } catch (_) { return false; }
  })();

  const STYLE_ID = 'darkveil-style';
  const OVERLAY_ID = 'darkveil-overlay';
  const BG_CLASS = 'darkveil-bg';

  const host = location.hostname || '';

  let store = { defaults: {}, sites: {} };
  let cfg = { ...DV_DEFAULTS };
  let active = false;
  let bgObserver = null;

  function root() { return document.documentElement; }

  const MEDIA = [
    'img',
    'video',
    'picture',
    'canvas',
    'svg[data-darkveil-keep]',
    'input[type="image"]',
    '[style*="background-image"]',
    '.' + BG_CLASS
  ].join(',');

  // ------------------------------------------------------------------- css

  function buildCSS(c) {
    const b = c.brightness / 100;
    const k = c.contrast / 100;
    const s = c.sepia / 100;

    const parent =
      `invert(1) hue-rotate(180deg) brightness(${b}) contrast(${k})` +
      (s ? ` sepia(${s})` : '');

    const child =
      (s ? 'sepia(0) ' : '') +
      `contrast(${(1 / k).toFixed(4)}) brightness(${(1 / b).toFixed(4)}) ` +
      'hue-rotate(180deg) invert(1)';

    let css = '';

    if (IS_TOP) {
      css += `
html {
  background-color: #ffffff !important;
  filter: ${parent} !important;
}
html, body { background-color: #ffffff !important; }
`;
    }

    if (c.preserveMedia) {
      css += `
${MEDIA} { filter: ${child} !important; }
.${BG_CLASS} ${MEDIA} { filter: none !important; }
`;
    }

    return css;
  }

  function applyStyle(c) {
    const css = buildCSS(c);

    /* En subframes el CSS queda vacío si no hay que contra-invertir medios.
       Sin esto, cada iframe de anuncio se quedaba con un <style> inútil. */
    if (!css) { removeStyle(); return; }

    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      el.type = 'text/css';
      (document.head || root()).appendChild(el);
    }
    el.textContent = css;
    if (el.parentNode && el.parentNode.lastElementChild !== el) {
      el.parentNode.appendChild(el);
    }
  }

  function removeStyle() {
    const el = document.getElementById(STYLE_ID);
    if (el) el.remove();
  }

  // -------------------------------------------------------- modo capa

  function applyOverlay() {
    if (!IS_TOP) return;
    if (document.getElementById(OVERLAY_ID)) return;

    const ov = document.createElement('div');
    ov.id = OVERLAY_ID;
    ov.setAttribute('aria-hidden', 'true');
    ov.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:2147483647',
      'pointer-events:none', 'background:#ffffff',
      'mix-blend-mode:difference', 'contain:strict'
    ].join(';');

    const hue = document.createElement('div');
    hue.style.cssText = [
      'position:absolute', 'inset:0', 'pointer-events:none',
      'backdrop-filter:hue-rotate(180deg)',
      '-webkit-backdrop-filter:hue-rotate(180deg)'
    ].join(';');

    ov.appendChild(hue);
    root().appendChild(ov);
  }

  function removeOverlay() {
    const ov = document.getElementById(OVERLAY_ID);
    if (ov) ov.remove();
  }

  // ------------------------------------ fondos con imagen (opcional)

  function scanBackgrounds() {
    const nodes = document.body ? document.body.querySelectorAll('*') : [];
    for (const el of nodes) {
      if (el.classList.contains(BG_CLASS)) continue;
      let bg;
      try { bg = getComputedStyle(el).backgroundImage; } catch (_) { continue; }
      if (!bg || bg === 'none' || !bg.includes('url(')) continue;
      let hasText = false;
      for (const n of el.childNodes) {
        if (n.nodeType === 3 && n.nodeValue.trim()) { hasText = true; break; }
      }
      if (!hasText) el.classList.add(BG_CLASS);
    }
  }

  let scanQueued = false;
  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    const run = () => { scanQueued = false; scanBackgrounds(); };
    if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 800 });
    else setTimeout(run, 300);
  }

  function startBgObserver() {
    if (bgObserver || !document.body) return;
    bgObserver = new MutationObserver(queueScan);
    bgObserver.observe(document.body, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['style', 'class']
    });
    queueScan();
  }

  function stopBgObserver() {
    if (bgObserver) { bgObserver.disconnect(); bgObserver = null; }
    document.querySelectorAll('.' + BG_CLASS)
      .forEach(el => el.classList.remove(BG_CLASS));
  }

  // ------------------------------------- detectar sitios ya oscuros

  function parseRGB(str) {
    const m = /rgba?\(([^)]+)\)/.exec(str || '');
    if (!m) return null;
    const p = m[1].split(',').map(v => parseFloat(v));
    if (p.length >= 4 && p[3] === 0) return null;
    return { r: p[0], g: p[1], b: p[2] };
  }

  function looksDark() {
    for (const el of [document.body, root()].filter(Boolean)) {
      const c = parseRGB(getComputedStyle(el).backgroundColor);
      if (!c) continue;
      return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255 < 0.35;
    }
    return false;
  }

  // --------------------------------------------------- ciclo de vida

  function enable() {
    active = true;
    if (cfg.mode === 'overlay') {
      removeStyle();
      stopBgObserver();
      applyOverlay();
    } else {
      removeOverlay();
      applyStyle(cfg);
      if (cfg.handleBgImages && cfg.preserveMedia) startBgObserver();
      else stopBgObserver();
    }
    root().setAttribute('data-darkveil', cfg.mode);
  }

  function disable() {
    active = false;
    removeStyle();
    removeOverlay();
    stopBgObserver();
    root().removeAttribute('data-darkveil');
  }

  function refresh() {
    cfg = dvResolve(store, host);
    if (cfg.enabled) enable();
    else disable();
  }

  function checkDarkSite() {
    if (!IS_TOP || !active || !cfg.skipDarkSites) return;
    // Si el usuario ha encendido este sitio a mano, su decisión manda.
    const site = dvNormalizeSite(store.sites && store.sites[host]);
    if (site.enabled === true) return;
    if (looksDark()) disable();
  }

  // ------------------------------------------------------- arranque

  /* Un subframe solo necesita saber de su propio dominio. Guardar el mapa
     completo multiplicaba ese objeto por cada iframe de cada pestaña, y ese
     mapa crece indefinidamente con los sitios que el usuario va visitando. */
  function trimStore() {
    if (IS_TOP) return;
    const own = store.sites[host];
    store.sites = own === undefined ? {} : { [host]: own };
  }

  chrome.storage.local.get(['defaults', 'sites'], data => {
    store = { defaults: data.defaults || {}, sites: data.sites || {} };
    trimStore();
    refresh();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (active) enable();
        checkDarkSite();
      }, { once: true });
    } else {
      checkDarkSite();
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.defaults) store.defaults = changes.defaults.newValue || {};
    if (changes.sites) { store.sites = changes.sites.newValue || {}; trimStore(); }
    refresh();
    checkDarkSite();
  });

  document.addEventListener('readystatechange', () => {
    if (active && cfg.mode === 'filter' && !document.getElementById(STYLE_ID)) {
      applyStyle(cfg);
    }
  });
})();
