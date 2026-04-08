import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/app/lib/db";

export async function GET() {
  const res = await axios.get("https://dummyjson.com/users");
  const users = res.data.users;

  for (let u of users) {
    await db.execute(
      `INSERT INTO users (id, name, category, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       category = VALUES(category),
       updated_at = NOW()`,
      [u.id, u.firstName, u.gender]
    );
  }

  await db.execute(
    `INSERT INTO sync_log (last_sync) VALUES (NOW())`
  );

  return NextResponse.json({ message: "Sync berhasil" });
}