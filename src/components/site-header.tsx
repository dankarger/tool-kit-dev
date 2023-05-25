import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function SiteHeader() {
  const theme = useTheme();

  // console.log(theme);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2.5">
            {/* <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link> */}
            <ThemeToggle />
            <UserButton
              appearance={{
                variables: {},
                userProfile: {
                  elements: {
                    breadcrumbs: "bg-slate-500",
                    formButtonPrimary:
                      "bg-slate-500 hover:bg-slate-400 text-sm normal-case",

                    userPreviewAvatarContainer__personalWorkspace:
                      "bg-slate-900",
                  },
                },
                baseTheme: theme?.theme === "dark" ? dark : undefined,
              }}
            />
          </nav>
        </div>
      </div>
    </header>
  );
}
