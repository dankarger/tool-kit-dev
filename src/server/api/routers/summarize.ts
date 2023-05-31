import { z } from "zod";
import openai from "@/lib/openai";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { SummarizeResult } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
  CreateEditResponse,
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from "openai";
import { Analytics, Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
});

export const summarizeRouter = createTRPCRouter({
  getAllSummarizeByAuthorId: privateProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const summarizeResults = await ctx.prisma.summarizeResult.findMany({
        where: { authorId: input.authorId },
      });
      if (!summarizeResults) throw new TRPCError({ code: "NOT_FOUND" });
      return summarizeResults;
    }),

  getSummarizeResultById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("d", input);
      if (input.id === "default-id" || input.id.length === 0)
        return {
          id: "default-id",
          createdAt: new Date(),
          text: "",
          title: "",
          result: "",
          authorId: "",
        } as SummarizeResult;
      const result = await ctx.prisma.summarizeResult.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      return result;
    }),

  createSummarizeResult: privateProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      console.log("input:summarize", input.text);
      // const prompt = `we are having a chat ,this is our chat history so far: ${input.messages.flat()}`;
      if (!input.text) throw new TRPCError({ code: "NOT_FOUND" });
      const prompt =
        'Please summarize in bullet points (seperate them with a "*") the following text: \n\n' +
        input.text;
      const response = await openai.createChatCompletion({
        // engine: model_engine,

        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        // prompt: prompt,
        max_tokens: 70,
        n: 1,
        // stop: null,
        temperature: 0.5,
      });
      //
      //
      console.log(
        "response-----------",
        response.data.choices[0]?.message?.content
      );
      if (!response) throw new TRPCError({ code: "NOT_FOUND" });
      // const data = response.data;
      // if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      const result: string =
        response.data.choices[0]?.message?.content || "error:missing";
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });

      console.log("result:", typeof result);
      const summarizeResult: SummarizeResult =
        await ctx.prisma.summarizeResult.create({
          data: {
            authorId,
            text: input.text,
            result: result,
            title: input.text.substring(0, 15),
          },
        });

      console.log("summarizeResult - data/,", summarizeResult);
      return summarizeResult;
    }),
});
