import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";

interface AdminUser {
  username: string;
  password: string;
}

function getAdminUsers(): AdminUser[] {
  const raw = process.env.ADMIN_USERS;
  if (!raw) return [];
  return raw.split(",").map((entry) => {
    const [username, password] = entry.split(":");
    return { username, password };
  });
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const admins = getAdminUsers();

    if (admins.length === 0) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const match = admins.find(
      (a) => a.username === username && a.password === password
    );

    if (!match) {
      return NextResponse.json(
        { error: "Jina la mtumiaji au nenosiri si sahihi" },
        { status: 401 }
      );
    }

    await createSession();

    return NextResponse.json({ message: "Login umefanikiwa" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Kuna tatizo. Tafadhali jaribu tena." },
      { status: 500 }
    );
  }
}