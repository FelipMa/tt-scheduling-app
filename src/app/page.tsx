"use client";

import { Stack } from "@mui/material";
import GetAccountInfo from "@/components/GetAccoutInfo/GetAccountInfo";
import ScheduleTweet from "@/components/ScheduleTweet/ScheduleTweet";
import Schedulings from "@/components/Schedulings/Schedulings";
import { generateTwitterClient } from "@/utils/userClient";
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TwitterApiReadWrite } from "twitter-api-v2";
import Login from "@/components/Login/Login";

export default function Home() {
  const initialClient = generateTwitterClient(
    "appKey",
    "appSecret",
    "accessToken",
    "accessSecret"
  );
  const [client, setClient] =
    React.useState<TwitterApiReadWrite>(initialClient);

  const [accountName, setAccountName] = React.useState<string>("...");
  const [accountUsername, setAccountUsername] = React.useState<string>("...");

  const handleLogin = async (event: any) => {
    const toastId = toast.loading("Atualizando credenciais...");

    event.preventDefault();
    const newAppKey = event.target.appKey.value;
    const newAppSecret = event.target.appSecret.value;
    const newAccessToken = event.target.accessToken.value;
    const newAccessSecret = event.target.accessSecret.value;

    setClient(
      generateTwitterClient(
        newAppKey,
        newAppSecret,
        newAccessToken,
        newAccessSecret
      )
    );

    try {
      const response = await axios.get("/api/me");

      setAccountName(response.data.data.name);
      setAccountUsername(response.data.data.username);

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
        if (err.response.status === 429) {
          message = "Limite de requisições excedido";
        }
        if (err.response.status === 401) {
          message = "Erro de autenticação ao buscar informações da conta";
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
    <Stack component={"main"} padding={6} gap={7} maxWidth={700}>
      <Login handleLogin={handleLogin} />
      <GetAccountInfo />
      <ScheduleTweet />
      <Schedulings />
    </Stack>
  );
}
