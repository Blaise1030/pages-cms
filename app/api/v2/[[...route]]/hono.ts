import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import page from "./pages";
import { Hono } from "hono";

export const app = new Hono()
  .basePath("/api/v2/")
  .use("*", logger())
  .use("*", cors())
  .use("*", prettyJSON())
  .get("/health", (c) => {
    return c.json({
      status: "ok",
      version: "2.0.0",
      timestamp: new Date().toISOString(),
    });
  })
  .onError((err, c) => {
    console.error(`[ERROR] ${err}`);
    return c.json({ status: "error", message: err.message }, 500);
  });

const route = app.route("/page", page)

export type AppType = typeof route;
