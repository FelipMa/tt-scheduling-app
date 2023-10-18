import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const schedulings = await prisma.schedule.findMany();

    return NextResponse.json(schedulings, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: "Internal database error",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
