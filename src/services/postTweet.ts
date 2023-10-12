import { twitterClient } from "@/utils/userClient";

export default async function postTweet(inText: string) {
  try {
    const tweet = await twitterClient.v2.tweet({
      text: inText,
    });

    return tweet;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
