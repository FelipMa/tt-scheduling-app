import {
  Stack,
  Button,
  Typography,
  TextField,
  FormControl,
} from "@mui/material";
import * as React from "react";

export default function Login(props: {
  accountName: string;
  accountUsername: string;
  authUrl: string;
  handlePin: (event: any) => void;
}) {
  return (
    <Stack gap={2} alignItems={"flex-start"} width={"100%"}>
      <Typography variant="h4">Informações da conta:</Typography>

      <Typography>
        {props.accountName
          ? "Nome: " + props.accountName
          : "Nenhum usuário autenticado"}
      </Typography>

      <Typography>
        {props.accountUsername
          ? "Nome de usuário: " + props.accountUsername
          : ""}
      </Typography>

      <Button variant="contained" href={props.authUrl} target="_blank">
        Gerar Pin de login
      </Button>

      <FormControl
        component={"form"}
        onSubmit={props.handlePin}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <TextField
          id="pin"
          label="PIN"
          variant="outlined"
          fullWidth
          multiline
        />

        <Button variant="contained" type="submit">
          Login
        </Button>
      </FormControl>

      <Typography>
        As credenciais são armazenadas no navegador, ao recarregar a página será
        necessário logar novamente.
      </Typography>
    </Stack>
  );
}
