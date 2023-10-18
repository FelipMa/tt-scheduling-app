import { NextResponse } from "next/server";
import loginByPin from "@/services/loginByPin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessToken, accessSecret, pin } = body;

    const response = await loginByPin(accessToken, accessSecret, pin);

    if (!response) {
      throw new Error("Internal Server Error");
    }

    if (response === 429) {
      throw new Error("Too Many Requests");
    }

    if (response === 401) {
      throw new Error("Unauthorized");
    }

    console.log("Success");
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    if (error.message === "Too Many Requests") {
      return NextResponse.json(
        { message: "Too Many Requests" },
        { status: 429 }
      );
    }

    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
