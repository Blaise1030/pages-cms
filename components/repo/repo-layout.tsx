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

  const isPageEditor = true;


  return (
    <React.Fragment>

      <SidebarProvider>
        {!isPageEditor && <RepoSidebar />}
        <main className={`w-full ${isPageEditor ? '' : 'p-4'} mx-auto`}>
          {children}
        </main>
      </SidebarProvider>
    </React.Fragment>
  );
}