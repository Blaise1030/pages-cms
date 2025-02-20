import {getAuth} from "@/lib/auth";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {Hono} from "hono";
import {db} from "@/db";
import {pagesTable} from "@/db/schema";
import {and, eq} from "drizzle-orm";

const page = new Hono()
  .post(
    "/:owner/:repo/:branch",
    zValidator("json", z.object({projectData: z.any()})),
    async (c) => {
      try {
        const {owner, repo, branch} = c.req.param();
        const user = c.req.valid("json");

        const {session} = await getAuth();
        if (!session) return c.json(null, 401);

        await db
          .insert(pagesTable)
          .values({
            projectData: user.projectData,
            branch,
            owner,
            repo,
          })
          .onConflictDoUpdate({
            target: [pagesTable.owner, pagesTable.repo, pagesTable.branch],
            set: {projectData: user.projectData},
          });

        return c.json({status: "success"});
      } catch (error: any) {
        console.error(error);
        return c.json({status: "error", message: error.message}, 500);
      }
    }
  )
  .get("/:owner/:repo/:branch", async (c) => {
    try {
      const {owner, repo, branch} = c.req.param();

      const {session} = await getAuth();
      if (!session) return c.json(null, 401);

      const page = await db.query.pagesTable.findFirst({
        where: and(
          eq(pagesTable.owner, owner),
          eq(pagesTable.repo, repo),
          eq(pagesTable.branch, branch)
        ),
      });

      if (!page) {
        return c.json({status: "error", message: "Page not found"}, 404);
      }

      return c.json({
        status: "success",
        data: page?.projectData,
      });
    } catch (error: any) {
      console.error(error);
      return c.json({status: "error", message: error.message}, 500);
    }
  })
  .get("/health", (c) => {
    return c.json({
      status: "ok",
      version: "2.0.0",
      timestamp: new Date().toISOString(),
    });
  });

export default page;
