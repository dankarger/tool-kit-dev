import { DashboardConfig } from "@/types";

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
      title: "Posts",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
  chat: [
    {
      title: "Chat",
      href: "/chat",
      icon: "post",
    },
    {
      title: "History",
      href: "/chat/history",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/chat/settings",
      icon: "settings",
    },
  ],
  translate: [
    {
      title: "Translate",
      href: "/translate",
      icon: "post",
    },
    {
      title: "History",
      href: "/translate/history",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/translate/settings",
      icon: "settings",
    },
  ],
  story: [
    {
      title: "Story Generator",
      href: "/story",
      icon: "post",
    },
    {
      title: "History",
      href: "/story/history",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/story/settings",
      icon: "settings",
    },
  ],
  tictactoe: [
    {
      title: "Play",
      href: "/tic-tac-toe",
      icon: "post",
    },
    {
      title: "History",
      href: "/tic-tac-toe/history",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/tic-tac-toe/settings",
      icon: "settings",
    },
  ],
};
