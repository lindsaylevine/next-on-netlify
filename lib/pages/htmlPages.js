const getPagesManifest = require("../helpers/getPagesManifest");
const ssgPages = require("./ssgPages");
const ssgPagesWithFallback = require("./ssgPagesWithFallback");

// Collect HTML pages
const htmlPages = [];

// Get HTML and SSR pages from the NextJS pages manifest
const pagesManifest = getPagesManifest();

// Parse HTML pages
Object.entries(pagesManifest).forEach(([route, filePath]) => {
  // Ignore non-HTML files
  if (!filePath.endsWith(".html")) return;

  // Skip page if it is actually an SSG page
  const ssgPage = [...ssgPages, ...ssgPagesWithFallback].find(
    (page) => route in [page.route]
  );
  if (ssgPage) return;

  // Add the HTML page
  htmlPages.push({ routes: [route], filePath });
});

module.exports = htmlPages;
