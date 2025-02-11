"use client";

import Link from "next/link";
import { User } from "@/components/user";
import { RepoDropdown } from "@/components/repo/repo-dropdown";
import { RepoNav } from "@/components/repo/repo-nav";
import { About } from "@/components/about";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { UnpublishedChanges } from "./unpublished-changes";
import { SidebarHeader, SidebarContent, Sidebar, SidebarFooter } from "../ui/sidebar";

const RepoSidebar = ({
  onClick
}: {
  onClick?: () => void
}) => {
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link className={`${buttonVariants({ variant: "ghost", size: "xs" })} w-fit`} href="/">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            All projects
          </Link>
          <RepoDropdown onClick={onClick} />
        </SidebarHeader>
        <SidebarContent>
          <RepoNav onClick={onClick} />
        </SidebarContent>
        <SidebarFooter>
          <UnpublishedChanges />
          <div className="flex justify-between">
            <User className="mr-auto" onClick={onClick} />
            <About onClick={onClick} />
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

export { RepoSidebar };