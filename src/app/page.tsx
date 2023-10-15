"use client";

import { Stack } from "@mui/material";
import ScheduleTweet from "@/components/ScheduleTweet/ScheduleTweet";
import Schedulings from "@/components/Schedulings/Schedulings";
import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Login from "@/components/Login/Login";
interface ClientCredentials {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
}

export default function Home() {
  const initialClientCredentials = {
    appKey: "",
    appSecret: "",
    accessToken: "",
    accessSecret: "",
  };
  const [clientCredentials, setClientCredentials] =
    React.useState<ClientCredentials>(initialClientCredentials);

  const [accountName, setAccountName] = React.useState<string>("");
  const [accountUsername, setAccountUsername] = React.useState<string>("");

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

    const newClientCredentials = {
      appKey: newAppKey,
      appSecret: newAppSecret,
      accessToken: newAccessToken,
      accessSecret: newAccessSecret,
    };

    setClientCredentials(newClientCredentials);

    try {
      const res = await axios.post("/api/login", newClientCredentials);

      const name = res.data.data.name;
      const username = res.data.data.username;

      setAccountName(name);
      setAccountUsername(username);

      toast.update(toastId, {
        render: `Usuário ${name} (${username}) autenticado com sucesso`,
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
            "Usuário identificado, mas não foi possível buscar seus dados pelo limite de requisições excedido (ainda pode ser possível agendar tweets)";
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
    <>
      <Stack
        component={"main"}
        paddingY={3}
        paddingX={6}
        gap={7}
        maxWidth={700}
      >
        <Login
          handleLogin={handleLogin}
          accountName={accountName}
          accountUsername={accountUsername}
        />

        <ScheduleTweet
          clientCredentials={clientCredentials}
          accountName={accountName}
          accountUsername={accountUsername}
        />

        <Schedulings />
      </Stack>
      <ToastContainer />
    </>
  );
}
