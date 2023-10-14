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
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function ScheduleTweet() {
  const [selectedFile, setSelectedFile] = React.useState<File>();
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
    dayjs(Date.now())
  );

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event: any) => {
    const toastId = toast.loading("Agendando tweet...");
    event.preventDefault();

    const inText = event.target.text.value;
    const inReply = event.target.reply.value;
    const unixTime = selectedDate?.unix();

    if (!inText && !selectedFile) {
      toast.update(toastId, {
        render:
          "É necessário escrever um texto ou selecionar um arquivo de mídia",
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
        `Tem certeza que deseja agendar sem os campos: ${missingFields.join(
          " e "
        )}?`
      );

      if (!confirm) {
        toast.update(toastId, {
          render: "Tweet não agendado",
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

    const now = dayjs(Date.now());
    const unixNow = now.unix();

    if (unixTime) {
      if (unixTime - unixNow < 0) {
        const confirm = window.confirm(
          `O tempo indicado no agendamento já passou, tem certeza que deseja agendar seu tweet? (será postado imediatamente)`
        );

        if (!confirm) {
          toast.update(toastId, {
            render: "Tweet não postado",
            type: "info",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: false,
          });
          return;
        }
      } else if (unixTime - unixNow < 60) {
        const confirm = window.confirm(
          `Tem certeza que deseja agendar seu tweet para daqui a ${
            unixTime - unixNow
          } segundos?`
        );

        if (!confirm) {
          toast.update(toastId, {
            render: "Tweet não agendado",
            type: "info",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: false,
          });
          return;
        }
      }
    }

    const formData = new FormData();
    formData.append("text", inText);
    formData.append("reply", inReply);
    formData.append("media", selectedFile as Blob);
    formData.append("unixTime", unixTime as unknown as string);

    try {
      const res = await axios.post("/api/schedule-tweet", formData);

      toast.update(toastId, {
        render: `${res.data.message}`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (err: any) {
      const message = "Erro ao agendar tweet";

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
        Faça o agendamento de um tweet com um arquivo de mídia e/ou comentário:
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

        <Stack component="label" htmlFor="media" gap={1}>
          <Button
            variant="contained"
            component="span"
            color="inherit"
            sx={{ maxWidth: 250, textTransform: "none" }}
          >
            Selecionar arquivo de mídia
          </Button>
          <Typography>Arquivo selecionado: {selectedFile?.name}</Typography>
        </Stack>

        <Input
          type="file"
          id="media"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <TextField
          id="reply"
          label="Comentário"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Horário da postagem"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            format="L HH:mm"
            ampm={false}
          />
        </LocalizationProvider>
        <Button variant="contained" type="submit">
          Enviar
        </Button>
      </FormControl>
      <ToastContainer />
    </Stack>
  );
}
