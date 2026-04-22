import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifySession } from "@/lib/session";

const MD_FILE = path.join(process.cwd(), "data", "users.md");

export async function GET() {
  const isAuthenticated = await verifySession();

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "Huna ruhusa. Tafadhali ingia kwanza." },
      { status: 401 }
    );
  }

  try {
    const fileContent = await fs.readFile(MD_FILE, "utf-8");
    return new Response(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="users.md"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Faili halipatikani" },
      { status: 404 }
    );
  }
}