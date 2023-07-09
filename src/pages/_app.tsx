import { type AppType } from "next/app";
import type { AppProps } from "next/app";
// import { Metadata } from "next";
import { api } from "@/utils/api";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignInButton,
} from "@clerk/nextjs";
import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import SiteFooter from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <div
        className={cn(
          "h-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <section className="container grid items-center gap-6 pb-8 pt-6 sm:py-2 md:py-10 ">
              <Component {...pageProps} />
            </section>
          </div>
          <TailwindIndicator />
          <Toaster />
        </ThemeProvider>
        <SiteFooter />
      </div>
      <SignedIn />
      <SignedOut>
        {/* <RedirectToSignIn /> */}
        <SignInButton />
      </SignedOut>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
