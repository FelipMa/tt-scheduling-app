import { NextResponse } from "next/server";
import postTweet from "@/services/postTweet";

export async function POST(request: Request) {
  try {
    console.log("GET /api/tweet");

    const body = await request.json();
    const { text } = body;

    const response = await postTweet(text);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
