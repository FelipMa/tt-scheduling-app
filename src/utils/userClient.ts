import { TwitterApi } from "twitter-api-v2";

const appKey = process.env.NEXT_PUBLIC_APP_KEY
  ? process.env.NEXT_PUBLIC_APP_KEY
  : "";
const appSecret = process.env.NEXT_PUBLIC_APP_SECRET
  ? process.env.NEXT_PUBLIC_APP_SECRET
  : "";

function generateTwitterClient(accessToken: string, accessSecret: string) {
  const client = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  const twitterClient = client.readWrite;

  return twitterClient;
}

function generateCallbackClient() {
  const client = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
  });

  return client;
}

export { generateTwitterClient, generateCallbackClient };
