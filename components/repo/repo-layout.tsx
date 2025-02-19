"use client";

import { SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { RepoSidebar } from "@/components/repo/repo-sidebar";
import React from "react";

export function RepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isPageEditor = /\/[^/]+\/[^/]+\/[^/]+\/page/.test(pathname);

  return (
    <React.Fragment>
      {
        isPageEditor ?
          <main className="w-full mx-auto">
            {children}
          </main> :
          <SidebarProvider>
            <RepoSidebar />
            <main className="w-full p-4 mx-auto">
              {children}
            </main>
          </SidebarProvider>
      }
    </React.Fragment>
  );
}