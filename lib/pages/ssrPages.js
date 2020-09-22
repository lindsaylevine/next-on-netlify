const getPagesManifest = require("../helpers/getPagesManifest");
const getDataRoutes = require("../helpers/getDataRoutes");
const ssgPages = require("./ssgPages");
const ssgPagesWithFallback = require("./ssgPagesWithFallback");

// Collect SSR pages
const ssrPages = [];

// Get HTML and SSR pages from the NextJS pages manifest
const pagesManifest = getPagesManifest();
// Get data routes (needed for pages with getServerSideProps)
const routesManifest = getRoutesManifest();
const dataRoutes = routesManifest.dataRoutes || [];

// Parse HTML pages
Object.entries(pagesManifest).forEach(([route, filePath]) => {
  // Ignore HTML files
  if (filePath.endsWith(".html")) return;

  // Skip framework pages, such as _app and _error
  if (["/_app", "/_document", "/_error"].includes(route)) return;

  // Skip page if it is actually an SSG page
  const ssgPage = [...ssgPages, ...ssgPagesWithFallback].find(
    (page) => route in [page.route]
  );
  if (ssgPage) return;

  // Set up SSR page
  const ssrPage = { routes: [route], filePath };

  // Check if we have a data route for this page. This is relevant only for
  // pages with getServerSideProps. We need to add a second route for
  // redirecting requests for the JSON data to the Netlify Function.
  const dataRouteEntry = dataRoutes.find(({ page }) => page === route);
  if (dataRouteEntry) {
    const dataRoute = getDataRoute(route);
    ssrPage.routes.push(dataRoute);
  }

  // Push SSR page
  ssrPages.push(ssrPage);
});

module.exports = ssrPages;
