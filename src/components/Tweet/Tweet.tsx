"use client";

import {
  Button,
  TextField,
  FormControl,
  Typography,
  Stack,
} from "@mui/material";
import Input from "@mui/material/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import * as React from "react";

export default function ScheduleTweet() {
  const [selectedFile, setSelectedFile] = React.useState<File>();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event: any) => {
    const toastId = toast.loading("Enviando tweet...");
    event.preventDefault();

    const inText = event.target.text.value;
    const inReply = event.target.reply.value;

    if (!inText && !selectedFile) {
      toast.update(toastId, {
        render:
          "É necessário preencher um texto ou selecionar um arquivo de mídia",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    const missingFields = [];

    if (!inText) {
      missingFields.push("texto");
    }

    if (!selectedFile) {
      missingFields.push("arquivo de mídia");
    }

    if (!inReply) {
      missingFields.push("comentário");
    }

    if (missingFields.length > 0) {
      const confirm = window.confirm(
        `Tem certeza que deseja enviar sem os campos: ${missingFields.join(
          " e "
        )}?`
      );

      if (!confirm) {
        toast.update(toastId, {
          render: "Tweet não enviado",
          type: "info",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: false,
        });
        return;
      }
    }

    if (inText.length > 280) {
      toast.update(toastId, {
        render: "Texto principal excedeu o limite de 280 caracteres",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    if (inReply.length > 280) {
      toast.update(toastId, {
        render: "Comentário excedeu o limite de 280 caracteres",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("text", inText);
    formData.append("reply", inReply);
    formData.append("media", selectedFile as Blob);

    try {
      const res = await axios.post("/api/tweet", formData);
      toast.update(toastId, {
        render: "Tweet enviado com sucesso",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (err: any) {
      console.log(err);

      let message = "Erro ao enviar tweet";

      if (err.response && err.response.status) {
        if (err.response.status === 429) {
          message = "Limite de requisições excedido";
        }
        if (err.response.status === 401) {
          message = "Erro de autenticação";
        }
        if (err.response.status === 590) {
          message = "Tamanho do texto excedido";
        }
        if (err.response.status === 591) {
          message = "Arquivo de mídia não suportado (talvez seja muito grande)";
        }
      }

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }
  };

  return (
    <Stack gap={2}>
      <Typography variant="h5">
        Faça um tweet com um arquivo de mídia e um comentário
      </Typography>
      <FormControl
        component={"form"}
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <TextField
          id="text"
          label="Texto principal"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
        />

        <Input type="file" onChange={handleFileChange} />

        <TextField
          id="reply"
          label="Comentário"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
        />
        <Button variant="contained" type="submit">
          Enviar
        </Button>
      </FormControl>
      <ToastContainer />
    </Stack>
  );
}
