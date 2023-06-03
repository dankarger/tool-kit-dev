import { z } from "zod";
import openai from "@/lib/openai";
import { clerkClient } from "@clerk/nextjs";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "@/server/api/trpc";
import { TranslationResult } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
  CreateEditResponse,
} from "openai";
import { Analytics, Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
// import type {ChatCompletionRequestMessage} from ''
// import { CompletionOpts, Completion, Choice } from "openai-api";

// interface ChatCompletionResponse {
//   data: ChatCompletionResponseMessage;
// }

// interface ChatCompletionRequestCustom extends ChatCompletionRequestMessage {
//   model: string;
//   messages: Message[];
//   max_tokens: 90;
//   stop: "\n";
//   temperature: 0.5;
// }

// Usage example
// const response: ChatCompletionResponse = openai.createChatCompletion(/* ... */);

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
});

export const TranslateRouter = createTRPCRouter({
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),
  getAllTranslationsByAuthorId: privateProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const translationResults = await ctx.prisma.translationResult.findMany({
        where: { authorId: input.authorId },
      });

      if (!translationResults) throw new TRPCError({ code: "NOT_FOUND" });

      return translationResults;
    }),
  getTranlateResultById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("d", input);
      if (input.id === "default-id" || input.id.length === 0)
        return {
          id: "default-id",
          createdAt: new Date(),
          title: "",
          text: "",
          translation: "",
          authorId: "",
          language: "",
        } as TranslationResult;
      const result = await ctx.prisma.translationResult.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      return result;
    }),

  createTranslation: privateProcedure
    .input(
      z.object({
        text: z.string(),
        language: z.string().min(1).max(20),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      console.log("input.messages", input.text);
      // const prompt = `we are having a chat ,this is our chat history so far: ${input.messages.flat()}`;
      if (!input.text) throw new TRPCError({ code: "NOT_FOUND" });

      const response = await openai.createEdit({
        model: "text-davinci-edit-001",
        input: input.text,
        instruction: `translate to this text to ${input.language}`,
      });
      //
      //
      // console.log("response-----------", response.data);
      if (!response.data) throw new TRPCError({ code: "NOT_FOUND" });
      const data = response.data;
      if (!data.choices[0]?.text) throw new TRPCError({ code: "NOT_FOUND" });

      // const data = `Mock for: ${input.latestMessage}`;
      const result: string = data.choices[0]?.text;
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      const title = `(${input.language}) - ${input.text.substring(0, 15)}`;
      const translationresult: TranslationResult =
        await ctx.prisma.translationResult.create({
          data: {
            authorId,
            text: input.text,
            translation: result,
            language: input.language,
            title: title,
          },
        });
      // // const chat = `it will be the responce fropm openai for prompt: ${input.content}`;
      // const chatMessage = { response: data };
      console.log("transltae - data/,", translationresult);
      return translationresult;
    }),

  deleteResult: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) return { id: "default-id" };
      const translateDelteResult = await ctx.prisma.translationResult.delete({
        where: {
          id: input.id,
        },
      });
      // if (!SummarizeResult) throw new TRPCError({ code: "NOT_FOUND" });
      // return SummarizeDelteResult;
    }),
});
// const response = await openai.createEdit({
//   model: "text-davinci-edit-001",
//   input: text ,
//   instruction: `translate to ${language} `,
// });
// //
// //
// console.log('ds',response.data)
// const data =  response.data
