"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConfig } from "@/contexts/config-context";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";
import { FileStack, FileText, Image as ImageIcon, Settings, Users } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenu } from "../ui/sidebar";
import React from "react";

const RepoNavItem = ({
  children,
  href,
  icon,
  active,
  onClick
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}) => (
  <Link
    onClick={onClick}
    href={href}
  >
    <SidebarMenuItem className={cn(active ? "bg-accent" : "hover:bg-accent")}>
      <SidebarMenuButton>
        {icon}
        <span className="truncate">{children}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </Link>

);

const RepoNav = ({
  onClick
}: {
  onClick?: () => void;
}) => {
  const { config } = useConfig();
  const { user } = useUser();
  const pathname = usePathname();

  const items = useMemo(() => {
    if (!config || !config.object) return [];
    const configObject: any = config.object;
    const contentItems = configObject.content?.map((item: any) => ({
      key: item.name,
      icon: item.type === "collection"
        ? <FileStack className="h-5 w-5 mr-2" />
        : <FileText className="h-5 w-5 mr-2" />
      ,
      href: `/${config.owner}/${config.repo}/${config.branch}/${item.type}/${encodeURIComponent(item.name)}`,
      label: item.label || item.name,
    })) || [];

    const mediaItem = configObject.media?.input && configObject.media?.output
      ? {
        key: "media",
        icon: <ImageIcon className="h-5 w-5 mr-2" />,
        href: `/${config.owner}/${config.repo}/${config.branch}/media`,
        label: "Media"
      }
      : null;

    const settingsItem = configObject.settings !== false
      ? {
        key: "settings",
        icon: <Settings className="h-5 w-5 mr-2" />,
        href: `/${config.owner}/${config.repo}/${config.branch}/settings`,
        label: "Settings"
      }
      : null;

    const collaboratorsItem = configObject && Object.keys(configObject).length !== 0 && user?.githubId
      ? {
        key: "collaborators",
        icon: <Users className="h-5 w-5 mr-2" />,
        href: `/${config.owner}/${config.repo}/${config.branch}/collaborators`,
        label: "Collaborators"
      }
      : null;

    return [
      ...contentItems,
      mediaItem,
      settingsItem,
      collaboratorsItem
    ].filter(Boolean);
  }, [config]);

  if (!items.length) return null;

  return (
    <>
      <SidebarMenu>
        {items.map(item => (
          <React.Fragment key={item.key}>
            {item.key === 'media' && <div className="border-b w-full" />}
            <RepoNavItem
              icon={item.icon}
              href={item.href}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              onClick={onClick}
            >
              {item.label}
            </RepoNavItem>
          </React.Fragment>
        ))}
      </SidebarMenu>

    </>
  );
}

export { RepoNav };