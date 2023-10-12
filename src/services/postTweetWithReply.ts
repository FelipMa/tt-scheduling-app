import { twitterClient } from "@/utils/userClient";

export default async function postTweetWithReply(
  inText: string,
  inReply: string
) {
  try {
    const tweet = await twitterClient.v2.tweet({
      text: inText,
    });

    const reply = await twitterClient.v2.tweet({
      text: inReply,
      reply: {
        in_reply_to_tweet_id: tweet.data.id,
      },
    });

    return tweet;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
