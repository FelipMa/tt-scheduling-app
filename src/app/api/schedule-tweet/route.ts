import dayjs from "dayjs";
import { NextResponse } from "next/server";
import postTweet from "@/services/postTweet";
import schedulings from "@/utils/schedulings";
import Schedule from "@/utils/Schedule";
import credentials from "@/utils/credentials";
import { generateTwitterClient } from "@/utils/userClient";
import { TwitterApiReadWrite } from "twitter-api-v2";

export async function POST(request: Request) {
  async function runSchedule(
    targetDate: string,
    text: string,
    reply: string,
    media: string | File,
    schedule: Schedule,
    userClient: TwitterApiReadWrite
  ) {
    try {
      const response = await postTweet(text, reply, media, userClient);

      if (response === 429) {
        schedule.status = "Limite de requisições excedido";
      } else if (response === 401) {
        schedule.status = "Erro de autenticação";
      } else if (response === 590) {
        schedule.status = "Texto muito longo";
      } else if (response === 591) {
        schedule.status =
          "Arquivo de mídia não suportado (provavelmente é muito pesado)";
      } else if (response === undefined) {
        schedule.status = "Erro ao postar tweet";
      } else {
        schedule.status = "Tweet postado";
      }
    } catch (error) {
      console.log(error);
      schedule.status = "Erro ao postar tweet";
    }

    console.log(`Agendamento executado em ${targetDate}`);
  }
  try {
    console.log("POST /api/tweet");

    const data = await request.formData();
    const text = data.get("text") as string;
    const reply = data.get("reply") as string;
    const media = data.get("media") as File | string;
    const unixString = data.get("unixTime") as string;

    const now = dayjs(Date.now());
    const unixNow = now.unix();

    const targetUnixTime = parseInt(unixString);
    const timeUntilTarget = targetUnixTime - unixNow;
    const timeUntilTargetMs = timeUntilTarget * 1000;

    const targetDate = dayjs(targetUnixTime * 1000).format(
      "YYYY-MM-DD HH:mm:ss"
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

    const schedule = new Schedule(
      targetDate,
      textName,
      replyName,
      mediaName,
      credentials.accountUsername
    );
    schedulings.push(schedule);

    const userClient = generateTwitterClient();

    setTimeout(() => {
      runSchedule(targetDate, text, reply, media, schedule, userClient);
    }, timeUntilTargetMs);

    const response = {
      message: `Tweet agendado para ${now
        .add(timeUntilTarget, "second")
        .format("YYYY-MM-DD HH:mm:ss")}`,
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
