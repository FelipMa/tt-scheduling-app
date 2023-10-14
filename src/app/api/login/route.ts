import getMe from "@/services/getMe";
import { NextResponse } from "next/server";
import { generateTwitterClient } from "@/utils/userClient";

export async function POST(request: Request) {
  try {
    console.log("POST /api/login");

    const body = await request.json();
    const appKey = body.appKey;
    const appSecret = body.appSecret;
    const accessToken = body.accessToken;
    const accessSecret = body.accessSecret;

    const twitterClient = generateTwitterClient(
      appKey,
      appSecret,
      accessToken,
      accessSecret
    );

    const userData = await getMe(twitterClient);

    if (!userData) {
      throw new Error("Internal Server Error");
    }

    if (userData === 429) {
      return NextResponse.json(
        { message: "Too Many Requests" },
        { status: 429 }
      );
    }

    if (userData === 401) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = {
      twitterClient,
      userData,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
    });
  }
}
