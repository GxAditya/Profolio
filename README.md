
<div align="center">
	<img src="public/profolio-logo.png" alt="Profolio Logo" width="200" />
</div>

<h1 align="center">Profolio</h1>

<div align="center">
	<a href="LICENSE">
		<img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
	</a>
</div>

**PDF in. Portfolio out.**

Profolio turns your LinkedIn PDF export into a polished, live developer portfolio in minutes. Upload your resume, pick a template, tweak anything inline, and publish — no coding required.

---

## Features

- **LinkedIn PDF parsing** — automatically extracts your work experience, education, skills, and projects
- **10+ curated templates** — Minimalism, Glassmorphism, Cyberpunk, Neobrutalism, Claymorphism, Retro, and more
- **Inline editing** — click any text on the preview to edit it directly
- **Export** — download your portfolio as a self-contained HTML file, ready to host anywhere

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| PDF Parsing | pdf.js |
| Testing | Vitest |

## Getting Started

```sh
# 1. Clone the repo
git clone https://github.com/GxAditya/Profolio
cd profolio

# 2. Install dependencies (Bun recommended)
bun install
# or: npm install

# 3. Start the dev server
bun run dev
# or: npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── templates/      # Portfolio template components
│   └── ui/             # shadcn/ui primitives
├── context/            # React context (ResumeContext)
├── hooks/              # Custom hooks
├── lib/                # PDF parsing & export utilities
├── pages/              # Route-level pages
└── types/              # TypeScript types
```


## How to Deploy Your Exported Portfolio

After building your portfolio and exporting it as HTML:

1. **Export your portfolio HTML**
	- Use Profolio's export feature to download your portfolio as a single `index.html` file.

2. **Deploy on your static host**
	- **GitHub Pages:** Create a new repository, upload `index.html`, and enable GitHub Pages in repository settings.
	- **Vercel:** Drag and drop your `index.html` into a new Vercel project or deploy via the Vercel dashboard.
	- **Netlify:** Drag and drop your `index.html` onto the Netlify dashboard or use the Netlify CLI.

3. **Connect your custom domain (optional)**
	- Follow your hosting provider's instructions to add a custom domain.

Your exported portfolio is a fully static HTML file and can be hosted anywhere that serves static files.

---
