import { NextResponse } from "next/server";
import postTweetWithMediaAndReply from "@/services/postTweetWithMediaAndReply";

export async function POST(request: Request) {
  try {
    console.log("GET /api/tweet-with-media-and-reply");

    const body = await request.json();
    const { text, reply } = body;
    /* to do media */

    const response = await postTweetWithMediaAndReply(text, reply);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
