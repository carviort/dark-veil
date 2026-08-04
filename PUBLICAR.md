# Publicar Dark Veil en la Chrome Web Store

## 0. Rellena tus datos primero

En `manifest.json`, sustituye los marcadores:

```json
"author": { "email": "667ccgliese@gmail.com" },
"homepage_url": "https://github.com/carviort/dark-veil",
```

Si no vas a tener repositorio, borra la línea `homepage_url` entera en vez de
dejarla apuntando a una URL que no existe.

**Tu nombre no va en el manifest.** El nombre que la gente ve bajo el título de
la extensión en la tienda es el **Publisher name** de tu cuenta de desarrollador,
que configuras en el panel. El campo `author` del manifest es solo el correo de
contacto y debe coincidir con el de la cuenta.

## 1. La cuenta de desarrollador

Panel: https://chrome.google.com/webstore/devconsole

<cite index="1-1">Necesitas una cuenta de Google y una cuota de registro única de 5 $</cite>. <cite index="7-1">No hay renovación anual: pagas una vez en tu vida como desarrollador de extensiones y esa cuota cubre todo tu catálogo</cite>.

Tres decisiones que pesan más de lo que parece:

- **El correo es permanente.** No se puede cambiar después. <cite index="6-1">La recomendación oficial de Google es usar una cuenta de correo nueva dedicada solo a publicar</cite>, para que tu presencia en la tienda no quede soldada a tu bandeja personal.
- **La verificación en dos pasos es obligatoria** en esa cuenta de Google.
- **El Publisher name** es lo que verá todo el mundo. Puede ser tu nombre real, un
  alias o un nombre de estudio. Si además verificas un dominio propio, puedes
  mostrar una URL oficial en su lugar.

## 2. Numeración de versiones

`"version": "1.0.0"` — hasta cuatro números separados por puntos, cada uno entre
0 y 65535. La regla que importa: **cada subida debe tener un número mayor que la
anterior**. Si intentas resubir con la misma versión, el panel lo rechaza al
instante.

Convención sensata:

| Cambio | Sube | Ejemplo |
|---|---|---|
| Arreglar un fallo | tercer número | 1.0.0 → 1.0.1 |
| Añadir una función | segundo número | 1.0.1 → 1.1.0 |
| Rehacer el funcionamiento | primer número | 1.1.0 → 2.0.0 |

Existe además `"version_name"` opcional, solo para mostrar: te deja poner
`"1.0.0 beta"` mientras `version` sigue siendo `1.0.0`.

## 3. Empaqueta el ZIP correctamente

**El `manifest.json` debe estar en la raíz del ZIP**, no dentro de una carpeta.
Si comprimes la carpeta `dark-veil` desde el explorador, el ZIP contendrá
`dark-veil/manifest.json` y la subida fallará.

Desde dentro de la carpeta:

```bash
cd dark-veil
zip -r ../dark-veil-1.0.0.zip . -x "*.md" ".*" "__MACOSX/*"
```

El ZIP `dark-veil-store-1.0.0.zip` que te dejé ya está montado así.

## 4. El punto delicado: `<all_urls>`

Esta extensión tiene que poder actuar en cualquier web — es su razón de ser — así
que `<all_urls>` es inevitable. Pero <cite index="11-1">los patrones de permisos de host como `*://*/*`, `https://*/*` y `<all_urls>` dan a la extensión acceso amplio a la actividad de navegación del usuario, y las revisiones tardan más para las extensiones que los solicitan</cite>.

No es motivo de rechazo por sí solo. Lo que hunde las solicitudes es pedirlos sin
justificar, o pedir permisos que no se usan. <cite index="13-1">La política es pedir el permiso más estrecho posible: si una función se puede implementar con más de un permiso, hay que elegir el que menos acceso a datos otorga</cite>.

Por eso quité `scripting` (declarado pero nunca invocado) y `activeTab`
(redundante al tener ya `host_permissions`). Ahora quedan dos permisos y ambos se
usan de verdad.

### Textos para los campos de justificación

Van **en inglés**: es el idioma en el que revisa el equipo de Google, y la
claridad ahí te ahorra semanas. <cite index="17-1">Escribe una justificación específica y detallada para cada permiso amplio, no un "necesario para el funcionamiento", y asegúrate de que tu política de privacidad concuerda: los desajustes entre lo que hace el código y lo que declaras son un camino rápido al rechazo</cite>.

**Single purpose** (propósito único):

> Dark Veil has one purpose: to render websites in a dark colour scheme. It
> applies a CSS filter to the page so that light backgrounds become dark and text
> becomes light, and applies the mathematically inverse filter to images and
> videos so their original colours are preserved. It does nothing else.

**Justificación de `storage`:**

> Stores the user's preferences locally: whether dark mode is on, the brightness
> and contrast values, the rendering method, and the per-domain on/off list.
> These settings must persist between browsing sessions. All data stays in
> chrome.storage.local on the user's device and is never transmitted anywhere.

**Justificación de `host_permissions` (`<all_urls>`):**

> The extension's single feature is applying a dark colour scheme to web pages,
> and users expect it to work on any site they visit, not a predetermined list.
> There is no way to know in advance which sites a user will want darkened, so
> narrower host patterns cannot implement this feature. The content script only
> injects a <style> element containing CSS filter rules and, optionally, adds a
> CSS class to elements that have a background-image. It never reads page text,
> form fields, cookies or credentials, makes no network requests, and transmits
> no data. Users can disable the extension per-domain from the popup.

**Uso de datos** — marca que **no** recoges ninguna de las categorías, y firma
las tres declaraciones (no vendes datos a terceros, el uso concuerda con el
propósito único, no usas los datos para evaluar solvencia ni préstamos).

## 5. Política de privacidad

Hace falta una URL pública. Un Gist de GitHub o una página de GitHub Pages sirven
perfectamente. Texto suficiente para esta extensión:

> **Dark Veil — Privacy Policy**
>
> Dark Veil does not collect, store or transmit any personal data.
>
> The extension saves your display preferences (on/off state, brightness,
> contrast, warmth, rendering method, and the list of domains where you have
> enabled or disabled it) using the browser's local storage API. This data never
> leaves your device and is not accessible to the developer or to any third
> party.
>
> Dark Veil makes no network requests, contains no analytics, no tracking and no
> remote code. It does not read the content of the pages you visit; it only
> injects CSS rules that change how they are displayed.
>
> Contact: 667ccgliese@gmail.com
> Last updated: [fecha]

Que coincida palabra por palabra con lo que declares en el panel.

## 6. Material gráfico

Prepáralo antes de empezar el formulario, porque no puedes enviar sin ello:

| Elemento | Tamaño | ¿Obligatorio? |
|---|---|---|
| Icono de tienda | 128×128 PNG | Sí (ya lo tienes) |
| Capturas | 1280×800 o 640×400 | Sí, mínimo 1, máximo 5 |
| Mosaico promocional pequeño | 440×280 | Solo si quieres optar a destacados |

Para las capturas, lo que mejor funciona en una extensión de modo oscuro es el
antes/después: la misma página conocida a la izquierda en claro y a la derecha
en oscuro, con el popup encima. Sin bordes del navegador ni escritorio de fondo.

## 7. La descripción de la ficha

Concreta gana a vistosa. Compara:

- ❌ «La mejor experiencia de navegación nocturna»
- ✅ «Oscurece cualquier web al instante. A diferencia de otros modos oscuros, las
  fotos y los vídeos conservan sus colores reales gracias a un filtro inverso
  exacto. Ajusta brillo, contraste y calidez, o desactívalo por sitio con
  Alt+Shift+D.»

## 8. Envía y espera

Revisión típica: de un día a unos pocos. Con `<all_urls>` y cuenta nueva, cuenta
con más. <cite index="16-1">Las cuentas de desarrollador nuevas tardan más y los permisos amplios requieren una revisión más profunda</cite>.

Si te rechazan, el correo indica la política concreta. <cite index="16-1">La recomendación es no discutir: corrige el problema y vuelve a enviar</cite>. Ten en cuenta que <cite index="17-1">solo se permite una apelación por infracción</cite>, así que resérvala para cuando estés seguro de que el revisor se ha equivocado.

## 9. Distribuir sin publicar

Tres visibilidades disponibles, y las dos últimas no requieren pasar por la
ficha pública:

- **Pública** — aparece en búsquedas de la tienda.
- **No listada** — solo accesible con el enlace directo. Ideal para enseñárselo a
  gente sin exponerlo. Pasa igualmente la revisión.
- **Privada** — solo para cuentas o dominio que tú indiques.

Si únicamente quieres que la usen tú y cuatro amigos, «no listada» te ahorra
buena parte de la fricción de la ficha pública.

## Checklist antes de enviar

- [ ] `author.email` y `homepage_url` rellenados o eliminados
- [ ] `version` mayor que la subida anterior
- [ ] `manifest.json` en la raíz del ZIP
- [ ] Sin permisos declarados que no se usen
- [ ] Política de privacidad publicada en una URL accesible
- [ ] Justificaciones pegadas en los tres campos
- [ ] Al menos una captura de 1280×800
- [ ] Probada en 5–6 sitios distintos, incluyendo uno con vídeo y uno ya oscuro
