import { twitterClient } from "@/utils/userClient";

export default async function getMe() {
  try {
    const user = await twitterClient.v2.me();

    return user;
  } catch (error: any) {
    console.log(error);

    if (error.code) {
      if (error.code === 429) {
        return 429;
      }
      if (error.code === 401) {
        return 401;
      }
    }
    return undefined;
  }
}
