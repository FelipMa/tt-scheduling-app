import { generateTwitterClient } from "@/utils/userClient";

export default async function postTweet(
  inText: string,
  inReply: string,
  inMediaId: string | null,
  accessToken: string,
  accessSecret: string
) {
  try {
    const twitterClient = generateTwitterClient(accessToken, accessSecret);

    let content: any = {
      text: inText,
    };

    if (inMediaId) {
      let mediaIds = [];

      mediaIds.push(inMediaId);

      content = {
        ...content,
        media: {
          media_ids: mediaIds,
        },
      };
    }

    const tweet = await twitterClient.v2.tweet(content);

    if (inReply) {
      const reply = await twitterClient.v2.tweet({
        text: inReply,
        reply: {
          in_reply_to_tweet_id: tweet.data.id,
        },
      });
    }

    return tweet;
  } catch (error: any) {
    if (error.code) {
      if (error.code === 429) {
        return 429;
      }
      if (error.code === 401) {
        return 401;
      }
      if (error.errors[0].message.includes("text is too long")) {
        /* to do: check this error */
        return 590;
      }
    }

    console.log(error);
    return undefined;
  }
}
