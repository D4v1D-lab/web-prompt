# web-prompt

**AI-managed static website.** Content is driven by `data/articulos.json` and auto-deploys via AWS Amplify on every `git push`. An AI agent reads `AGENTS.md`, manages articles, images, and layout — no manual editing required.

---

## Prerequisites

- **GitHub account** — to host the repository
- **GitHub Personal Access Token** — with repo read/write permissions ([Settings → Developer settings → Personal access tokens → Fine-grained tokens](https://github.com/settings/tokens))
- **AWS account** — for Amplify hosting (free tier works)
- **Python 3** — for local preview (`python3 -m http.server`)
- **Node.js + npm** — for running the test suite

---

## Setup — step by step

### 1. Fork or clone this repository

```bash
git clone https://github.com/your-username/web-prompt.git
cd web-prompt
```

### 2. Connect to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"Create new app"** → **"Host web app"**
3. Select **GitHub** → authorize → choose your repository and `main` branch
4. Amplify auto-detects `amplify.yml` (no build step)
5. Click **"Save and deploy"** → site is live in ~30 seconds
6. Every `git push` triggers automatic redeployment

### 3. Connect an AI agent

Give your AI agent the **repository URL** and **GitHub token**. The agent reads `AGENTS.md` to learn the project structure, content rules, and workflows.

**Recommended — export the token in your shell:**

```bash
export GITHUB_TOKEN=github_pat_xxxxxxxxxxxx
```

Then share the token with the agent so it can clone, edit, commit, and push on your behalf. The agent will handle everything — adding articles, resizing images, modifying layout, and deploying.

---

## Project structure

```
/
├── index.html              # Main page (carousel + recent posts)
├── single.html             # Article template (?id=X)
├── favicon.png             # Browser tab icon
├── amplify.yml             # AWS Amplify build config
├── data/
│   └── articulos.json      # All articles (JSON array)
├── images/                 # Article images (530×351 px)
├── css/
│   └── style.css           # All styling and layout
├── js/
│   └── scripts.js          # Dynamic rendering, pagination, search
├── paginas/                # Section pages
│   ├── educacion.html
│   ├── empleo.html
│   ├── emprender.html
│   ├── medicina.html
│   ├── testimonios.html
│   ├── quienes-somos.html
│   └── contactos.html
├── qa-tests/               # E2E test definitions (YAML)
│   ├── smoke.yaml
│   ├── navigation.yaml
│   ├── footer.yaml
│   ├── carousel.yaml
│   ├── search.yaml
│   ├── newsletter.yaml
│   ├── responsive.yaml
│   └── run.py              # Interactive test runner
├── AGENTS.md               # Instructions for AI agents
├── playwright.config.ts    # Playwright test configuration
├── tests/                  # E2E test suite (Playwright + TypeScript)
│   ├── smoke.spec.ts
│   ├── navigation.spec.ts
│   ├── carousel.spec.ts
│   ├── recent-posts.spec.ts
│   ├── search.spec.ts
│   ├── share-buttons.spec.ts
│   ├── footer.spec.ts
│   └── responsive.spec.ts
└── README.md
```

---

## Managing content

### Article JSON schema

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | yes | Unique identifier, ascending |
| `titulo` | string | yes | Title (keep under 40 characters) |
| `fecha` | string | yes | Publication date e.g. `"Jun 7, 2026"` |
| `resumen` | string | yes | Short summary shown in recent posts |
| `contenido` | string (HTML) | yes | Full article content (paragraphs, lists, bold) |
| `imagen` | string | yes | Path `images/filename.jpg` |
| `categoria` | string | yes | `educacion`, `empleo`, `emprender`, `medicina`, `noticias` |
| `destacado` | boolean | yes | `true` = carousel; `false` = recent posts with pagination |
| `informacion` | string | no | Optional URL. Renders "For more information" box |

**Example:**

```json
{
  "id": 11,
  "titulo": "New scholarships announced",
  "fecha": "Jun 7, 2026",
  "resumen": "Government opens new scholarship applications.",
  "contenido": "<p>Full article content here.</p>",
  "imagen": "images/new-scholarships.jpg",
  "categoria": "educacion",
  "destacado": true,
  "informacion": "https://example.com/scholarships"
}
```

### Adding articles

1. Resize your image to **530×351 pixels** (required)
2. Save it to `images/` (hyphenated name, no spaces)
3. Add a new entry to `data/articulos.json` (increment `id`, fill all fields)
4. Commit and push:

```bash
git add -A
git commit -m "add article N: title"
git push
```

### Modifying articles

Edit the entry in `data/articulos.json`. If replacing the image, delete the old one and add the new resized version. Commit and push.

### Deleting articles

Remove the entry from `data/articulos.json` and delete the image file:

```bash
git rm images/old-file.jpg
git add -A
git commit -m "remove article N"
git push
```

### Image requirements

- **Resolution:** 530×351 pixels (fixed card size — any other size stretches or crops)
- **Tools:** PIL (Python), Adobe Express, or any image resizer
- **Formats:** `.jpg`, `.png`
- **Naming:** Hyphenated, no spaces (e.g. `new-scholarship.jpg`)
- **Location:** `images/` folder only

### Layout & branding changes

Edit `css/style.css` for colors, fonts, and spacing. Edit `index.html`, `single.html`, and all files in `paginas/` for nav, footer, and logo changes (all 9 files share the same header/footer). See `AGENTS.md` for detailed instructions.

---

## Local development

```bash
python3 -m http.server 3000
```

Open `http://localhost:3000/index.html`. The site requires a server (`file://` won't work — JSON is fetched via `$.getJSON`).

---

## Tests

E2E test suite using Playwright + TypeScript, following the selector stability methodology from Anexo-C-S3.

### Selector priority (most → least stable)

| Rank | Type | Example |
|---|---|---|
| 1 | `data-testid` | `[data-testid="carousel"]` |
| 2 | ID | `#article-content`, `#ubicacion` |
| 3 | Semantic attribute | `input[name="search-term"]`, `img[alt="..."]` |
| 4 | Specific class | `.share-btn.whatsapp`, `.footer` |
| 5 | Hierarchy | `.main .recent .post-preview a` (fragile) |

### Installation

```bash
npm install
npx playwright install chromium
```

### Run tests

**Local** — start the preview server first:

```bash
python3 -m http.server 3000
npx playwright test
```

**Against the live site:**

```bash
BASE_URL=https://main.dl11nb8ahrd81.amplifyapp.com npx playwright test
```

### Test scenarios

| File | What it validates |
|---|---|
| `smoke.spec.ts` | Page loads, header, nav, footer render |
| `navigation.spec.ts` | Nav links navigate to correct pages |
| `carousel.spec.ts` | Carousel slides render and autoplay |
| `recent-posts.spec.ts` | Recent posts section loads with articles |
| `search.spec.ts` | Search filters results, empty state |
| `share-buttons.spec.ts` | Share buttons render on article page |
| `footer.spec.ts` | Contact info, quick links, newsletter form |
| `responsive.spec.ts` | Layout adapts at breakpoints |

---

## Deployment

The site auto-deploys on every push to `main`:

```bash
git push
```

Changes go live on Amplify in ~30 seconds.
