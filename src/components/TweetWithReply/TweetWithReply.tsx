"use client";

import {
  Button,
  TextField,
  FormControl,
  Typography,
  Stack,
} from "@mui/material";
import axios from "axios";

export default function TweetWithReply() {
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const inText = event.target.text.value;
    const inReply = event.target.reply.value;
    console.log(inText, inReply);
    const res = await axios.post("/api/tweet-with-reply", {
      text: inText,
      reply: inReply,
    });
    console.log(res.data);
  };

  return (
    <Stack gap={1}>
      <Typography variant="h5">Faça um tweet com um comentário</Typography>
      <FormControl
        component={"form"}
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          maxWidth: 600,
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
    </Stack>
  );
}
