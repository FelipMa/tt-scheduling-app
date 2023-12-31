import { Button, Stack, Typography } from "@mui/material";
import * as React from "react";
import { toast } from "react-toastify";

export default function Schedulings() {
  const [schedulings, setSchedulings] = React.useState<any>([]);
  const [cards, setCards] = React.useState<number>(5);

  React.useEffect(() => {
    const fetchSchedulings = async () => {
      try {
        const response = await fetch("/api/schedulings");
        const data = await response.json();
        const reversedData = data.reverse();
        setSchedulings(reversedData);
      } catch (err) {
        toast.error("Erro ao carregar agendamentos.", {
          autoClose: 3000,
          closeOnClick: true,
        });
      }
    };

    fetchSchedulings();
  }, []);

  return (
    <Stack gap={2} alignItems={"flex-start"}>
      <Typography variant="h4">Últimos agendamentos:</Typography>
      <Typography>
        A listagem só é atualizada ao recarregar a página.
      </Typography>
      {schedulings.length === 0 && (
        <Typography>Nenhum agendamento encontrado.</Typography>
      )}
      {schedulings.slice(0, cards).map((scheduling: any, index: number) => (
        <Stack
          key={index}
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
            <b>Agendado para:</b> {scheduling.targetDate}
          </Typography>

          <Typography>
            <b>Status:</b> {scheduling.status}
          </Typography>
        </Stack>
      ))}
      {schedulings.length > cards && (
        <Button variant="contained" onClick={() => setCards(cards + 5)}>
          Carregar mais
        </Button>
      )}
      {schedulings.length !== 0 ||
        (schedulings.length <= cards && (
          <Typography>Não há mais agendamentos.</Typography>
        ))}
    </Stack>
  );
}
