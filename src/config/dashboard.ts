import { type DashboardConfig } from "@/types";

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
      // icon: "settings",
    },
    {
      title: "Story Mode",
      href: "/story",
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
