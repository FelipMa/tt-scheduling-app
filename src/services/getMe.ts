import { twitterClient } from "@/utils/userClient";

export default async function getMe() {
  try {
    const user = await twitterClient.v2.me();

    return user;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
