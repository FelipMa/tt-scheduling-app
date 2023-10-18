import getAuthCallbackUrl from "@/services/getAuthCallbackUrl";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authUrl = await getAuthCallbackUrl();

    return NextResponse.json({ authUrl }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
