import { TwitterApi } from "twitter-api-v2";

function generateTwitterClient(accessToken: string, accessSecret: string) {
  const appKey = "ELKfvLQQkZyj1fCLo7oEA06bu";
  const appSecret = "TNAmHnXktCVjBJUzn8pHQJO0tH0TwLZcy02fuBHrVZ1buVVNtD";
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
  const appKey = "ELKfvLQQkZyj1fCLo7oEA06bu";
  const appSecret = "TNAmHnXktCVjBJUzn8pHQJO0tH0TwLZcy02fuBHrVZ1buVVNtD";

  const client = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
  });

  return client;
}

export { generateTwitterClient, generateCallbackClient };
