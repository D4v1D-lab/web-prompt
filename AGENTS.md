# AGENTS — Autosuficiencia Los Chillos

## Project type
Static HTML/CSS/JS website. Article content is driven by a JSON file loaded client-side. Deployed on AWS Amplify. Auto-deploys on `git push` to `main`.

## Key files and their roles

| File | Purpose |
|---|---|
| `index.html` | Main page. Nav, carousel, recent posts, footer. No hardcoded articles. |
| `single.html?id=X` | Article detail. Reads `?id=X` param, renders from JSON. |
| `data/articulos.json` | **Single source of truth** for all articles. Array of objects. |
| `js/scripts.js` | Fetches `/data/articulos.json`, renders carousel & recent posts, handles pagination + search. |
| `css/style.css` | All styling. Footer button colors at ~line 284-292. |
| `amplify.yml` | Build config for AWS Amplify (static site, no build step). |
| `favicon.png` | Browser tab icon (32×32 PNG at root). Added via `<link rel="icon">` in every HTML file. |
| `paginas/*.html` | Section pages (educacion, empleo, emprender, medicina, testimonios, quienes-somos, contactos). Each has its own content + nav + footer. |
| `qa-tests/*.yaml` | E2E test definitions. Update `url` field if domain changes. |
| `images/` | Article images. All must be **530×351** pixels. |
| `Readme.txt` | Legacy image resize notes (keep for reference). |

## Article JSON schema

```json
{
  "id": 1,                    // integer, unique, ascending
  "titulo": "Title",          // string, keep short (~40 chars max)
  "fecha": "Jun 7, 2026",     // string, Spanish month
  "resumen": "Summary...",    // string, shown in recent posts
  "contenido": "<p>HTML</p>", // string, HTML allowed (paragraphs, lists, bold)
  "imagen": "images/file.jpg",// string, path relative to root
  "categoria": "educacion",   // string: educacion|empleo|emprender|medicina|noticias
  "destacado": true,          // boolean: true=carousel, false=recent posts
  "informacion": "https://..." // optional string, renders styled "Más información" box
}
```

### Field constraints
- **id**: must be unique. Use `max(existing ids) + 1`.
- **titulo**: keep under 40 characters to avoid wrapping in carousel cards.
- **fecha**: format like `"Jun 7, 2026"` (Spanish month abbreviations: Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic).
- **imagen**: must reference a file in `images/`. Never use URLs or paths outside images/.
- **destacado**: articles with `true` appear in the **carousel**. Articles with `false` appear in **Contenido reciente** section with pagination.
- **informacion**: if present, renders a blue-left-border box with the link at the bottom of the article page.

## Add a new article

1. **Resize image** to 530×351 using:
   ```python
   from PIL import Image
   img = Image.open('source.png')
   img = img.resize((530, 351), Image.LANCZOS)
   img.save('images/your-file.png')
   ```
2. **Save image** to `images/` with a descriptive filename (no spaces, use hyphens).
3. **Add JSON entry** to `data/articulos.json` — increment `id`, set all required fields.
4. **Test locally**: `python3 -m http.server 3000`
5. **Commit & push**:
   ```bash
   git add -A
   git commit -m "add article N: titulo"
   git push
   ```

## Delete an article

1. Remove the entry from `data/articulos.json`.
2. Delete the image file from `images/`.
3. Commit & push:
   ```bash
   git rm images/deleted-file.jpg
   git add -A
   git commit -m "remove article N"
   git push
   ```

## Modify an article

1. Edit the entry in `data/articulos.json`.
2. If replacing the image, delete the old one and add the new (resized) one.
3. Commit & push.

## Image rules (CRITICAL)
- **Always** resize to **530×351** pixels before committing.
- Use `PIL.Image.LANCZOS` for high-quality downscaling.
- Allowed formats: `.jpg`, `.png`.
- Name with hyphens, no spaces: `mi-imagen.jpg`.

## Path conventions
- Root files (`index.html`, `single.html`): reference assets as `css/style.css`, `js/scripts.js`, `data/articulos.json`, `favicon.png`.
- `paginas/*.html` files: reference assets as `../css/style.css`, `../js/scripts.js`, `../favicon.png`.
- JSON `"imagen"` field: always `images/file.jpg` (root-relative, same from both root and paginas/ pages).

## Common gotchas

1. **JSON escaping**: Inside a JSON string value, double quotes must be `&quot;` not `"`. Newlines in content should use `<br>` or `<p>` tags, not `\n`.
2. **Image sizing**: The card container is fixed at 530×351. Any other size stretches or crops. Use PIL to resize.
3. **Static server required**: `data/articulos.json` is loaded via `$.getJSON('/data/articulos.json')`. This does NOT work from `file://` protocol — use a local server or deploy.
4. **Favicon**: Must exist at `favicon.png` (root). Every HTML file has `<link rel="icon">` pointing to it.
5. **Slick carousel**: Initialized in `scripts.js` inside `renderCarousel()`, which is called after the JSON loads. If slick is not loaded before the JSON callback, the carousel won't initialize. Current load order (index.html): jQuery → Slick CSS/JS → scripts.js.
6. **Contactos link**: The "Grupo de Whatsapp" link in footers points to `#` — it has no URL configured (waiting for user to add).
7. **Pagination**: Only shows when there are 4+ `"destacado": false` articles. 3 articles per page, page number buttons with ← → arrows.

## Testing
```bash
cd /path/to/project
python3 -m http.server 3000
# Open http://localhost:3000/index.html
```

## Deployment
```bash
git push
```
AWS Amplify auto-deploys `main` branch. Live at:
https://main.d3lo0zn2l3toh2.amplifyapp.com
Allow ~30 seconds after push for deployment.

## QA tests
YAML files in `qa-tests/`. Tests are written for the qa-use CLI tool. Each file has a `url` field — update this when changing domains. Tests cover: smoke, navigation, responsive, footer, carousel, search, newsletter.
