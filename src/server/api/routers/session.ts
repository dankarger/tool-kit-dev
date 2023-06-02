import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "@/server/helpers/filterUserForClient";
import { prisma } from "@/server/db";

export const sessionRouter = createTRPCRouter({
  createChatSession: privateProcedure
    .input(
      z.object({
        authorId: z.string(),
        name: z.string().optional(),
        title: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      if (!authorId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const newSession = await prisma.chatSession.create({
        data: { authorId: authorId, name: input.name, title: input.title },
      });
      console.log("newsession", newSession.id);
      // const sessionId = await ctx.prisma.chatSession.findUnique({
      //   where: { id: newSession.id },
      //   // select: { id: true }
      // });
      if (!newSession) throw new TRPCError({ code: "NOT_FOUND" });
      console.log("sessionIdn222222-3333--222222", newSession);
      return newSession.id;
    }),
  getChatSessionsByAuthorId: privateProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chatSession = await ctx.prisma.chatSession.findMany({
        where: {
          authorId: { equals: input.authorId },
          // messages:{some:{}},
        },
        include: {
          messages: true,
        },
      });
      const filteredSessions = chatSession.filter((session) => {
        if (session.messages?.length !== 0) return session;
      });
      // console.log("filteredSessions", filteredSessions);
      if (!filteredSessions) throw new TRPCError({ code: "NOT_FOUND" });

      return filteredSessions;
    }),
  // getChatSessionMessagesBySessionId: privateProcedure
  //   .input(z.object({ sessionId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const session = await ctx.prisma.chatSession.findFirst({
  //       where: { sessionId: input.sessionId },
  //     });
  //     return session;
  //   }),
});
