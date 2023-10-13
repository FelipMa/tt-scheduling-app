import { Stack, Typography } from "@mui/material";
import schedulings from "@/utils/schedulings";

export default function Schedulings() {
  const reversedSchedulings = schedulings.slice().reverse();
  return (
    <Stack gap={1} alignItems={"flex-start"}>
      <Typography variant="h5">Últimos agendamentos</Typography>
      {reversedSchedulings.map((scheduling) => (
        <Typography key={scheduling}>{scheduling}</Typography>
      ))}
    </Stack>
  );
}
