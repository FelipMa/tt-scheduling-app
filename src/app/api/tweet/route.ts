import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import postTweet from "@/services/postTweet";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import uploadMediaForTwitter from "@/services/uploadMediaForTwitter";
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const text = data.get("text") as string;
    const reply = data.get("reply") as string;
    const media = data.get("media") as File | string;
    const accessToken = data.get("accessToken") as string;
    const accessSecret = data.get("accessSecret") as string;

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

    const targetDate = dayjs(Date.now())
      .tz("America/Bahia")
      .format("DD/MM/YYYY HH:mm:ss [UTC]Z");

    let mediaId = null;

    if (typeof media !== "string") {
      const id = await uploadMediaForTwitter(media, accessToken, accessSecret);
      if (typeof id === "string") {
        mediaId = id;
      } else {
        if (id === 591) {
          throw new Error("Unsupported media file (probably too heavy)");
        }
        throw new Error("Erro ao carregar mídia");
      }
    }

    const response = await postTweet(
      text,
      reply,
      mediaId,
      accessToken,
      accessSecret
    );

    if (response === 429) {
      throw new Error("Too Many Requests");
    } else if (response === 401) {
      throw new Error("Unauthorized");
    } else if (response === 590) {
      throw new Error("Text too long");
    } else if (response === undefined) {
      throw new Error("Internal Server Error");
    }

    return NextResponse.json(response, { status: 200 });
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
    } else if (
      error.message === "Unsupported media file (probably too heavy)"
    ) {
      return NextResponse.json(
        { message: "Unsupported media file (probably too heavy)" },
        { status: 591 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
