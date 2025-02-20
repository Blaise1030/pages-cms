import { AppType } from "@/app/api/v2/[[...route]]/hono";
import { hc } from "hono/client";

export const client = hc<AppType>("http://localhost:3000/");
