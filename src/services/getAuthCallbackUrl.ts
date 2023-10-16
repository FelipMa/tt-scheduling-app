import { generateCallbackClient } from "@/utils/userClient";

export default async function getAuthCallbackUrl() {
  try {
    const callbackClient = generateCallbackClient();

    const authUrl = await callbackClient.generateAuthLink();

    return authUrl;
  } catch (error: any) {
    console.log(error);
    return undefined;
  }
}
