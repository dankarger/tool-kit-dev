import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { chatRouter } from "./routers/chat";
import { sessionRouter } from "./routers/session";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  chat: chatRouter,
  session: sessionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
