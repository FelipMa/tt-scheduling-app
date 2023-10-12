import { twitterClient } from "@/utils/userClient";

export default async function postTweetWithMediaAndReply(
  inText: string,
  inReply: string
  /* to do media */
) {
  try {
    const tweet = await twitterClient.v2.tweet({
      text: inText,
      /* to do media */
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
