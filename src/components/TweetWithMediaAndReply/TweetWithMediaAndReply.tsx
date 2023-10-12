"use client";

import {
  Button,
  TextField,
  FormControl,
  Typography,
  Stack,
} from "@mui/material";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import axios from "axios";
import * as React from "react";

export default function TweetWithMediaAndReply() {
  const [selectedFile, setSelectedFile] = React.useState<File>();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Do something with the selected file (e.g., upload it to a server)
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
    }
  };

  /*const inText = event.target.text.value;
    const inReply = event.target.reply.value;
    console.log(inText, inReply);
    const res = await axios.post("/api/tweet-with-media-and-reply", {
      text: inText,
      reply: inReply,
    });
    console.log(res.data);*/

  return (
    <Stack gap={1}>
      <Typography variant="h5">
        Faça um tweet com uma media e um comentário
      </Typography>
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

        {/*<Input
          type="file"
          id="file"
          inputProps={{ style: { display: "none" } }}
          onChange={(event) => setSelectedFile(event.target.files?.item(0))}
          endAdornment={
            <IconButton component="label">
              <FileUploadOutlinedIcon />
            </IconButton>
          }
        />*/}
        <input type="file" onChange={handleFileChange} />

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
