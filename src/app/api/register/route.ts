import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validations";

const DATA_DIR = path.join(process.cwd(), "data");
const MD_FILE = path.join(DATA_DIR, "users.md");

async function ensureMdFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(MD_FILE);
  } catch {
    const header =
      "| Full Name | Username | Email | Phone | Password | Institution |\n|-----------|----------|-------|-------|----------|-------------|\n";
    await fs.writeFile(MD_FILE, header, "utf-8");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { fullName, username, email, phone, password, institution } = parsed.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.username === username ? "Username already taken" : "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        phone,
        password: hashedPassword,
        institution,
      },
    });

    await ensureMdFile();
    const row = `| ${fullName} | ${username} | ${email} | ${phone} | ${password} | ${institution} |\n`;
    await fs.appendFile(MD_FILE, row, "utf-8");

    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}