"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/user-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UnpublishedChangesProvider } from "@/contexts/unpublished-changes-context";
import { User } from "@/types/user";

export function Providers({ children, user }: { children: React.ReactNode, user: User | null }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider user={user}>
        <TooltipProvider>
          <UnpublishedChangesProvider>
            {children}
          </UnpublishedChangesProvider>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  );
}