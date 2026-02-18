# Profolio

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
git clone <YOUR_GIT_URL>
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

## Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run test` | Run Vitest tests |
| `bun run lint` | ESLint check |

## Deployment

Deploy the production build (`bun run build` → `dist/`) to any static host:

- **Vercel** — `vercel deploy`
- **Netlify** — drag-and-drop the `dist/` folder
- **GitHub Pages** — push `dist/` to `gh-pages` branch

## License

MIT
