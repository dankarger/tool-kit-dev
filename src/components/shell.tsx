import * as React from "react";
import { dashboardConfig } from "@/config/site";
import { DashboardNav } from "@/components/nav";
import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      <div className="grid flex-1 gap-12 md:container lg:container md:grid-cols-[200px_1fr]">
        <aside className=" w-[300px] flex-col sm:w-[900px]  md:flex md:w-[500px]">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        {children}
      </div>
    </div>
  );
}
