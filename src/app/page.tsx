import { Stack } from "@mui/material";
import GetAccountInfo from "@/components/GetAccoutInfo/GetAccountInfo";
import TweetWithMediaAndReply from "@/components/TweetWithMediaAndReply/TweetWithMediaAndReply";

export default function Home() {
  return (
    <Stack component={"main"} padding={6} gap={7} maxWidth={800}>
      <GetAccountInfo />
      <TweetWithMediaAndReply />
    </Stack>
  );
}
