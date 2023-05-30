import { unknown, z } from "zod";
import openai from "@/lib/openai";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { StoryResult } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Analytics, Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
// import cloudinary from 'cloudinary'
import { cloudinary } from "@/utils/cloudinary";
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
});

export const storyRouter = createTRPCRouter({
  getAllStoriesByAuthorId: privateProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const storyResults = await ctx.prisma.storyResult.findMany({
        where: { authorId: input.authorId },
      });
      if (!storyResults) throw new TRPCError({ code: "NOT_FOUND" });
      return storyResults;
    }),
  getStoryByStoryId: privateProcedure
    .input(z.object({ storyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const story = await ctx.prisma.storyResult.findUnique({
        where: {
          id: input.storyId,
        },
      });

      return story;
    }),
  createStoryTextResult: privateProcedure
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
      console.log("input:storyText", input.text);
      // const prompt = `we are having a chat ,this is our chat history so far: ${input.messages.flat()}`;
      if (!input.text) throw new TRPCError({ code: "NOT_FOUND" });
      const prompt = `write me a short story ,the main event is ${input.text}`;
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 90,
        stop: "\n",
        temperature: 0.9,
      });
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

      console.log("strory text result - result/,", result);
      return result;
    }),

  createPromptForImage: privateProcedure
    .input(z.object({ story: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const query = `Write a promt for the openai api to create an illustration for this story: "${input.story}"`;
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: query }],
        // prompt: "Say it s party time",
        max_tokens: 90,
        stop: "\n",
        temperature: 0.9,
      });
      if (!response.data.choices[0]?.message?.content)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const promptResult = response.data.choices[0]?.message?.content;

      return promptResult;
    }),
  createImage: privateProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const response = await openai.createImage({
        prompt: input.prompt,
        n: 1,
        size: "512x512",
      });

      // console.log('response2',response.data.choices)

      if (!response) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const image_url = response.data?.data[0]?.url;
      if (!image_url) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return image_url;
    }),
  uploadImageToCloudinary: privateProcedure
    .input(z.object({ image_url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: "Gptool-kit/",
      };
      const cloudinaryResponse: { secure_url: string } =
        await cloudinary.uploader.upload(input.image_url, options);

      console.log("cloudinaryResponse", cloudinaryResponse);

      console.log(
        "cloudinaryResponse.secure_url)",
        cloudinaryResponse.secure_url
      );
      return cloudinaryResponse.secure_url;
    }),

  createTitle: privateProcedure
    .input(z.object({ story: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const query = `write a short title for this story : "${input.story}"`;
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: query }],
        // prompt: "Say it s party time",
        max_tokens: 290,
        stop: "\n",
        temperature: 0.9,
      });
      if (!response.data.choices[0]?.message?.content)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const titleResult = response.data.choices[0]?.message?.content;
      return titleResult;
    }),
  createFullStoryResult: privateProcedure
    .input(
      z.object({
        title: z.string(),
        text: z.string(),
        resultText: z.string(),
        resultPrompt: z.string(),
        resultImageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const storyResult: StoryResult = await ctx.prisma.storyResult.create({
        data: {
          authorId,
          title: input.title,
          text: input.text,
          resultText: input.resultText,
          resultPrompt: input.resultPrompt,
          resultImageUrl: input.resultImageUrl,
        },
      });
      console.log("storyresult", storyResult);
      return storyResult;
    }),
});
