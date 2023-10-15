import { Stack, Typography } from "@mui/material";
import * as React from "react";

export default function Schedulings() {
  const [schedulings, setSchedulings] = React.useState<any>([]);

  React.useEffect(() => {
    const fetchSchedulings = async () => {
      const response = await fetch("/api/schedulings");
      const data = await response.json();
      const reversedData = data.reverse();
      setSchedulings(reversedData);
    };

    fetchSchedulings();
  }, []);

  return (
    <Stack gap={1} alignItems={"flex-start"}>
      <Typography variant="h5">Últimos agendamentos:</Typography>
      <Typography>
        Agendamentos são salvos em um banco sqlite;
        <br />A listagem só é atualizada ao recarregar a página.
      </Typography>
      {schedulings.map((scheduling: any) => (
        <Stack
          key={scheduling.targetDate}
          flexDirection={"column"}
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
            <b>Usuário:</b> {scheduling.accountUsername}
          </Typography>

          <Typography>
            <b>Horário:</b> {scheduling.targetDate}
          </Typography>

          <Typography>
            <b>Status:</b> {scheduling.status}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
