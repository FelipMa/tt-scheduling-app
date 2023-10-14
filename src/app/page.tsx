"use client";

import { Stack } from "@mui/material";
import GetAccountInfo from "@/components/GetAccoutInfo/GetAccountInfo";
import ScheduleTweet from "@/components/ScheduleTweet/ScheduleTweet";
import Schedulings from "@/components/Schedulings/Schedulings";
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TwitterApiReadWrite } from "twitter-api-v2";
import Login from "@/components/Login/Login";

export default function Home() {
  const [client, setClient] = React.useState<TwitterApiReadWrite>();

  const [accountName, setAccountName] = React.useState<string>("...");
  const [accountUsername, setAccountUsername] = React.useState<string>("...");

  const handleLogin = async (event: any) => {
    const toastId = toast.loading("Atualizando credenciais...");

    event.preventDefault();
    const newAppKey = event.target.appKey.value;
    const newAppSecret = event.target.appSecret.value;
    const newAccessToken = event.target.accessToken.value;
    const newAccessSecret = event.target.accessSecret.value;

    if (
      !newAppKey ||
      !newAppSecret ||
      !newAccessToken ||
      !newAccessSecret ||
      newAppKey === "" ||
      newAppSecret === "" ||
      newAccessToken === "" ||
      newAccessSecret === ""
    ) {
      toast.update(toastId, {
        render: "Preencha todas as credenciais de autenticação",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    try {
      const res = await axios.post("/api/login", {
        appKey: newAppKey,
        appSecret: newAppSecret,
        accessToken: newAccessToken,
        accessSecret: newAccessSecret,
      });

      const newClient = res.data.twitterClient;
      const userData = res.data.userData;

      setClient(newClient);
      setAccountName(userData.data.name);
      setAccountUsername(userData.data.username);

      toast.update(toastId, {
        render: `Usuário ${accountName} - ${accountUsername} autenticado com sucesso`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (err: any) {
      let message = "Erro ao atualizar credenciais";

      if (err.response && err.response.status) {
        if (err.response.status === 429) {
          message =
            "Usuário identificado, mas não foi possível buscar seus dados pelo limite de requisições excedido";
        }
        if (err.response.status === 401) {
          message =
            "Erro de autenticação ao buscar informações da conta, verifique as credenciais";
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
      return;
    }
  };

  return (
    <Stack component={"main"} padding={6} gap={7} maxWidth={700}>
      <Login handleLogin={handleLogin} />
      <GetAccountInfo client={client} />
      <ScheduleTweet />
      <Schedulings />
    </Stack>
  );
}
