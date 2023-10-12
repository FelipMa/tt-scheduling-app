"use client";

import { Box, Button } from "@mui/material";
import axios from "axios";

export default function Header() {
  const getMe = () => {
    axios.get("/api/me").then((res) => {
      console.log(res.data);
    });
  };

  const tweet = () => {
    axios
      .post("/api/tweet", { text: `Hello World! ${Date.now()}` })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <Box>
      <Button onClick={getMe}>Get My Information on Console!</Button>
      <Button onClick={tweet}>Tweet a Hello Word!</Button>
    </Box>
  );
}
