"use client";

import {
  Stack,
  Button,
  Typography,
  TextField,
  FormControl,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const handleSubmit = async (event: any) => {
    const toastId = toast.loading("Atualizando credenciais...");

    event.preventDefault();
    const newAppKey = event.target.appKey.value;
    const newAppSecret = event.target.appSecret.value;
    const newAccessToken = event.target.accessToken.value;
    const newAccessSecret = event.target.accessSecret.value;

    try {
      const response = await axios.post("/api/login", {
        appKey: newAppKey,
        appSecret: newAppSecret,
        accessToken: newAccessToken,
        accessSecret: newAccessSecret,
      });

      toast.update(toastId, {
        render: "Credenciais atualizadas com sucesso",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (err: any) {
      let message = "Erro ao atualizar credenciais";

      if (err.response && err.response.status) {
        if (err.response.status === 401) {
          message = "Credenciais inválidas";
        }
      }

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }
  };
  return (
    <Stack gap={2} alignItems={"flex-start"} width={"100%"}>
      <Typography variant="h5">
        Atualizar credenciais (trocar conta atual):
      </Typography>

      <FormControl
        component={"form"}
        onSubmit={handleSubmit}
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
      <ToastContainer />
    </Stack>
  );
}
