import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        console.log("ID:", id);

        await db.execute("DELETE FROM users WHERE id = ?", [id]);

        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const { name, category } = body;

        await db.execute(
            "UPDATE users SET name = ?, category = ?, updated_at = NOW() WHERE id = ?",
            [name, category, id]
        );

        return Response.json({ message: "Updated" });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed" }, { status: 500 });
    }
}


