import * as React from "react";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { NavItem } from "@/types/index";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { dark, light } from "@clerk/themes";
import { useTheme } from "next-themes";

interface MainNavProps {
  items?: NavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, children }: MainNavProps) {
  const theme = useTheme();
  console.log(dark);
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  // const user = useUser();
  // const username = user.user?.username || "User";
  return (
    <div className="flex gap-6 md:gap-10">
      <UserButton
        appearance={{
          variables: {},
          userProfile: {
            elements: {
              breadcrumbs: "bg-slate-500",
              formButtonPrimary:
                "bg-slate-500 hover:bg-slate-400 text-sm normal-case",

              userPreviewAvatarContainer__personalWorkspace: "bg-slate-900",
            },
          },
          baseTheme: theme.theme === "dark" ? dark : light,
        }}
      />
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        {/* <Icons.logo className="h-6 w-6" /> */}
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
          {/* {username} */}
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
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
          {/* <UserButton /> */}
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
