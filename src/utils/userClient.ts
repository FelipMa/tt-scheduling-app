import { TwitterApi } from "twitter-api-v2";
import credentials from "./credentials";

/*const appKey = "ELKfvLQQkZyj1fCLo7oEA06bu";
const appSecret = "TNAmHnXktCVjBJUzn8pHQJO0tH0TwLZcy02fuBHrVZ1buVVNtD";
const accessToken = "826837525973065728-sDrHpEcUmOO4JS5eDHzB13Ee3rhzVuU";
const accessSecret = "4NdyJOV2rhDSnmZLJfyJtwcpAAeeSXKeLwuDNuBQ7r3SI";
const clientId = "blV5TzNDbS1NLWJya3JuT2I2RTQ6MTpjaQ";
const clientSecret = "CFOKGK30XXDa2M_mhTZUDOWH2xTLah4kJDVnXTemIbvdigUIE_";
const bearerToken =
  "AAAAAAAAAAAAAAAAAAAAAJvfqQEAAAAA%2Fe01NwuLQUmZ128GqOhsBztoVEo%3DwD7pHlnNipp4RjDBY81rZdH4ZLc2QRIKE1qEEvOjVxAdTGu0Ps";
*/

function generateTwitterClient() {
  /*const appKey = credentials.appKey;
  const appSecret = credentials.appSecret;
  const accessToken = credentials.accessToken;
  const accessSecret = credentials.accessSecret;*/

  const appKey = "ELKfvLQQkZyj1fCLo7oEA06bu";
  const appSecret = "TNAmHnXktCVjBJUzn8pHQJO0tH0TwLZcy02fuBHrVZ1buVVNtD";
  const accessToken = "826837525973065728-sDrHpEcUmOO4JS5eDHzB13Ee3rhzVuU";
  const accessSecret = "4NdyJOV2rhDSnmZLJfyJtwcpAAeeSXKeLwuDNuBQ7r3SI";

  const client = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });

  const twitterClient = client.readWrite;

  return twitterClient;
}

export { generateTwitterClient };
