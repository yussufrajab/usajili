import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  await deleteSession();
  return NextResponse.json({ message: "Logout umefanikiwa" }, { status: 200 });
}