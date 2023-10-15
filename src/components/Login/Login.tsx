import {
  Stack,
  Button,
  Typography,
  TextField,
  FormControl,
} from "@mui/material";
import * as React from "react";

export default function Login(props: {
  handleLogin: (event: any) => Promise<void>;
  accountName: string;
  accountUsername: string;
}) {
  return (
    <Stack gap={2} alignItems={"flex-start"} width={"100%"}>
      <Typography variant="h5">Informações da conta:</Typography>

      <Typography>
        {props.accountName
          ? "Nome:" + props.accountName
          : "Nenhum usuário autenticado"}
      </Typography>

      <Typography>
        {props.accountUsername
          ? "Nome de usuário:" + props.accountUsername
          : ""}
      </Typography>

      <Typography variant="h5">Login:</Typography>

      <Typography>
        O login é realizado pelas credenciais de desenvolvedor do usuário;
        <br />
        As credenciais são armazenadas no navegador, ao recarregar a página será
        necessário logar novamente.
      </Typography>

      <FormControl
        component={"form"}
        onSubmit={props.handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          width: "100%",
        }}
      >
        <TextField
          id="appKey"
          label="App Key"
          variant="outlined"
          fullWidth
          multiline
        />

        <TextField
          id="appSecret"
          label="App Secret"
          variant="outlined"
          fullWidth
          multiline
        />

        <TextField
          id="accessToken"
          label="Access Token"
          variant="outlined"
          fullWidth
          multiline
        />

        <TextField
          id="accessSecret"
          label="Access Secret"
          variant="outlined"
          fullWidth
          multiline
        />

        <Button variant="contained" type="submit">
          Enviar
        </Button>
      </FormControl>
    </Stack>
  );
}
