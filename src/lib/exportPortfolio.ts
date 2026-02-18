/**
 * Exports the currently rendered portfolio as a fully standalone HTML file.
 *
 * Strategy:
 * 1. Grab the innerHTML of the rendered template container element.
 * 2. Collect every <style> tag Vite has injected into the page
 *    (Tailwind utilities, CSS modules, component styles — all of it).
 * 3. Collect every <link rel="stylesheet"> from the document head
 *    (Google Fonts, etc.).
 * 4. Strip out any editable controls (drag handles, add-section buttons,
 *    delete/edit overlays) so the exported file is clean.
 * 5. Write a self-contained <!DOCTYPE html> and trigger a browser download.
 */

function collectStyles(): { styles: string; linkTags: string } {
  let styles = "";
  let linkTags = "";

  // All injected <style> blocks (Tailwind, CSS modules, etc.)
  document.querySelectorAll<HTMLStyleElement>("head style").forEach((el) => {
    styles += el.innerHTML + "\n";
  });

  // External stylesheets (Google Fonts, etc.)
  document
    .querySelectorAll<HTMLLinkElement>('head link[rel="stylesheet"]')
    .forEach((el) => {
      linkTags += `<link rel="stylesheet" href="${el.href}" />\n  `;
    });

  return { styles, linkTags };
}

/** CSS selectors for UI-only elements that should not appear in the export */
const EDITOR_SELECTORS = [
  "[data-editable-controls]",
  "[data-add-section]",
  "[data-drag-handle]",
  "[data-delete-btn]",
  "[data-section-builder]",
  // generic: any element that only exists in edit mode
  ".edit-only",
];

function cleanHtml(rawHtml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");

  EDITOR_SELECTORS.forEach((sel) => {
    doc.querySelectorAll(sel).forEach((el) => el.remove());
  });

  // Remove contenteditable attributes so the page is read-only
  doc.querySelectorAll("[contenteditable]").forEach((el) => {
    el.removeAttribute("contenteditable");
  });

  // Remove event-handler attributes (onclick, etc.) – none expected but safety first
  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith("on")) el.removeAttribute(attr.name);
    });
  });

  return doc.body.innerHTML;
}

export function exportPortfolioAsHtml(
  containerEl: HTMLElement,
  profileName = "Portfolio"
): void {
  const { styles, linkTags } = collectStyles();
  const cleanedBody = cleanHtml(containerEl.innerHTML);

  const safeFilename =
    profileName.trim().replace(/[^a-z0-9_-]/gi, "-").toLowerCase() ||
    "portfolio";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${profileName} — Portfolio</title>
  ${linkTags}
  <style>
    /* ── Captured styles from the Profolio builder ── */
    ${styles}

    /* Ensure the page fills the viewport just like in the preview */
    html, body { margin: 0; padding: 0; min-height: 100%; }
  </style>
</head>
<body>
${cleanedBody}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeFilename}-portfolio.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}
