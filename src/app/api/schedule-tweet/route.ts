import dayjs from "dayjs";
import { NextResponse } from "next/server";
import postTweet from "@/services/postTweet";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  async function runSchedule(
    targetDate: string,
    text: string,
    reply: string,
    media: string | File,
    scheduleId: number,
    appKey: string,
    appSecret: string,
    accessToken: string,
    accessSecret: string
  ) {
    try {
      const response = await postTweet(
        text,
        reply,
        media,
        appKey,
        appSecret,
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

      await prisma.schedule.update({
        where: {
          id: scheduleId,
        },
        data: {
          status: newStatus,
        },
      });
    } catch (error) {
      console.log(error);
      let newStatus = "Erro ao postar tweet";

      await prisma.schedule.update({
        where: {
          id: scheduleId,
        },
        data: {
          status: newStatus,
        },
      });
    }

    console.log(`Agendamento executado em ${targetDate}`);
  }
  try {
    console.log("POST /api/schedule-tweet");

    const data = await request.formData();
    const text = data.get("text") as string;
    const reply = data.get("reply") as string;
    const media = data.get("media") as File | string;
    const unixString = data.get("unixTime") as string;
    const appKey = data.get("appKey") as string;
    const appSecret = data.get("appSecret") as string;
    const accessToken = data.get("accessToken") as string;
    const accessSecret = data.get("accessSecret") as string;
    const accountUsername = data.get("accountUsername") as string;

    const now = dayjs(Date.now());
    const unixNow = now.unix();

    const targetUnixTime = parseInt(unixString);
    const timeUntilTarget = targetUnixTime - unixNow;
    const timeUntilTargetMs = timeUntilTarget * 1000;

    const targetDate = dayjs(targetUnixTime * 1000).format(
      "DD/MM/YYYY HH:mm:ss"
    );

    let textName = "Sem texto";
    if (text) {
      textName = text;
    }

    let mediaName = "Sem mídia";
    if (typeof media !== "string") {
      mediaName = media.name;
    }

    let replyName = "Sem comentário";
    if (reply) {
      replyName = reply;
    }

    const schedule = await prisma.schedule.create({
      data: {
        targetDate: targetDate,
        text: textName,
        reply: replyName,
        media: mediaName,
        accountUsername: accountUsername,
        status: "Agendado",
      },
    });

    setTimeout(() => {
      runSchedule(
        targetDate,
        text,
        reply,
        media,
        schedule.id,
        appKey,
        appSecret,
        accessToken,
        accessSecret
      );
    }, timeUntilTargetMs);

    const response = {
      targetDate,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}