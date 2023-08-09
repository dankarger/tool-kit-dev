import { z } from "zod";
import openai from "@/lib/openai";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
} from "openai";
import { Analytics, Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
// import type {ChatCompletionRequestMessage} from ''
// import { CompletionOpts, Completion, Choice } from "openai-api";
import type { Session, TranslationResultType, StoryResult } from "@/types";

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

interface ChatCompletionChoice {
  message: {
    role: string;
    content: string;
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

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
});

export const filterOptionForClient = (
  option: Session | TranslationResultType | StoryResult
) => {
  return {
    id: option.id,
    // label: option?.title | option?.name | option?.text
  };
};

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

  getSessionMessagesBySessionId: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.chatMessage.findMany({
        where: { sessionId: input.id },
      });
      if (!messages) throw new TRPCError({ code: "NOT_FOUND" });
      return messages;
    }),
  getSecretMessage: privateProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  chatOpenAi: privateProcedure

    // .input(
    //   z.object({
    //     model: z.string(),
    //     messages: z.array(z.object({ role: z.string(), content: z.string() })),
    //     // prompt: "Say it s party time",
    //     max_tokens: z.number().min(1).max(90),
    //     stop: z.string().min(1).max(5),
    //     temperature: z.number().min(0).max(1),
    //   })
    // )
    .input(
      z.object({
        message: z.string().min(1).max(480),
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input.message }],
        // prompt: "Say it s party time",
        max_tokens: 100,
        // stop: "\n",
        temperature: 0.5,
      });

      if (!response) throw new TRPCError({ code: "NOT_FOUND" });
      const data = response.data?.choices[0]?.message?.content;
      if (!data) throw new TRPCError({ code: "NOT_FOUND" });
      return data;
    }),

  create: privateProcedure
    .input(
      z.object({
        messages: z.array(z.object({ role: z.string(), content: z.string() })),
        latestMessage: z.string().min(1).max(480),
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      console.log("input.messages", input.messages);
      // const prompt = `we are having a chat ,this is our chat history so far: ${input.messages.flat()}`;
      if (!input.messages) throw new TRPCError({ code: "NOT_FOUND" });
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          ...input.messages,
          {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: input.latestMessage,
          },
        ] as ChatCompletionRequestMessage[],
        // prompt: input.latestMessage,
        max_tokens: 300,
        // stop: "\n",
        temperature: 0.5,
      });
      console.log("response-----------", response.data);
      if (!response) throw new TRPCError({ code: "NOT_FOUND" });
      const data = response.data?.choices[0]?.message?.content;
      if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      // const data = `Mock for: ${input.latestMessage}`;
      const chatMessage = await ctx.prisma.chatMessage.create({
        data: {
          authorId,
          message: input.latestMessage,
          response: data,
          sessionId: input.sessionId,
        },
      });
      // // const chat = `it will be the responce fropm openai for prompt: ${input.content}`;
      // const chatMessage = { response: data };
      console.log("chatMessage/,", chatMessage);
      return chatMessage;
    }),
  deleteResult: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) return;
      const translateDelteResult = await ctx.prisma.chatSession.delete({
        where: {
          id: input.id,
        },
      });
      // if (!SummarizeResult) throw new TRPCError({ code: "NOT_FOUND" });
      // return SummarizeDelteResult;
    }),
});
