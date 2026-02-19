export const VERCEL_LOGO_SVG =
  "https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg";
export const NETLIFY_LOGO_SVG =
  "https://www.netlify.com/assets/logos/monogram/lightmode/logo-netlify-monogram-fullcolor-lightmode.svg";

export interface DeploymentGuide {
  id: "github-pages" | "vercel" | "netlify";
  platform: string;
  logoSrc?: string;
  logoAlt?: string;
  steps: string[];
}

export const deploymentGuides: DeploymentGuide[] = [
  {
    id: "github-pages",
    platform: "GitHub Pages",
    steps: [
      "From Profolio export, rename the downloaded file to index.html.",
      "Create a GitHub repository and upload index.html to the main branch root.",
      "Go to Settings -> Pages, choose Deploy from branch, then publish from main / (root).",
    ],
  },
  {
    id: "vercel",
    platform: "Vercel",
    logoSrc: VERCEL_LOGO_SVG,
    logoAlt: "Vercel logo",
    steps: [
      "Push your exported index.html to a GitHub repository.",
      "In Vercel, click New Project and import that repository.",
      "Deploy with no build command, then connect your custom domain in Project Settings.",
    ],
  },
  {
    id: "netlify",
    platform: "Netlify",
    logoSrc: NETLIFY_LOGO_SVG,
    logoAlt: "Netlify logo",
    steps: [
      "Create a repo with index.html and connect it via Add new site -> Import from Git.",
      "Set the publish directory to / (root) and deploy.",
      "Add your custom domain in Domain management and enable HTTPS.",
    ],
  },
];
