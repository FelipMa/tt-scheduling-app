"use client";

import { Stack, Button, Typography } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GetAccoutInfo() {
  const [accountName, setAccountName] = React.useState<string>("...");
  const [accountUsername, setAccountUsername] = React.useState<string>("...");

  const getMe = async () => {
    const toastId = toast.loading("Buscando informações da conta...");
    try {
      const res = await axios.get("/api/me");
      /*console.log(res.data);
      console.log(res.data.data);
      console.log(res.data.data.name);
      console.log(res.data.data.username);*/
      setAccountName(res.data.data.name);
      setAccountUsername(res.data.data.username);

      toast.update(toastId, {
        render: "Informações da conta atual buscadas com sucesso",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (err: any) {
      let message = "Erro ao buscar informações";

      if (err.response && err.response.status) {
        if (err.response.status === 429) {
          message = "Limite de requisições excedido";
        }
        if (err.response.status === 401) {
          message =
            "Erro de autenticação ao buscar informações da conta (provavelmente não há credenciais cadastradas no momento)";
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

  /*React.useEffect(() => {
    getMe();
  }, []);*/

  return (
    <Stack gap={2} alignItems={"flex-start"}>
      <Typography variant="h5">Informações da conta atual:</Typography>
      <Typography>Nome: {accountName}</Typography>
      <Typography>Nome de usuário: {accountUsername}</Typography>
      <Button variant="contained" onClick={getMe}>
        Buscar informações da conta
      </Button>
      <ToastContainer />
    </Stack>
  );
}
