import { z } from "zod";
import openai from "@/lib/openai";
import { clerkClient } from "@clerk/nextjs";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "@/server/api/trpc";
import { ChatMessage } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
} from "openai";
import { Analytics, Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
// import { CompletionOpts, Completion, Choice } from "openai-api";
interface ChatCompletionResponse {
  data: {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    choices: ChatCompletionChoice[] | [];
  };
}

// interface ChatCompletionResponse {
//   data: ChatCompletionResponseMessage;
// }

interface ChatCompletionChoice {
  message: {
    role: string;
    content: string;
    // Other properties specific to the message object
  };
  finish_reason: string;
  index: number;
}
interface Message {
  role: string;
  content: string;
}
interface ChatCompletionRequestCustom {
  model: string;
  messages: Message[];
  max_tokens: 90;
  stop: "\n";
  temperature: 0.5;
}

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

export const chatRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getAllChatMessagesByAuthorId: privateProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chatMessages = await ctx.prisma.chatMessage.findMany({
        where: { authorId: input.authorId },
      });

      if (!chatMessages) throw new TRPCError({ code: "NOT_FOUND" });

      return chatMessages;
    }),

  getChatSessionByAuthorId: privateProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chatSession = await ctx.prisma.chatSession.findMany({
        where: { authorId: input.authorId },
      });
      if (!chatSession) throw new TRPCError({ code: "NOT_FOUND" });
      return chatSession;
    }),
  getSecretMessage: privateProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  chatOpenAi: privateProcedure
    .input(
      z.object({
        model: z.string(),
        messages: z.array(z.object({ role: z.string(), content: z.string() })),
        // prompt: "Say it s party time",
        max_tokens: z.number().min(1).max(90),
        stop: z.string().min(1).max(5),
        temperature: z.number().min(0).max(1),
      })
    )
    .mutation(({ input }) => {
      // const response = await openai.createChatCompletion(input);
      // console.log("response2", response);
      // // const result = response.data?.choices[0]?.message.content ?? "#error";
      // // return result;
      // return input;
      const data = setTimeout(() => {
        return "mock";
      }, 100);

      return data;
    }),

  create: privateProcedure
    .input(
      z.object({
        message: z.string().min(1).max(480),
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      // const { success } = await ratelimit.limit(authorId);

      // if (!success) {
      //   throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      // }
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input.message }],
        // prompt: "Say it s party time",
        max_tokens: 90,
        stop: "\n",
        temperature: 0.5,
      });

      if (!response) throw new TRPCError({ code: "NOT_FOUND" });
      const data = response.data?.choices[0]?.message?.content;
      if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      const chatMessage = await ctx.prisma.chatMessage.create({
        data: {
          authorId,
          message: input.message,
          response: data,
          sessionId: input.sessionId,
        },
      });
      // // const chat = `it will be the responce fropm openai for prompt: ${input.content}`;
      // const chatMessage = { response: data };
      console.log("chatMessage/,", chatMessage);
      return chatMessage;
    }),
});
