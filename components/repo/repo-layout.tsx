"use client";

import { SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import { RepoSidebar } from "@/components/repo/repo-sidebar";

export function RepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <SidebarProvider>
        <RepoSidebar />
        <main className="w-full p-4 mx-auto">
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}