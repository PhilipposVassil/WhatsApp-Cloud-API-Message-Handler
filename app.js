"use strict";

// Import dependencies and set up http server
const express = require("express"),
    crypto = require("crypto"),
    config = require("./services/config"),
    app = express();

// Set template engine in Express
app.set("view engine", "ejs");

// Parse application/json. Verify that callback came from Facebook
// Keep the raw bytes for signature checking, and still parse JSON
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

// Add support for GET requests to our webhook
app.get("/webhook", (req, res) => {
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === config.verifyToken) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Verify that the callback came from Facebook.
function verifySignature(req, res, next) {
  const header = req.get('X-Hub-Signature-256');   // format: "sha256=<hex>"
  if (!header || !req.rawBody) return res.sendStatus(401);

  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.APP_SECRET)
    .update(req.rawBody)
    .digest('hex');

  const a = Buffer.from(header);
  const b = Buffer.from(expected);

  // timingSafeEqual throws if lengths differ, so check length first
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.sendStatus(401);
  }
  next();
}

var listener = app.listen(config.port, function () {
    // console.log('app step 0.5');
    console.log(`The app is running and listening on port ${listener.address().port}`);
});