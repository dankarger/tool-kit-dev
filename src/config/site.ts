export type SiteConfig = typeof siteConfig;
import { type DashboardConfig } from "@/types";
export const INTERNAL_VERSION = "1.5";

export const siteConfig = {
  name: "GPTool-Kit",
  description: "Unleash the Power of ChatGPT.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Tools",
      href: "/chat",
    },
    {
      title: "Games",
      href: "/games",
    },
  ],

  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/dankarger",
    docs: "https://ui.shadcn.com",
  },
};

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],

  sidebarNav: [
    {
      title: "Chat",
      href: "/chat",
      icon: "post",
    },
    {
      title: "Translate",
      href: "/translate",
      icon: "billing",
    },
    {
      title: "Summarize",
      href: "/summarize",
      icon: "moon",
    },
    {
      title: "Story Mode",
      href: "/story",
      icon: "image",
    },
  ],
};
