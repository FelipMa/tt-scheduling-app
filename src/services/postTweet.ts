import { fileTypeFromBuffer } from "file-type";
import { generateTwitterClient } from "@/utils/userClient";

export default async function postTweet(
  inText: string,
  inReply: string,
  inMedia: File | string,
  accessToken: string,
  accessSecret: string
) {
  try {
    const twitterClient = generateTwitterClient(accessToken, accessSecret);

    let content: any = {
      text: inText,
    };

    if (typeof inMedia !== "string") {
      const bytes = await inMedia.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const inType = await fileTypeFromBuffer(buffer);

      if (!inType) {
        throw new Error("Invalid file type");
      }

      let mediaIds = [];

      const mediaId = await twitterClient.v1.uploadMedia(buffer, {
        mimeType: inType.mime,
      });

      mediaIds.push(mediaId);

      content = {
        ...content,
        media_ids: mediaIds,
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

    if ((error + "a").includes("Failed to process media")) {
      return 591;
    }

    console.log(error);
    return undefined;
  }
}
