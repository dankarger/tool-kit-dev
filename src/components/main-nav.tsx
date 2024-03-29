import * as React from "react";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { type NavItem } from "@/types/index";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

interface MainNavProps {
  items?: NavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  // if(!theme.theme=== undefined) theme.theme = 'light'
  const [isSelected, setIsSelected] = React.useState(
    siteConfig.mainNav[0]?.title
  );
  const path = usePathname();

  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  if (!items) return null;
  return (
    <div className="flex gap-6 pl-11 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",

                    path === item.href ? "underline" : "transparent"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}

          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
    </div>
  );
}
