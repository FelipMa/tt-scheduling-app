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
  accessToken: string;
  accessSecret: string;
}

export default function Home() {
  const initialClientCredentials = {
    accessToken: "",
    accessSecret: "",
  };
  const [clientCredentials, setClientCredentials] =
    React.useState<ClientCredentials>(initialClientCredentials);

  const [accountName, setAccountName] = React.useState<string>("");
  const [accountUsername, setAccountUsername] = React.useState<string>("");

  const [authUrl, setAuthUrl] = React.useState<string>("");

  React.useEffect(() => {
    const toastId = toast.loading("Carregando aplicação...");
    const generateAuthUrl = async () => {
      try {
        const res = await axios.get("/api/generate-auth-url");
        setAuthUrl(res.data.authUrl.url);

        const newClientCredentials = {
          accessToken: res.data.authUrl.oauth_token,
          accessSecret: res.data.authUrl.oauth_token_secret,
        };

        setClientCredentials(newClientCredentials);

        toast.update(toastId, {
          render: `Aplicação pronta para uso!`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: false,
        });
      } catch (err) {
        toast.update(toastId, {
          render: `Erro ao carregar aplicação`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    };

    generateAuthUrl();
  }, []);

  const handlePin = async (event: any) => {
    const toastId = toast.loading("Autenticando usuário...");

    event.preventDefault();
    const pin = event.target.pin.value;

    if (!pin || pin === "") {
      toast.update(toastId, {
        render: `PIN inválido`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    const loginCredentials = {
      accessToken: clientCredentials.accessToken,
      accessSecret: clientCredentials.accessSecret,
      pin: pin,
    };

    try {
      const loginRes = await axios.post("/api/login", loginCredentials);

      const newClientCredentials = {
        accessToken: loginRes.data.accessToken,
        accessSecret: loginRes.data.accessSecret,
      };

      setClientCredentials(newClientCredentials);

      const getMeRes = await axios.post("/api/me", newClientCredentials);

      const name = getMeRes.data.data.name;
      const username = getMeRes.data.data.username;

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
      let message = "Erro ao autenticar usuário";

      if (err.response && err.response.status) {
        if (err.response.status === 429) {
          message =
            "Usuário existente, mas não foi possível buscar seus dados pelo limite de requisições excedido (ainda pode ser possível agendar tweets)";

          setAccountName("Usuário não identificado");
          setAccountUsername("Usuário não identificado");
        }
        if (err.response.status === 401) {
          message = "Erro de autenticação, verifique as credenciais";
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
          accountName={accountName}
          accountUsername={accountUsername}
          authUrl={authUrl}
          handlePin={handlePin}
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
