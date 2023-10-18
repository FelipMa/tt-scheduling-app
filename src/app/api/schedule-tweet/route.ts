import dayjs from "dayjs";
import { NextResponse } from "next/server";
import postTweet from "@/services/postTweet";
import prisma from "@/lib/prisma";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axios from "axios";
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const text = data.get("text") as string;
    const reply = data.get("reply") as string;
    const media = data.get("media") as File | string;
    const unixString = data.get("unixTime") as string;
    const accessToken = data.get("accessToken") as string;
    const accessSecret = data.get("accessSecret") as string;
    const accountUsername = data.get("accountUsername") as string;

    const now = dayjs(Date.now());
    const unixNow = now.unix();

    const targetUnixTime = parseInt(unixString);
    const timeUntilTarget = targetUnixTime - unixNow;

    const targetDate = dayjs(targetUnixTime * 1000)
      .tz("America/Bahia")
      .format("DD/MM/YYYY HH:mm:ss [UTC]Z");

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

    const qstashToken = process.env.QSTASH_TOKEN;

    try {
      const res = axios.post(
        "https://qstash.upstash.io/v2/publish/https://tt-scheduling-app.vercel.app/api/tweet-qstash",
        {
          text: text,
          reply: reply,
          media: media,
          accessToken: accessToken,
          accessSecret: accessSecret,
          scheduleId: schedule.id,
        },
        {
          headers: {
            Authorization: `Bearer ${qstashToken}`,
            "Upstash-Delay": `${timeUntilTarget}s`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao agendar tweet");
    }

    console.log("Success");
    return NextResponse.json(schedule, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
