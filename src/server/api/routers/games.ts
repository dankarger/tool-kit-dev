import { z } from "zod";
import openai from "@/lib/openai";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
} from "openai";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Analytics, Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(20, "1 m"),
//   analytics: true,
// });

export const gamesRouter = createTRPCRouter({
  playTicTacToe: privateProcedure
    .input(z.object({ board: z.array(z.array(z.string())) }))
    .mutation(async ({ ctx, input }) => {
      const board = input.board;
      const systemMessage = `  You are an AI playing a game of Tic Tac Toe against a human opponent. The game board is represented as a 3x3 matrix, where each cell can be empty ('_'), contain the human player's piece ('X'), or contain your piece ('O').  
          Your task is to make a move given the current state of the board and return the board state. 
         do not return any aditional text that is not the matrix, do not explain anything just return the in the format of a javascript array representing the matrix
          `;

      const play = `Current state of the board:\n${board.toString()}\n\nplay your next move and return the updated array
        `;
      const messages = [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: systemMessage,
        },
        { role: ChatCompletionRequestMessageRoleEnum.User, content: play },
        // {'role': 'assistant', 'content': f"Relevant product information:\n{product_information}"}
      ];
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0,
        max_tokens: 50,
      });

      if (!response) throw new TRPCError({ code: "NOT_FOUND" });
      const result = response.data?.choices[0]?.message?.content;
      // const response = await openai.createCompletion({
      //   model: "curie",
      //   prompt,
      //   max_tokens: 20,
      //   temperature: 0.7,
      //   top_p: 1,
      // });
      // const result = response.data.choices[0]?.text;
      return result;
    }),
});
