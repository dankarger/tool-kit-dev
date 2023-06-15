import * as React from "react";
import { siteConfig } from "@/config/site";
import { dashboardConfig } from "@/config/site";
import { DashboardNav } from "@/components/nav";
import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  // header?: React.ReactNode;
  // footer?: React.ReactNode;
  // sidebar?: React.ReactNode;
  // main?: React.ReactNode;
  // mainClassName?: string;
  // sidebarClassName?: string;
  // headerClassName?: string;
  // footerClassName?: string;
  // mainContainerClassName?: string;
  // sidebarContainerClassName?: string;
  // headerContainerClassName?: string;
  // footerContainerClassName?: string;
  // mainContainerStyle?: React.CSSProperties;
  // sidebarContainerStyle?: React.CSSProperties;
  // headerContainerStyle?: React.CSSProperties;
  // footerContainerStyle?: React.CSSProperties;
  // mainContainerRef?: React.RefObject<HTMLDivElement>;
  // sidebarContainerRef?: React.RefObject<HTMLDivElement>;
  // headerContainerRef?: React.RefObject<HTMLDivElement>;
  // footerContainerRef?: React.RefObject<HTMLDivElement>;
  // mainContainerProps?: React.HTMLAttributes<HTMLDivElement>;
  // sidebarContainerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      <div className="grid flex-1 gap-12 md:container lg:container md:grid-cols-[200px_1fr]">
        <aside className=" w-[200px] flex-col sm:w-0 md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        {children}
      </div>
    </div>
  );
}
