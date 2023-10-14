"use client";

import {
  Stack,
  Button,
  Typography,
  TextField,
  FormControl,
} from "@mui/material";
import * as React from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Login(props: {
  handleLogin: (event: any) => Promise<void>;
}) {
  return (
    <Stack gap={2} alignItems={"flex-start"} width={"100%"}>
      <Typography variant="h5">Atualizar credenciais:</Typography>

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
          Atualizar
        </Button>
      </FormControl>
    </Stack>
  );
}
