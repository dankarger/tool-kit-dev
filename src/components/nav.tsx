import Link from "next/link";
import { usePathname } from "next/navigation";
import { type SidebarNavItem } from "@/types";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface DashboardNavProps {
  items: SidebarNavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    // <nav className="grid items-start gap-2">
    <nav className="flex w-[400px]  flex-row flex-wrap  justify-start sm:w-full sm:flex-row sm:gap-1 md:w-[300px] md:flex-col md:gap-1 lg:w-full lg:flex-col lg:gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href}>
              <span
                className={cn(
                  "sm:font-small group flex w-[150px] items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
