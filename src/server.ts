import dotenv from "dotenv";
dotenv.config();
import { App } from "@slack/bolt";
import { queryKnowledgeBase, quickQuery } from "./query-db";
import { BedrockAgentClient } from "@aws-sdk/client-bedrock-agent";
import { IngestComment } from "./injest-data";

const bedRockClient = new BedrockAgentClient({
  region: "ca-central-1", // Replace with your region
  credentials: {
    accessKeyId: process.env.AWS_CLIENT_ID || "",
    secretAccessKey: process.env.AWS_CLIENT_SECRET || "",
    accountId: "801818864347",
  },
});

const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const SIGNING_SECRET = process.env.SIGNING_SECRET;
const CHANNEL_ID = "C05U30SH7B9";

const REGION = "us-east-1";

const app = new App({
  token: OAUTH_TOKEN,
  signingSecret: SIGNING_SECRET,
});
// Listen to all messages in the channel
app.event("message", async ({ event, client, logger }) => {
  try {
    if (event.channel === CHANNEL_ID && !event.subtype) {
      console.info(`Message received: ${event.text}`);
      await IngestComment(bedRockClient, event.text || "");

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
