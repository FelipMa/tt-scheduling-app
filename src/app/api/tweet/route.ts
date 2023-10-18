import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import postTweet from "@/services/postTweet";
import prisma from "@/lib/prisma";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Not implemented yet" });
}
