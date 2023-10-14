import getMe from "@/services/getMe";
import credentials from "@/utils/credentials";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("POST /api/login");

    const body = await request.json();
    const appKey = body.appKey;
    const appSecret = body.appSecret;
    const accessToken = body.accessToken;
    const accessSecret = body.accessSecret;

    credentials.appKey = appKey;
    credentials.appSecret = appSecret;
    credentials.accessToken = accessToken;
    credentials.accessSecret = accessSecret;

    const response = await getMe();

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

    credentials.accountUsername = response.data.username;

    return NextResponse.json("Credenciais salvas com sucesso", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
    });
  }
}
