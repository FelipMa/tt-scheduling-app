import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  console.log("GET /api/schedulings");
  try {
    const schedulings = await prisma.schedule.findMany({});

    return NextResponse.json(schedulings, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Internal database error",
      },
      { status: 500 }
    );
  }
}