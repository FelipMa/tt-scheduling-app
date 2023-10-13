import { NextResponse } from "next/server";
import postTweet from "@/services/postTweet";

export async function POST(request: Request) {
  try {
    console.log("POST /api/tweet");

    const data = await request.formData();
    const text = data.get("text") as string;
    const reply = data.get("reply") as string;
    const media = data.get("media") as File | string;

    const response = await postTweet(text, reply, media);

    if (!response) {
      throw new Error("Internal Server Error");
    }

    if (response === 429) {
      return NextResponse.json(
        { message: "Too Many Requests" },
        { status: 429 }
      );
    }

    if (response === 401) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (response === 590) {
      return NextResponse.json({ message: "Text too long" }, { status: 590 });
    }

    if (response === 591) {
      return NextResponse.json(
        { message: "Failed to process media" },
        { status: 591 }
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
