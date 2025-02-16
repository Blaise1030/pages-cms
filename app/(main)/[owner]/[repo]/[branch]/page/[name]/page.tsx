"use client";

import { PageEditor } from "@/components/page-builder";
import { useConfig } from "@/contexts/config-context";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const path = searchParams.get("path") || "";

  const { config } = useConfig();
  if (!config) throw new Error(`Configuration not found.`);

  return (<PageEditor />);
}