import { TwitterApiReadWrite } from "twitter-api-v2";

export default async function getMe(twitterClient: TwitterApiReadWrite) {
  try {
    const user = await twitterClient.v2.me();

    return user;
  } catch (error: any) {
    if (error.code) {
      if (error.code === 429) {
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
