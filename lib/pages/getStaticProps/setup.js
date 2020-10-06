const { join } = require("path");
const { logTitle, logItem } = require("../../helpers/logger");
const { NETLIFY_PUBLISH_PATH } = require("../../config");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const setupStaticFileForPage = require("../../helpers/setupStaticFileForPage");
const setupNetlifyFunctionForPage = require("../../helpers/setupNetlifyFunctionForPage");
const pages = require("./pages");

// Copy pre-rendered SSG pages
const setup = () => {
  logTitle(
    "🔥 Copying pre-rendered pages with getStaticProps and JSON data to",
    NETLIFY_PUBLISH_PATH
  );

  pages.forEach(({ route, dataRoute }) => {
    logItem(route);

    // Copy pre-rendered HTML page
    const htmlPath = getFilePathForRoute(route, "html");
    setupStaticFileForPage(htmlPath);

    // Copy page's JSON data
    const jsonPath = getFilePathForRoute(route, "json");
    setupStaticFileForPage(jsonPath, dataRoute);

    // Set up the Netlify function (this is ONLY for preview mode)
    const relativePath = getFilePathForRoute(route, "js");
    const filePath = join("pages", relativePath);
    logItem(filePath);
    setupNetlifyFunctionForPage(filePath);
  });
};

module.exports = setup;
