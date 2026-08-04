importScripts('./config.js');

/* Migración desde el formato antiguo:
 *   antes -> claves sueltas (mode, brightness...) + sites: { host: bool }
 *   ahora -> defaults: {...} + sites: { host: {...} }
 * Se ejecuta también en cada actualización, y es idempotente.
 */
async function migrate() {
  const all = await chrome.storage.local.get(null);

  if (!all.defaults) {
    const defaults = {};
    for (const k of Object.keys(DV_DEFAULTS)) {
      if (k in all) defaults[k] = all[k];
    }
    await chrome.storage.local.set({ defaults: { ...DV_DEFAULTS, ...defaults } });
    await chrome.storage.local.remove(Object.keys(DV_DEFAULTS));
  }

  const sites = all.sites || {};
  let touched = false;
  for (const host of Object.keys(sites)) {
    if (typeof sites[host] === 'boolean') {
      sites[host] = { enabled: sites[host] };
      touched = true;
    }
  }
  if (touched) await chrome.storage.local.set({ sites });
}

chrome.runtime.onInstalled.addListener(migrate);
chrome.runtime.onStartup.addListener(migrate);

chrome.commands.onCommand.addListener(async command => {
  if (command !== 'toggle-site') return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;

  let host;
  try { host = new URL(tab.url).hostname; } catch (_) { return; }
  if (!host) return;

  const data = await chrome.storage.local.get(['defaults', 'sites']);
  const sites = data.sites || {};
  const current = dvResolve(data, host).enabled;

  sites[host] = { ...dvNormalizeSite(sites[host]), enabled: !current };
  await chrome.storage.local.set({ sites });
});
