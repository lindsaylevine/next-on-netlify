// TEMPLATE: This file will be copied to the Netlify functions directory when
//           running next-on-netlify

// Compatibility wrapper for NextJS page
const compat = require("next-aws-lambda");
// Load the NextJS page
const page = require("./nextJsPage");

// next-aws-lambda is made for AWS. There are some minor differences between
// Netlify and AWS which we resolve here.
const callbackHandler = (callback) =>
  // The callbackHandler wraps the callback
  (argument, response) => {
    // Convert header values to string. Netlify does not support integers as
    // header values. See: https://github.com/netlify/cli/issues/451
    Object.keys(response.multiValueHeaders).forEach((key) => {
      response.multiValueHeaders[key] = response.multiValueHeaders[
        key
      ].map((value) => String(value));
    });

    // NextJS by default sets Cache-Control to the max age. Without this
    // override, the Netlify function will cache the very first page render.
    // TO-DO: set this *only* for SSG'd pages
    response.multiValueHeaders["cache-control"] = ["no-cache"];

    // Invoke callback
    callback(argument, response);
  };

exports.handler = (event, context, callback) => {
  // Enable support for base64 encoding.
  // This is used by next-aws-lambda to determine whether to encode the response
  // body as base64.
  if (!process.env.hasOwnProperty("BINARY_SUPPORT")) {
    process.env.BINARY_SUPPORT = "yes";
  }

  // Get the request URL
  const { path } = event;
  console.log("[request]", path);

  // Render the page
  compat(page)(
    {
      ...event,
      // Required. Otherwise, compat() will complain
      requestContext: {},
    },
    context,
    // Wrap the Netlify callback, so that we can resolve differences between
    // Netlify and AWS (which next-aws-lambda optimizes for)
    callbackHandler(callback)
  );
};
