import { NextResponse } from "next/server";
import { verifySignatureEdge } from "@upstash/qstash/dist/nextjs";
import prisma from "@/lib/prisma";
import postTweet from "@/services/postTweet";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

async function handler(req: Request) {
  const body = await req.json();
  const { text, reply, media, accessToken, accessSecret, scheduleId } = body;
  try {
    const response = await postTweet(
      text,
      reply,
      media,
      accessToken,
      accessSecret
    );

    let newStatus;

    if (response === 429) {
      newStatus = "Limite de requisições excedido";
    } else if (response === 401) {
      newStatus = "Erro de autenticação";
    } else if (response === 590) {
      newStatus = "Texto muito longo";
    } else if (response === 591) {
      newStatus =
        "Arquivo de mídia não suportado (provavelmente é muito pesado)";
    } else if (response === undefined) {
      newStatus = "Erro ao postar tweet";
    } else {
      newStatus = "Tweet postado";
    }

    const schedule = await prisma.schedule.update({
      where: {
        id: scheduleId,
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
  } catch (error) {
    console.error(error);
    let newStatus = "Erro ao postar tweet";

    await prisma.schedule.update({
      where: {
        id: scheduleId,
      },
      data: {
        status: newStatus,
      },
    });
    return NextResponse.json(
      { message: "Erro ao executar agendamento" },
      { status: 500 }
    );
  }
}

export const POST = verifySignatureEdge(handler);
