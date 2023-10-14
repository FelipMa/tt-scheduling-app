import { Stack, Typography } from "@mui/material";
import schedulings from "@/utils/schedulings";

export default function Schedulings() {
  const reversedSchedulings = schedulings.slice().reverse();
  return (
    <Stack gap={1} alignItems={"flex-start"}>
      <Typography variant="h5">Últimos agendamentos:</Typography>
      {reversedSchedulings.map((scheduling) => (
        <Stack
          key={scheduling.targetDate}
          sx={{
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 1,
            padding: 1,
            gap: 1,
            width: "100%",
          }}
        >
          <Typography>
            <b>Horário:</b> {scheduling.targetDate}
          </Typography>

          <Typography>
            <b>Texto:</b> {scheduling.text}
          </Typography>

          <Typography>
            <b>Mídia:</b> {scheduling.media}
          </Typography>

          <Typography>
            <b>Comentário:</b> {scheduling.reply}
          </Typography>

          <Typography>
            <b>Status:</b> {scheduling.status}
          </Typography>

          <Typography>
            <b>User:</b> {scheduling.accountUsername}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
