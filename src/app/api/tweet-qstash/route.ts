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
  try {
    const body = await req.json();
    const { text, reply, mediaId, accessToken, accessSecret, scheduleId } =
      body;

    const response = await postTweet(
      text,
      reply,
      mediaId,
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
    } else if (response === undefined) {
      newStatus = "Erro ao postar tweet";
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

    if (response === 429) {
      throw new Error("Too Many Requests");
    } else if (response === 401) {
      throw new Error("Unauthorized");
    } else if (response === 590) {
      throw new Error("Text too long");
    } else if (response === undefined) {
      throw new Error("Internal Server Error");
    }

    console.info(
      `Programado para ${schedule.targetDate}, executado em ${dayjs()
        .tz("America/Bahia")
        .format("DD/MM/YYYY HH:mm:ss [UTC]Z")}`
    );

    return NextResponse.json({ message: "Schedule executed" }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Too Many Requests") {
      return NextResponse.json(
        { message: "Too Many Requests" },
        { status: 429 }
      );
    } else if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } else if (error.message === "Text too long") {
      return NextResponse.json({ message: "Text too long" }, { status: 590 });
    }

    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = verifySignatureEdge(handler);
