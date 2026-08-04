/* Dark Veil — configuración central
 *
 * ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS TOCAR para cambiar tus enlaces de
 * donación o los valores con los que arranca la extensión.
 */

/* Valores con los que se comporta un sitio que no tiene ajustes propios. */
const DV_DEFAULTS = {
  enabled: true,         // ¿activo al entrar por primera vez en un sitio nuevo?
  mode: 'filter',        // 'filter' | 'overlay'
  brightness: 100,       // 50–150
  contrast: 95,          // 50–150
  sepia: 0,              // 0–60
  preserveMedia: true,
  handleBgImages: false,
  skipDarkSites: true
};

/* ------------------------------------------------------------------ apoyo */

const DV_SUPPORT = {
  // Pon false y desaparece por completo el enlace "Apoyar" del popup.
  enabled: true,

  // Deja la cadena vacía para ocultar solo esta opción.
  paypal: 'https://www.paypal.com/donate/?business=4WVM7245FANKE&no_recurring=1&item_name=Gracias+por+tu+colaboraci%C3%B3n.&currency_code=USD',

  // Añade o quita entradas libremente; el popup se adapta solo.
  // Los textos admiten una cadena suelta o un objeto por idioma.
  wallets: [
    {
      label: 'USDT',
      network: 'BEP20 · BNB Smart Chain',
      address: '0x25A64353147041cCe03D2F77D34a242cA677d550',
      warning: {
        en: 'BEP20 network only. Other networks are lost.',
        es: 'Solo por red BEP20. Otras redes se pierden.'
      }
    }
  ]
};

/* --------------------------------------------------------------- utilidades */

/* Los ajustes de un sitio se guardaron antes como booleano suelto.
   Esto acepta ambos formatos para no romper configuraciones antiguas. */
function dvNormalizeSite(value) {
  if (value === true || value === false) return { enabled: value };
  if (value && typeof value === 'object') return value;
  return {};
}

/* Combina los valores por defecto con lo que ese sitio tenga propio. */
function dvResolve(store, host) {
  const globals = { ...DV_DEFAULTS, ...(store.defaults || {}) };
  const site = dvNormalizeSite(store.sites && store.sites[host]);
  return { ...globals, ...site };
}

/* ¿Este sitio tiene algo propio más allá de estar encendido o apagado? */
function dvHasCustom(store, host) {
  const site = dvNormalizeSite(store.sites && store.sites[host]);
  return Object.keys(site).some(k => k !== 'enabled');
}
