export type SiteConfig = typeof siteConfig;
import { DashboardConfig } from "@/types";
export const INTERNAL_VERSION = "1.5";

export const siteConfig = {
  name: "GPTool-Kit",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Tools",
      href: "/chat",
    },
    // {
    //   title: "Translate",
    //   href: "/translate",
    // },
    // {
    //   title: "Summarize",
    //   href: "/summarize",
    // },
    {
      title: "Story Mode",
      href: "/story",
    },
    {
      title: "Games",
      href: "/games",
    },
    // {
    //   title: "Tic Tac Toe",
    //   href: "/tic-tac-toe",
    // },
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
      icon: "settings",
    },
    // {
    //   title: "Summarize",
    //   href: "/summarize",
    //   icon: "settings",
    // },
    // {
    //   title: "Summarize",
    //   href: "/summarize",
    //   icon: "settings",
    // },
    // {
    //   title: "Summarize",
    //   href: "/summarize",
    //   icon: "settings",
    // },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/",
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
      icon: "settings",
    },
    // {
    //   title: "Summarize",
    //   href: "/summarize",
    //   icon: "settings",
    // },
    // {
    //   title: "Summarize",
    //   href: "/summarize",
    //   icon: "settings",
    // },
    // {
    //   title: "Summarize",
    //   href: "/summarize",
    //   icon: "settings",
    // },
  ],
};
