import { Stack } from "@mui/material";
import Header from "@/components/Header/Header";
import TweetWithReply from "@/components/TweetWithReply/TweetWithReply";
import TweetWithMediaAndReply from "@/components/TweetWithMediaAndReply/TweetWithMediaAndReply";

export default function Home() {
  return (
    <Stack component={"main"} padding={2} gap={2}>
      <Header />
      <TweetWithMediaAndReply />
    </Stack>
  );
}
