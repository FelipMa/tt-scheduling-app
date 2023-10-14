import getMe from "@/services/getMe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("POST /api/me");

    const body = await request.json();
    const { twitterClient } = body;

    const response = await getMe(twitterClient);

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

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
