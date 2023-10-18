import { NextRequest, NextResponse } from "next/server";
import { verifySignatureEdge } from "@upstash/qstash/dist/nextjs";
import prisma from "@/lib/prisma";
import postTweet from "@/services/postTweet";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

async function handler(req: NextRequest) {
  const body = await req.json();
  const { text, reply, mediaId, accessToken, accessSecret, scheduleId } = body;
  try {
    const response = await postTweet(
      text,
      reply,
      mediaId,
      accessToken,
      accessSecret
    );

    let newStatus;

    if (response === 429) {
      throw new Error("Too Many Requests");
    } else if (response === 401) {
      throw new Error("Unauthorized");
    } else if (response === 590) {
      throw new Error("Text too long");
    } else if (response === 591) {
      throw new Error("Unsupported media file (probably too heavy)");
    } else if (response === undefined) {
      throw new Error("Internal Server Error");
    } else {
      newStatus = "Tweet postado";
    }

    const schedule = await prisma.schedule.update({
      where: {
        id: parseInt(scheduleId),
      },
      data: {
        status: newStatus,
      },
    });

    console.info(
      `Programado para ${schedule.targetDate}, executado em ${dayjs()
        .tz("America/Bahia")
        .format("DD/MM/YYYY HH:mm:ss [UTC]Z")}`
    );

    return NextResponse.json(
      { message: "Agendamento executado com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    let newStatus = "Erro ao postar tweet";

    if (error.message === "Too Many Requests") {
      newStatus = "Limite de requisições excedido";
    } else if (error.message === "Unauthorized") {
      newStatus = "Erro de autenticação";
    } else if (error.message === "Text too long") {
      newStatus = "Texto muito longo";
    } else if (
      error.message === "Unsupported media file (probably too heavy)"
    ) {
      newStatus =
        "Arquivo de mídia não suportado (provavelmente é muito pesado)";
    }

    await prisma.schedule.update({
      where: {
        id: parseInt(scheduleId),
      },
      data: {
        status: newStatus,
      },
    });

    console.error(error);
    return NextResponse.json(
      { message: "Erro ao executar agendamento" },
      { status: 500 }
    );
  }
}

export const POST = verifySignatureEdge(handler);
