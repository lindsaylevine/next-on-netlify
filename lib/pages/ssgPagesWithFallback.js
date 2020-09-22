const allNextJsPages = require("../allNextJsPages");

module.exports = allNextJsPages.filter((page) => page.isSsgFallback());
