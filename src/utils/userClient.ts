import { TwitterApi } from "twitter-api-v2";

function generateTwitterClient(
  appKey: string,
  appSecret: string,
  accessToken: string,
  accessSecret: string
) {
  const client = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  const twitterClient = client.readWrite;

  return twitterClient;
}

export { generateTwitterClient };
