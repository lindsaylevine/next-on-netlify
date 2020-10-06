const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const pages = require("./pages");

// Pages with getStaticProps should not need redirects, unless they are using
// fallback: true or a revalidation interval. Both are handled by other files.
// However, we now support preview mode for pre-rendered pages (without fallback
// or revalidation), so we create redirects specifically for when preview mode
// is enabled.

const redirects = [];

pages.forEach(({ route, dataRoute, srcRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);

  // Add one redirect for the page, but only when the NextJS
  // preview mode cookies are present
  redirects.push({
    route,
    target: `/.netlify/functions/${functionName}`,
    force: true,
    conditions: [
      "Cookie=__prerender_bypass,__next_preview_data"
    ]
  });

  // @finn - not sure this needs a date route redirect?
});

module.exports = redirects;
