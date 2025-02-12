import { getAuth } from "@/lib/auth";
import { getToken } from "@/lib/token";
import { db } from "@/db";
import { configTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { owner: string; repo: string; branch: string } }
) {
  try {
    const { session, user } = await getAuth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = await getToken(user, params.owner, params.repo);
    if (!token) return Response.json({ error: "Token not found" }, { status: 401 });

    const config = await db.query.configTable.findFirst({
      where: and(
        eq(configTable.owner, params.owner),
        eq(configTable.repo, params.repo),
        eq(configTable.branch, params.branch)
      )
    });
    if (!config) return Response.json({ error: "Config not found" }, { status: 404 });

    return Response.json({ buildHook: config.buildhook });
  } catch (error: any) {
    console.error("Error getting build hook:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { owner: string; repo: string; branch: string } }
) {
  try {
    const { session, user } = await getAuth();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = await getToken(user, params.owner, params.repo);
    if (!token) return Response.json({ error: "Token not found" }, { status: 401 });

    const { buildHook } = await request.json();
    if (typeof buildHook !== "string") {
      return Response.json({ error: "Invalid build hook URL" }, { status: 400 });
    }

    const config = await db.query.configTable.findFirst({
      where: and(
        eq(configTable.owner, params.owner),
        eq(configTable.repo, params.repo),
        eq(configTable.branch, params.branch)
      )
    });
    if (!config) return Response.json({ error: "Config not found" }, { status: 404 });

    // Update the build hook in the database
    await db
      .update(configTable)
      .set({ buildhook: buildHook })
      .where(and(
        eq(configTable.owner, params.owner),
        eq(configTable.repo, params.repo),
        eq(configTable.branch, params.branch)
      ));

    return Response.json({ buildHook });
  } catch (error: any) {
    console.error("Error updating build hook:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}