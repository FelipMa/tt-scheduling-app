import { generateTwitterClient } from "@/utils/userClient";

export default async function loginByPin(
  accessToken: string,
  accessSecret: string,
  pin: string
) {
  try {
    const client = generateTwitterClient(accessToken, accessSecret);

    const {
      client: loggedClient,
      accessToken: newAccessToken,
      accessSecret: newAccessSecret,
    } = await client.login(pin);

    return {
      accessToken: newAccessToken,
      accessSecret: newAccessSecret,
    };
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
