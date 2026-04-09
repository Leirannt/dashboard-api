import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET() {
  const res = await fetch("https://api.spacexdata.com/v4/launches");
  const launches = await res.json();

  for (let launch of launches) {

    // cek success
    const category = launch.success ? "success" : "failed";

    await db.execute(
      `INSERT INTO launches (id, name, category, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       category = VALUES(category),
       updated_at = NOW()`,
      [
        launch.id,
        launch.name,
        category,
        launch.date_utc
      ]
    );
  }

  return NextResponse.json({ message: "Sync SpaceX success" });
}