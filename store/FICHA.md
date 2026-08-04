# Textos para la ficha — Dark Veil 1.2.0

Copia y pega tal cual. El orden es el mismo en que te los pide el panel.

---

## FICHA DE LA TIENDA → Idioma principal: English

### Nombre
```
Dark Veil
```

### Descripción breve (Summary — máximo 132 caracteres)
```
Dark mode for any website. Photos and videos keep their real colours, and every site remembers its own settings.
```
*(111 caracteres)*

### Categoría
`Accessibility`

Es mejor encaje que Tools: los modos oscuros compiten ahí con menos ruido y el
público que busca en Accessibility es exactamente el tuyo.

### Descripción detallada
```
Dark Veil turns any website dark — not just the ones that ship their own dark theme.

WHY IT LOOKS BETTER THAN OTHER DARK MODES

Most dark mode extensions invert the whole page, which leaves photos looking like film negatives. Dark Veil applies the mathematically exact inverse filter to images and videos, so they come back to their original colours while text and backgrounds stay dark. Faces look like faces.

EVERY SITE REMEMBERS ITS OWN SETTINGS

Some sites work better with one rendering method than the other, so Dark Veil keeps a separate configuration per domain. Set one site to Filter with lower contrast and another to Layer, and both stick. Sites you never customise follow your defaults, so changing a default updates them all at once.

FEATURES

• Two rendering methods — Filter for the best quality, Layer for sites that react badly to CSS filters
• Brightness, contrast and warmth sliders
• Per-domain settings, saved automatically
• Alt+Shift+D toggles the current site without opening the popup
• Already-dark sites are detected and skipped
• Optional handling of CSS background images
• Interface in English and Spanish

PRIVACY

Dark Veil makes no network requests. It has no analytics, no tracking and no remote code. It does not read the content of the pages you visit — it only injects CSS rules that change how they are displayed. Your settings are stored locally on your device and never leave it.

Free, open and ad-free.
```

---

## FICHA DE LA TIENDA → Añadir idioma: Español

En el panel puedes añadir traducciones de la ficha. Merece la pena: te posiciona
en las búsquedas en español.

### Descripción breve
```
Modo oscuro para cualquier web. Las fotos y los vídeos conservan sus colores reales y cada sitio guarda sus ajustes.
```
*(114 caracteres)*

### Descripción detallada
```
Dark Veil oscurece cualquier página web, no solo las que traen su propio tema oscuro.

POR QUÉ SE VE MEJOR QUE OTROS MODOS OSCUROS

La mayoría de extensiones invierten la página entera, y las fotos acaban pareciendo negativos de carrete. Dark Veil aplica a imágenes y vídeos el filtro inverso exacto, así que recuperan sus colores originales mientras el texto y los fondos siguen oscuros. Las caras parecen caras.

CADA SITIO RECUERDA SUS PROPIOS AJUSTES

Hay webs que funcionan mejor con un método y otras con el otro, así que Dark Veil guarda una configuración distinta por dominio. Puedes tener un sitio en Filtro con menos contraste y otro en Capa, a la vez. Los sitios que no personalices siguen tus valores por defecto, de modo que cambiar uno los actualiza todos de golpe.

CARACTERÍSTICAS

• Dos métodos: Filtro para la mejor calidad, Capa para webs que se llevan mal con los filtros CSS
• Controles de brillo, contraste y calidez
• Ajustes por dominio, guardados automáticamente
• Alt+Mayús+D enciende o apaga el sitio actual sin abrir nada
• Detecta y respeta los sitios que ya son oscuros
• Tratamiento opcional de fondos con imagen CSS
• Interfaz en inglés y español

PRIVACIDAD

Dark Veil no hace ninguna petición de red. No lleva analíticas, ni rastreo, ni código remoto. No lee el contenido de las páginas que visitas: solo inyecta reglas CSS que cambian cómo se muestran. Tus ajustes se guardan en tu dispositivo y no salen de ahí.

Gratis, abierta y sin anuncios.
```

---

## PRÁCTICAS DE PRIVACIDAD

### Propósito único (Single purpose)
```
Dark Veil has one purpose: to render websites in a dark colour scheme. It applies a CSS filter to the page so that light backgrounds become dark and text becomes light, and applies the mathematically inverse filter to images and videos so their original colours are preserved. It does nothing else.
```

### Justificación de `storage`
```
Stores the user's display preferences locally: whether dark mode is on for each domain, the rendering method, and the brightness, contrast and warmth values. These settings must persist between browsing sessions, and the extension keeps a separate configuration per site, so a persistent store is required. All data stays in chrome.storage.local on the user's device and is never transmitted anywhere.
```

### Justificación de permisos de host (`<all_urls>`)
```
The extension's single feature is applying a dark colour scheme to web pages, and users expect it to work on any site they visit rather than a predetermined list. There is no way to know in advance which sites a user will want darkened, so narrower host patterns cannot implement this feature.

The content script only injects a <style> element containing CSS filter rules, and optionally adds a CSS class to elements that have a background-image. It never reads page text, form fields, cookies or credentials, makes no network requests, and transmits no data. Users can disable the extension per-domain from the popup or with a keyboard shortcut.
```

### Uso de datos
Marca **ninguna** de las categorías y firma las tres declaraciones:
- No vendo ni transfiero datos de usuario a terceros ajenos a los casos aprobados
- No uso ni transfiero datos de usuario para fines ajenos al propósito único
- No uso ni transfiero datos de usuario para determinar solvencia ni conceder préstamos

Las tres son ciertas en tu caso, la extensión no recoge nada.

### URL de la política de privacidad
https://carviort.github.io/dark-veil/privacy-policy.html

---

## DISTRIBUCIÓN

- **Visibilidad**: Pública (o No listada si prefieres empezar discreto)
- **Regiones**: todas
- **Trader status**: **Non-trader**

---

## CAPTURAS

Mínimo una, de **1280×800**. Ideas por orden de utilidad:

1. **Antes/después.** Wikipedia partida por la mitad: izquierda en claro, derecha
   con Dark Veil, y el popup encima a la derecha. Es la que vende.
2. **Los ajustes por sitio.** El popup con la etiqueta `propio` visible y el
   selector en "Este sitio". Demuestra la función que te diferencia.
3. **Fotos intactas.** Una página con imágenes de personas, oscurecida, para que
   se vea que las caras conservan el color.

Sin bordes de navegador ni escritorio de fondo: recorta al contenido.

---

## CHECKLIST FINAL

- [ ] `author.email` del manifest cambiado por tu correo real
- [ ] `homepage_url` real, o la línea borrada
- [ ] Cuenta de desarrollador creada y 5 $ pagados
- [ ] Verificación en dos pasos activada
- [ ] Publisher name elegido
- [ ] Correo de contacto público decidido (no tiene que ser el de la cuenta)
- [ ] `privacy-policy.html` publicado y accesible
- [ ] Al menos una captura de 1280×800
- [ ] `dark-veil-store-1.2.0.zip` subido
- [ ] Los tres textos de justificación pegados
- [ ] Non-trader declarado
- [ ] Enviado para revisión
