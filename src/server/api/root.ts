import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { chatRouter } from "./routers/chat";
import { sessionRouter } from "./routers/session";
import { TranslateRouter } from "./routers/translate";
import { summarizeRouter } from "./routers/summarize";
import { storyRouter } from "./routers/story";
import { gamesRouter } from "./routers/games";
/**

* This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  chat: chatRouter,
  session: sessionRouter,
  translate: TranslateRouter,
  summarize: summarizeRouter,
  story: storyRouter,
  games: gamesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
