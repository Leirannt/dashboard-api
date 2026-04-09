import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET() {

  const [rows] = await db.execute(
    `SELECT *
     FROM launches
     ORDER BY created_at DESC`
  );

  return NextResponse.json(rows);
}