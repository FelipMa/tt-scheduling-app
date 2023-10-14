import { generateTwitterClient } from "@/utils/userClient";

export default async function getMe() {
  try {
    const twitterClient = generateTwitterClient();
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

    if ((error + "a").includes("Invalid consumer tokens")) {
      return 401;
    }

    console.log(error);
    return undefined;
  }
}
