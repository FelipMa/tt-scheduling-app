import { fileTypeFromBuffer } from "file-type";
import { generateTwitterClient } from "@/utils/userClient";

export default async function uploadMediaForTwitter(
  inMedia: File,
  accessToken: string,
  accessSecret: string
) {
  try {
    const twitterClient = generateTwitterClient(accessToken, accessSecret);
    const bytes = await inMedia.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const inType = await fileTypeFromBuffer(buffer);

    if (!inType) {
      throw new Error("Invalid file type");
    }

    const mediaId = await twitterClient.v1.uploadMedia(buffer, {
      mimeType: inType.mime,
    });

    return mediaId;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
