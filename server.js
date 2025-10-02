const express = require("express");
require("dotenv").config();
const { App } = require("@slack/bolt");
const port = 3000;

const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const SIGNING_SECRET = process.env.SIGNING_SECRET;
const CHANNEL_ID = "C05U30SH7B9";

const app = new App({
  token: OAUTH_TOKEN,
  signingSecret: SIGNING_SECRET,
});
// Listen to all messages in the channel
app.event("message", async ({ event, client, logger }) => {
  try {
    if (event.channel === CHANNEL_ID && !event.subtype) {
      console.info(`Message received: ${event.text}`);
      // You can process or store the message here
    }
  } catch (error) {
    console.error(error);
  }
});
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log(":zap:️ Slack bot is running!");
})();
