import { User } from "@prisma/client";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/icons";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type HomePageConfig = {
  title: string;
  subtitle: string;
  content: {
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
    features1: { title: string; description: string }[];
    features2: string[];
  };
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  // chat: SidebarNavItem[];
  // translate: SidebarNavItem[];
  // story: SidebarNavItem[];
  // tictactoe: SidebarNavItem[];
};

// export type SubscriptionPlan = {
//   name: string
//   description: string
//   stripePriceId: string
// }

// export type UserSubscriptionPlan = SubscriptionPlan &
//   Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
//     stripeCurrentPeriodEnd: number
//     isPro: boolean
//   }

//chat
export interface Response {
  message?: string;
  response?: string;
  authorId?: string;
}
export interface ResponseSectionProps {
  responses: Response[];
}

// sessions

export interface Session {
  name: string;
  id: string;
  type?: string;
}

export interface StoryResult {
  id: string;
  createdAt: Date;
  title: string;
  text: string;
  resultText: string;
  resultPrompt: string;
  resultImageUrl: string;
  authorId: string;
}
export interface ChatMessage {
  id: string;
  createdAt: Date;
  message: string;
  response: string;
  authorId: string;
  session: ChatSession[];
  sessionId: string?;
}

export interface Response {
  message: string;
  response: string;
  authorId: string;
  sessionId: string;
}

export interface Result {
  createdAt: Date;
  text: string;
  result: string;
  id: string;
}

// Pages :

export interface HomePageConfig {
  title: string;
  subtitle: string;
  content: { paragraph1: string; paragraph2: string };
}
