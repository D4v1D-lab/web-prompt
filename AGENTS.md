# AGENTS — web-prompt

Instructions for AI agents connected to this project. Covers content management, layout modification, authentication, and deployment.

---

## Project type

Static HTML/CSS/JS website. Content is driven by `data/articulos.json` loaded client-side via `$.getJSON('/data/articulos.json')`. Deployed on AWS Amplify. Auto-deploys on `git push` to `main`. The repo is already connected to Amplify — every push automatically deploys.

---

## File map

| File | Purpose |
|---|---|
| `index.html` | Main page. Nav, carousel (`id="noticias"`), recent posts, footer. No hardcoded articles. |
| `single.html?id=X` | Article detail page. Reads `?id=X` param, renders matching article from JSON. |
| `data/articulos.json` | **Single source of truth** for all articles. Array of objects. |
| `js/scripts.js` | Fetches JSON, renders carousel (`renderCarousel`), recent posts (`renderRecentPosts`), handles pagination (`currentPage` var) and search (`initSearch`). Also handles `renderArticle` for single.html. |
| `css/style.css` | All styling. Colors, layout, responsive breakpoints, footer, carousel. |
| `amplify.yml` | AWS Amplify build config (no build step, just serve static files). |
| `favicon.png` | 32×32 browser tab icon. Referenced via `<link rel="icon">` in every HTML file. |
| `images/` | Article images. **Always 530×351 pixels.** |
| `paginas/` | Section pages (educacion, empleo, emprender, medicina, testimonios, quienes-somos, contactos). Each has own header/nav/footer. |
| `qa-tests/*.yaml` | E2E test definitions for qa-use CLI. |

---

## Article JSON schema

```json
{
  "id": 1,
  "titulo": "Title (max ~40 chars)",
  "fecha": "Jun 7, 2026",
  "resumen": "Short summary for recent posts",
  "contenido": "<p>HTML content — paragraphs, lists, bold</p>",
  "imagen": "images/file.jpg",
  "categoria": "educacion",
  "destacado": true,
  "informacion": "https://optional-link.com"
}
```

### Field constraints

| Field | Type | Rules |
|---|---|---|
| `id` | integer | Unique, ascending. Use `max(existing ids) + 1` for new entries. |
| `titulo` | string | Keep under 40 characters to avoid wrapping in carousel cards. |
| `fecha` | string | Spanish abbreviation: Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic. Format: `"Jun 7, 2026"` |
| `imagen` | string | Must reference a real file in `images/`. Never use external URLs. |
| `destacado` | boolean | `true` = carousel (max 5 recommended). `false` = recent posts section (paginated, 3 per page). |
| `informacion` | string | Optional. If present, renders a blue-left-border "Para más información" box at the bottom of the article page. |

---

## Content workflows

### Add a new article

1. **Resize image** to 530×351 using PIL:
   ```python
   from PIL import Image
   img = Image.open('source.png')
   img = img.resize((530, 351), Image.LANCZOS)
   img.save('images/your-file.png')
   ```
2. **Save image** to `images/` (hyphenated name, no spaces).
3. **Add JSON entry** to `data/articulos.json` — increment `id`, fill all required fields.
4. **Test locally** (optional):
   ```bash
   python3 -m http.server 3000
   ```
5. **Commit & push**:
   ```bash
   git add -A
   git commit -m "add article N: title"
   git push
   ```

### Delete an article

1. Remove the article object from `data/articulos.json`.
2. Delete the image file from `images/`.
3. Commit & push:
   ```bash
   git rm images/deleted-file.jpg
   git add -A
   git commit -m "remove article N"
   git push
   ```

### Modify an article

1. Edit the entry in `data/articulos.json`.
2. If replacing the image: delete old image, add new (resized) image.
3. Commit & push.

---

## Modifying the layout / branding

The agent can modify the website's look and feel by editing `css/style.css` and the HTML files. Below are all customizable elements.

### Colors

The primary brand color is **blue `rgb(6, 147, 194)`** used in:
- Header background (line 41 in `style.css`)
- Buttons (line 15)
- Section titles throughout the pages
- Links (the `a` selector at line 4)
- Footer background (line 278)
- Sidebar section headers

The secondary background is **cream `rgb(254, 254, 220)`** (body background, line 51).

**To rebrand**: Replace `rgb(6, 147, 194)` with your brand color across the entire `style.css` file (20+ occurrences). Use the same hue for consistency.

### Fonts

Two Google Fonts are loaded in every HTML `<head>`:
- **Kreon** — used for headings (`h1`–`h5`) (serif, display)
- **Josefin Sans** — used for body text and content (sans-serif)

**To change fonts**: Edit the Google Fonts `<link>` tags and the `font-family` rules in `style.css`:
- `h1`, `h2`, `h3`, `h4`, `h5` → `font-family: 'Kreon';`
- `.footer .footer-content` → `font-family: 'Josefin Sans';`

### Logo / header text

Found inside `<header>` in every HTML file (9 files total):
```html
<h2 class="text-logo"><span>Autosuficiencia</span> Los Chillos</h2>
```
The `<span>` part is colored yellow via CSS (`.header .text-logo span` at line 114 of `style.css`).

**To change**: Edit the `<h2>` text in all 9 files: `index.html`, `single.html`, `paginas/*.html`.

### Footer content

Contains: phone, email, Facebook link. Edit in all 9 files:
```html
<span><a href="https://wa.me/+593989448049" style="color: inherit; text-decoration: none;"><i class="fas fa-phone"></i></a> +593 989 448 049</span>
<span><a href="mailto:centroserecursosloschillos@gmail.com" style="color: inherit; text-decoration: none;"><i class="fas fa-envelope"></i></a> centroserecursosloschillos@gmail.com</span>
<span><i class="fab fa-facebook-f"></i> facebook.com/autosuficiencia.loschillos</span>
```

The "Grupo de Whatsapp" link in `.footer .section.links ul` currently points to `#` — it has no URL configured yet.

### Navigation menu

The `<ul class="nav">` in the `<header>` is identical across all 9 HTML files. To add, remove, or rename navigation items, edit the `<li>` elements in every file.

Current structure:
- **Página principal** → `index.html`
- **Noticias** → `index.html#noticias`
- **Contactos** → `paginas/contactos.html`
- **Temas** (dropdown) → `paginas/educacion.html`, `empleo.html`, `emprender.html`, `medicina.html`, `testimonios.html`

### Section pages

Located in `paginas/`. Each has:
- A matching `<h1>` with the section title
- Content in a `<div>` below the `<h1>`
- A "Volver a la página principal" button linking to `../index.html`

**To add a new section page**: Create `paginas/new-section.html`, copy the header/footer from an existing page, and add the link to all nav menus.

### Meta tags

Site description for search engines and social sharing — edit in `<head>` of `index.html`:
- `<meta name="description" content="...">`
- `<meta name="keywords" content="...">`
- `<meta property="og:title" content="...">`
- `<meta property="og:description" content="...">`

### Favicon

`favicon.png` (32×32 PNG) at the project root. Referenced via `<link rel="icon" type="image/png" href="favicon.png">` (root files) or `href="../favicon.png"` (pages in `paginas/`).

### Carousel vs recent posts logic

Controlled by the `destacado` field:
- **`destacado: true`** → appears in the Slick carousel slider at the top of the main page
- **`destacado: false`** → appears in "Contenido reciente" (recent posts) with pagination
- Pagination shows **3 posts per page**, with page number buttons and prev/next arrows
- Pagination controls only render when there are **4+ non-destacado articles**
- Slick carousel configuration is in `js/scripts.js` inside `renderCarousel()`. Current settings: 3 slides, autoplay 2s, responsive breakpoints at 1290px (2 slides) and 825px (1 slide).

### Adding new sections to the main page

To add a new section to `index.html` (between the main content area and the footer):
1. Add the HTML for the new section after line 96 (`</div>` closes page-content)
2. If needed, add a nav link pointing to the section's `id`

---

## Image rules (CRITICAL)

- **Always resize to 530×351 pixels** before committing. The card container is exactly this size.
- Use `PIL.Image.LANCZOS` for high-quality downscaling.
- Allowed formats: `.jpg`, `.png`.
- Name files with hyphens, no spaces: `new-image.jpg`.
- Images go in `images/` folder, never in `paginas/` or other directories.

---

## Path conventions

| File location | Asset paths |
|---|---|
| `index.html`, `single.html` | `css/style.css`, `js/scripts.js`, `data/articulos.json`, `favicon.png` (root-relative) |
| `paginas/*.html` | `../css/style.css`, `../js/scripts.js`, `../favicon.png` |
| JSON `"imagen"` field | Always `images/file.jpg` (root-relative — same path from any page) |
| `scripts.js` JSON fetch | `/data/articulos.json` (absolute root path — works from any subfolder) |

---

## Common gotchas

1. **JSON escaping**: Inside a JSON string value, double quotes must use `&quot;` not `"`. Newlines in content must use `<br>` or `<p>` tags, not literal `\n`.
2. **Image sizing**: The card container is fixed at 530×351. Any other size stretches or crops the image.
3. **Static server required**: The JSON file is loaded via `$.getJSON()`. This does NOT work from `file://` protocol — you must use `python3 -m http.server 3000` or deploy.
4. **Favicon**: Must exist at `favicon.png` (root). Every HTML file has a `<link rel="icon">` pointing to it.
5. **Slick carousel**: Initialized after JSON loads in `scripts.js`. Load order in `index.html`: jQuery → Slick CSS/JS → scripts.js. If order changes, carousel won't initialize.
6. **Multi-file edits for layout changes**: Layout changes (logo, nav, footer) require editing ALL 9 HTML files (index.html, single.html, paginas/*.html). Always edit all instances.
7. **Agent must never guess URLs**: Always use the JSON source, project files, or README for reference. Never invent file paths or URLs.

---

## Testing

```bash
cd /path/to/project
python3 -m http.server 3000
# Open http://localhost:3000/index.html
```

Verify: carousel loads, recent posts show, click an article → single.html renders correctly, search filters, pagination works.

---

## Deployment

```bash
git push
```

AWS Amplify auto-deploys `main` branch. Allow ~30 seconds for deployment.

---

## QA tests

YAML files in `qa-tests/`. Written for the qa-use CLI tool. Update the `url` field in each file if the domain changes. Tests cover: smoke, navigation, responsive, footer, carousel, search, newsletter.
