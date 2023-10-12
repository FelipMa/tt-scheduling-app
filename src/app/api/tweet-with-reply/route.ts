import { NextResponse } from "next/server";
import postTweetWithReply from "@/services/postTweetWithReply";

export async function POST(request: Request) {
  try {
    console.log("GET /api/tweet-with-reply");

    const body = await request.json();
    const { text, reply } = body;

    const response = await postTweetWithReply(text, reply);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
