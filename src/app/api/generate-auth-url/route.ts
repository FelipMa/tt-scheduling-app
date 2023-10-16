import getAuthCallbackUrl from "@/services/getAuthCallbackUrl";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("GET /api/generate-auth-url");

    const authUrl = await getAuthCallbackUrl();

    return NextResponse.json({ authUrl }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
