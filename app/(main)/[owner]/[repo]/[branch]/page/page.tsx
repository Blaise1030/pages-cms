"use client";

import { useSearchParams } from "next/navigation";
import { useConfig } from "@/contexts/config-context";
import { PageEditor } from "@/components/page-builder";

export default function Page() {
  const searchParams = useSearchParams();
  const path = searchParams.get("path") || "";

  const { config } = useConfig();
  if (!config) throw new Error(`Configuration not found.`);

  return (
    <div className="mx-auto flex-1 flex flex-col h-full">

      <div className="flex flex-col relative flex-1">
        <PageEditor />
      </div>
    </div>
  );
}