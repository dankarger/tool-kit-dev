export type SiteConfig = typeof siteConfig;

export const INTERNAL_VERSION = "1.4";

export const siteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Chat",
      href: "/chat",
    },
    {
      title: "Translate",
      href: "/translate",
    },
    {
      title: "Story Mode",
      href: "/story",
    },
    {
      title: "Tic Tac Toe",
      href: "/tic-tac-toe",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
};

export const sidebarNavConfig = {
  chat: {
    sidebarNav: [
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
  },
  translate: {
    sidebarNav: [
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
  },
};
