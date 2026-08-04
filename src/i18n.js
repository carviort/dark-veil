/* Dark Veil — textos de la interfaz
 *
 * Para añadir un idioma: copia el bloque `es`, cámbiale la clave (por ejemplo
 * `pt`) y traduce los valores. Después añade el código al array DV_LANGS.
 * El selector del popup se genera solo a partir de ese array.
 */

const DV_LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' }
];

const DV_FALLBACK_LANG = 'en';

const DV_I18N = {
  en: {
    'site.none': 'unsupported page',

    'dimmer.on': 'On',
    'dimmer.off': 'Off',
    'dimmer.hint': 'on this site',

    'scope.site': 'This site',
    'scope.global': 'Default',
    'scope.aria': 'What you are editing',
    'badge.custom': 'custom',

    'label.method': 'Method',
    'mode.filter': 'Filter',
    'mode.overlay': 'Layer',
    'mode.aria': 'Method',

    'label.brightness': 'Brightness',
    'label.contrast': 'Contrast',
    'label.warmth': 'Warmth',

    'check.preserveMedia': 'Keep photos and videos',
    'check.handleBgImages': 'Fix image backgrounds',
    'check.skipDarkSites': 'Skip already-dark sites',
    'check.enabled': 'On when I open a new site',

    'clearSite': 'Reset this site to defaults',

    'support.open': 'Support this project',
    'support.close': 'Hide',
    'support.note': 'Dark Veil is free and ad-free. If you find it useful:',
    'support.paypal': 'Donate with PayPal',
    'support.crypto': 'Crypto',

    'copy': 'Copy',
    'copied': 'Copied',
    'copyError': 'Failed'
  },

  es: {
    'site.none': 'página no compatible',

    'dimmer.on': 'Encendido',
    'dimmer.off': 'Apagado',
    'dimmer.hint': 'en este sitio',

    'scope.site': 'Este sitio',
    'scope.global': 'Por defecto',
    'scope.aria': 'Qué estás editando',
    'badge.custom': 'propio',

    'label.method': 'Método',
    'mode.filter': 'Filtro',
    'mode.overlay': 'Capa',
    'mode.aria': 'Método',

    'label.brightness': 'Brillo',
    'label.contrast': 'Contraste',
    'label.warmth': 'Calidez',

    'check.preserveMedia': 'Conservar fotos y vídeos',
    'check.handleBgImages': 'Corregir fondos con imagen',
    'check.skipDarkSites': 'Saltar sitios que ya son oscuros',
    'check.enabled': 'Activo al entrar en un sitio nuevo',

    'clearSite': 'Volver a los valores por defecto aquí',

    'support.open': 'Apoyar el proyecto',
    'support.close': 'Ocultar',
    'support.note': 'Dark Veil es gratis y sin anuncios. Si te resulta útil:',
    'support.paypal': 'Donar con PayPal',
    'support.crypto': 'Cripto',

    'copy': 'Copiar',
    'copied': 'Copiado',
    'copyError': 'Error'
  }
};

/* Traduce una clave. Si falta en el idioma activo, cae al de base. */
function dvT(lang, key) {
  const dict = DV_I18N[lang] || DV_I18N[DV_FALLBACK_LANG];
  return dict[key] || DV_I18N[DV_FALLBACK_LANG][key] || key;
}

/* Los campos de config.js pueden ser un texto suelto o un objeto por idioma:
     warning: 'Only BEP20'
     warning: { en: 'Only BEP20', es: 'Solo BEP20' }                    */
function dvText(value, lang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value[DV_FALLBACK_LANG] || Object.values(value)[0] || '';
}
