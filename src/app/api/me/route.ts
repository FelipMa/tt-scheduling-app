import getMe from "@/services/getMe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("GET /api/me");

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

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
