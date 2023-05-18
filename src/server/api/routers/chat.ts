import { z } from "zod";
// import openai from "@/lib/openai";
import { clerkClient } from "@clerk/nextjs";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "@/server/api/trpc";
import { ChatMessage } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const chatRouter = createTRPCRouter({
  sendPrompt: privateProcedure
    .input(z.string().min(1).max(280))
    .mutation(async ({ input }) => {
      // const response = await openai.createChatCompletion({
      //   model: "gpt-3.5-turbo",
      //   messages: [{ role: "user", content: input }],
      //   // prompt: "Say it s party time",
      //   max_tokens: 90,
      //   stop: "\n",
      //   temperature: 0.9,
      // });
      // console.log("response2", response.data.choices);
      // const data = response.data.choices[0].message.content;

      const data = `mock response ${input}`;
      if (!data) throw new TRPCError({ code: "NOT_FOUND" });
      return {
        response: `: ${data}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: privateProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  create: privateProcedure
    .input(
      z.object({
        message: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      // const { success } = await ratelimit.limit(authorId);

      // if (!success) {
      //   throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      // }
      const respone = "mock response2 ";
      const chatMessage = await ctx.prisma.chatMessage.create({
        data: {
          authorId,
          message: input.message,
          response: respone,
        },
      });
      // const chat = `it will be the responce fropm openai for prompt: ${input.content}`;
      return chatMessage;
    }),
});
