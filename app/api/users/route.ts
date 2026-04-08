import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET() {
  const [rows] = await db.execute(
    "SELECT * FROM users ORDER BY updated_at DESC"
  );

  return NextResponse.json(rows);
}