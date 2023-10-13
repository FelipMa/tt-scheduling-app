import dayjs from "dayjs";
import { NextResponse } from "next/server";
import postTweet from "@/services/postTweet";
import schedulings from "@/utils/schedulings";

export async function POST(request: Request) {
  function runSchedule(time: any) {
    console.log(`Agendamento executado em ${time}`);
    schedulings.push(time);
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

    setTimeout(() => {
      runSchedule(targetDate);
    }, timeUntilTargetMs);

    const response = {
      message: `Tweet agendado para ${now
        .add(timeUntilTarget, "second")
        .format("YYYY-MM-DD HH:mm:ss")}`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
