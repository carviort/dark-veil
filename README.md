[![Release](https://img.shields.io/github/v/release/carviort/dark-veil)](https://github.com/carviort/dark-veil/releases/latest)

[Descargar la última versión](https://github.com/carviort/dark-veil/releases/latest)
# Dark Veil

Modo oscuro para cualquier sitio web. Manifest V3.

**Política de privacidad:** https://carviort.github.io/dark-veil/privacy-policy.html

## Empaquetar para la tienda

```bash
./build.sh
```

Lee la versión del `manifest.json` y deja el zip en `dist/`, con el
`manifest.json` en la raíz del archivo, que es como lo exige el panel.

## Instalar

1. Abre `chrome://extensions`
2. Activa **Modo de desarrollador** (arriba a la derecha)
3. **Cargar descomprimida** → selecciona la carpeta `dark-veil`
4. Ancla el icono a la barra y ábrelo en cualquier página

Atajo: `Alt` + `Shift` + `D` enciende o apaga el sitio actual.

## Los dos métodos

### Filtro (el recomendado)

Aplica al elemento raíz:

```css
html { filter: invert(1) hue-rotate(180deg) brightness(B) contrast(C); }
```

`invert(1)` da el oscuro; `hue-rotate(180deg)` devuelve los tonos a su sitio
(sin él, el azul se vuelve naranja y todo parece de los 90).

El truco está en las fotos: si solo inviertes, las caras salen radiactivas. Así
que cada `img`, `video`, `canvas`... lleva el filtro **inverso exacto**, en orden
inverso:

```css
img, video, ... { filter: contrast(1/C) brightness(1/B) hue-rotate(180deg) invert(1); }
```

Los filtros se componen: primero el del hijo, después el del padre. Como
`invert ∘ invert = identidad` y `hue-rotate(180) ∘ hue-rotate(180) = 360 = identidad`,
y brillo/contraste se cancelan con sus recíprocos, la imagen vuelve **exactamente**
a su color original mientras el resto de la página queda oscura.

**Iframes.** El script corre en todos los marcos pero solo el principal aplica el
filtro a `html`: el navegador pinta los iframes dentro del marco padre, así que
ya quedan invertidos. Dentro de cada iframe, el script solo contra-invierte sus
imágenes y vídeos. Resultado: una única inversión, sin dobles.

### Capa (`mix-blend-mode`)

Un `div` fijo a pantalla completa:

```css
position: fixed; inset: 0; background: #fff; mix-blend-mode: difference;
```

Restar del blanco es invertir. Encima, una segunda capa con
`backdrop-filter: hue-rotate(180deg)` corrige el tono.

Ventaja: no toca el layout, así que nunca rompe nada. Desventaja: invierte
absolutamente todo, fotos incluidas. Úsalo como plan B cuando el modo filtro se
lleve mal con un sitio concreto.

## Limitaciones conocidas (sé honesto con esto)

- **`position: fixed`.** Un `filter` en un elemento lo convierte en bloque
  contenedor de sus descendientes fijos. En Chrome el caso de `:root` está
  bastante bien resuelto, pero algunos sitios con cabeceras pegajosas raras se
  descolocan. Ahí, cambia a modo Capa o apaga ese dominio.
- **Fondos con imagen en CSS.** No se distinguen del color de fondo sin inspeccionar
  los estilos computados. La opción *Corregir fondos con imagen* recorre el DOM y
  marca los elementos con `background-image` **que no contienen texto propio**
  (si lo tuvieran, el texto se invertiría al revés). Va desactivada por defecto
  porque cuesta CPU en páginas enormes.
- **PDFs y `<embed>`.** El visor de PDF de Chrome no admite content scripts.
- **Vídeo a pantalla completa.** Sale con el color correcto, que es lo que quieres.
- **Sitios ya oscuros.** Se detectan midiendo la luminancia del fondo de `body`
  al cargar y se saltan. Si un sitio se salta y no debería, enciéndelo a mano:
  la elección manual gana sobre la detección.

## Si quieres ir más lejos

Esta extensión invierte. La alternativa seria es **re-tematizar**: leer las hojas
de estilo, encontrar cada color declarado, convertirlo a HSL y darle la vuelta
solo a la luminosidad, conservando tono y saturación. Sale mucho mejor —es lo que
hace Dark Reader— pero implica parsear CSSOM, seguir `@import`, manejar hojas
cross-origin y observar los estilos que se inyectan en caliente. Es un orden de
magnitud más de trabajo.

Otra mejora concreta: registrar el CSS con
`chrome.scripting.registerContentScripts()` al arrancar el service worker, en vez
de inyectarlo desde el content script. El navegador lo aplica antes del primer
pintado y desaparece el fogonazo blanco al cargar.

## Ajustes por sitio

Cada dominio guarda su propia configuración completa, no solo si está encendido.
Puedes tener Wikipedia en modo Filtro con el contraste al 90 y otro sitio que se
lleva mal con los filtros en modo Capa, a la vez.

En el popup, el selector **Este sitio / Por defecto** decide qué estás editando:

- **Este sitio** — los cambios afectan solo al dominio actual. Aparece la
  etiqueta `propio` cuando ese sitio tiene algo distinto de lo general, y con
  *Volver a los valores por defecto aquí* se borran sus ajustes propios sin
  perder el encendido/apagado.
- **Por defecto** — los cambios afectan a todos los sitios que no tengan ajustes
  propios.

Por dentro:

```js
storage.local = {
  defaults: { mode, brightness, contrast, ... },   // base
  sites: {
    "ejemplo.com": { enabled: true, mode: "overlay" }   // solo lo que cambia
  }
}
```

Un sitio guarda únicamente las claves que difieren, así que si mañana cambias el
contraste general, los sitios que no lo hayan tocado lo heredan.

## Idioma

La interfaz está en **inglés por defecto** y trae un selector EN/ES en la
esquina superior derecha del popup. La elección se guarda y persiste.

Los textos viven en `src/i18n.js`. Para añadir un idioma: copia el bloque `es`,
cámbiale la clave, traduce los valores y añade el código a `DV_LANGS`. El
selector se genera solo a partir de ese array, así que no hay que tocar nada más.

Los campos de `src/config.js` admiten cadena suelta u objeto por idioma:

```js
warning: 'BEP20 only'
warning: { en: 'BEP20 only', es: 'Solo BEP20' }
```

## Estructura

```
dark-veil/
├── manifest.json
├── src/
│   ├── config.js       ← valores por defecto y enlaces de donación
│   ├── i18n.js         ← textos de la interfaz
│   ├── content.js      la lógica de verdad
│   └── background.js   migración de datos y atajo de teclado
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── icons/
```
