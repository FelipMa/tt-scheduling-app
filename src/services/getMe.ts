import { generateTwitterClient } from "@/utils/userClient";

export default async function getMe(
  appKey: string,
  appSecret: string,
  accessToken: string,
  accessSecret: string
) {
  try {
    const twitterClient = generateTwitterClient(
      appKey,
      appSecret,
      accessToken,
      accessSecret
    );

    const user = await twitterClient.v2.me();

    return user;
  } catch (error: any) {
    if (error.code) {
      if (error.code === 429) {
        console.log(error);
        console.log(Date.now());
        return 429;
      }
      if (error.code === 401) {
        return 401;
      }
    }

    console.log(error);
    return undefined;
  }
}
