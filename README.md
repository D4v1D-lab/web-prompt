# web-prompt

**AI-driven static website.** This project is a template for building and managing a static website entirely through AI agent prompts. An AI agent (Claude, GPT, etc.) reads/writes `data/articulos.json` as the content source, manages images, and pushes changes to GitHub. AWS Amplify auto-deploys on every push.

No manual HTML editing required — just prompt the agent, and it handles the rest.

## Quick start

1. **Fork or clone** this repository
2. **Create a GitHub Personal Access Token** for your agent (Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens, scope: `Repository` with read/write permissions on your fork)
3. **Connect to AWS Amplify** (see below)
4. **Give your AI agent** the repo URL + token — you can then say "add an article about..." and the agent will edit JSON, resize images, commit, and push

## Prerequisites

- **GitHub account** — to host the repository
- **GitHub Personal Access Token** — so the AI agent can commit and push changes
- **AWS account** — to host on AWS Amplify (free tier works)

## Connecting AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"Create new app"** → **"Host web app"**
3. Select **GitHub** → authorize → choose your repository and `main` branch
4. Amplify auto-detects `amplify.yml` (no build step needed)
5. Click **"Save and deploy"** → site is live in ~30 seconds at `https://main.xxxxxxxxx.amplifyapp.com`
6. Every `git push` triggers an automatic redeployment

## Using an AI agent

Once connected, you can give your agent prompts like:

- *"Add a new article about scholarships with this information: ..."*
- *"Update article 5 with a new title and different image"*
- *"Delete article 3 because it's outdated"*
- *"Change the website's primary color to green"*
- *"Add a new section page for volunteering"*

The agent reads `data/articulos.json`, follows the schema rules, resizes images to the correct size, commits, pushes, and the site auto-deploys.

## File structure

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
└── README.md
```

## Article JSON schema

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
| `informacion` | string | no | Optional URL. Renders "For more information" box with styled link |

### Example

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

## Images

All images must be **530×351 pixels**. Resize before adding to `images/`. Recommended tools:

- **Adobe Express:** https://www.adobe.com/express/feature/image/resize
- **Simple Image Resizer:** https://www.simpleimageresizer.com/upload

Allowed formats: `.jpg`, `.png`. Name files with hyphens, no spaces.

## QA Testing

E2E browser tests powered by [`qa-use`](https://desplega.ai). Test definitions are in `qa-tests/` as YAML files.

### Test suites

| Suite | Location | Description |
|---|---|---|
| **Autosuficiencia** | `qa-tests/*.yaml` | Smoke, navigation, footer, carousel, search, newsletter, responsive |

### Installation

Make sure you have Node.js and npm installed (WSL):

```bash
sudo apt update && sudo apt install nodejs npm -y
npm install -g @desplega.ai/qa-use
qa-use install-deps
```

Export your API key (add to `~/.bashrc` to make it permanent):

```bash
export QA_USE_API_KEY=sk_qfm_98ec9c584f3d46cd8b69a385fdab9b25
```

### Running tests — interactive menu (recommended)

Launch the menu-driven runner to pick individual tests, a category, or run all:

```bash
python3 qa-tests/run.py
```

Options in the menu:
- Select a **category** to run all tests in that group
- Choose **ALL categories** to run every test
- Pick **individual tests** by entering numbers separated by spaces

### Running tests — direct CLI

Run a single test file:

```bash
qa-use test run qa-tests/smoke.yaml
```

Run all autosuficiencia tests:

```bash
qa-use test run qa-tests/smoke.yaml && \
qa-use test run qa-tests/navigation.yaml && \
qa-use test run qa-tests/footer.yaml && \
qa-use test run qa-tests/carousel.yaml && \
qa-use test run qa-tests/search.yaml && \
qa-use test run qa-tests/newsletter.yaml && \
qa-use test run qa-tests/responsive.yaml
```

### Test structure

Each YAML file follows this format:

```yaml
name: Test Name
description: What it validates
tags:
  - category
  - priority
variables:
  key: value           # reusable parameters
steps:
  - action: goto       # navigate to URL
    url: ...
  - action: click      # click element (by ARIA label)
    target: ...
  - action: fill       # type into input
    target: ...
    value: $var
  - action: to_be_visible  # assert element is visible
    target: ...
```

Available actions: `goto`, `click`, `fill`, `type`, `press`, `check`, `uncheck`, `select`, `to_be_visible`, `to_be_hidden`, `to_have_text`, `to_have_value`, `wait`, `wait_for_url`, `reload`, `back`, `forward`, `ai_action`, `ai_assertion`.

### Local development (autosuficiencia site)

```bash
python3 -m http.server 3000
```

Open `http://localhost:3000/index.html` in your browser. Note: does NOT work from `file://` protocol — the site requires a server to load the JSON file.

## Deployment

The live site auto-updates on every `git push` to `main`:

```bash
git push
```

Deployment takes ~30 seconds via AWS Amplify.
