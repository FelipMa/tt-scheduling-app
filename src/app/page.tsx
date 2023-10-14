import { Stack } from "@mui/material";
import GetAccountInfo from "@/components/GetAccoutInfo/GetAccountInfo";
import ScheduleTweet from "@/components/ScheduleTweet/ScheduleTweet";
import Schedulings from "@/components/Schedulings/Schedulings";
import Login from "@/components/Login/Login";

export default function Home() {
  return (
    <Stack component={"main"} padding={6} gap={7} maxWidth={700}>
      <GetAccountInfo />
      <ScheduleTweet />
      <Schedulings />
    </Stack>
  );
}
