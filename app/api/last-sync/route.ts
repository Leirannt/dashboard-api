import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET() {
  const [rows]: any = await db.execute(
    "SELECT last_sync FROM sync_log ORDER BY id DESC LIMIT 1"
  );

  return NextResponse.json(rows[0] || {});
}