import getMe from "@/services/getMe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("GET /api/me");

    const response = await getMe();

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
