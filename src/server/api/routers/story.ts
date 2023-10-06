import { unknown, z } from "zod";
import openai from "@/lib/openai";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { type StoryResult } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Analytics, Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import type { CloudinaryResponse } from "@/types";
import cloudinary from "@/utils/cloudinary";

const apiHost = process.env.API_HOST ?? "https://api.stability.ai";
const url = `${apiHost}/v1/user/account`;
const apiKey = process.env.STABILITY_API_KEY;

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

      // GPT-3.5
      //---------------------------------------------------------------------------------
      // const prompt = `write me a short story ,the main event is ${input.text}`;
      // const response = await openai.createChatCompletion({
      //   model: "gpt-3.5-turbo",
      //   messages: [{ role: "user", content: prompt }],

      //   max_tokens: 400,
      //   stop: "\n",
      //   temperature: 0.9,

      //-- differnets paramaters:
      // temperature: 1,
      // max_tokens: 256,
      // top_p: 1,
      // frequency_penalty: 0,
      // presence_penalty: 0,

      // });

      //------------------------------------------------------------------------------------
      // GPT-4:
      const response = await openai.createChatCompletion({
        // model: "gpt-4",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "you are a writer of short stories, the premis for the story will be delimeted by ###, return only the story without anything else",
          },
          {
            role: "user",
            content: `write a story about ###${input.text}###`,
          },
        ],
        temperature: 1,
        // max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
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
      const system = `You are a promt engineer and an illustrator of books, Write me a promt that will create an illustration for a story explain in your result the characters and background so the generative ai will understand the scene, return the prompt you have created (make the prompt not longer than 2000 words)`;
      const query = ` the story that need to illustrate is : """${input.story}""". return only the resulting promt`;
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: system },
          { role: "user", content: query },
        ],
        // prompt: "Say it s party time",
        max_tokens: 200,
        stop: "\n",
        temperature: 0.9,
      });
      if (!response.data.choices[0]?.message?.content)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const promptResult = response.data.choices[0]?.message?.content;
      console.log(
        "promptResult promt --------+++++++++++++++++++++++++++++++++++++++++++++++++++++",
        promptResult
      );

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

      if (!response) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const image_url = response.data?.data[0]?.url;
      if (!image_url) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return image_url;
    }),

  // Stable Difussion
  createImageStable: privateProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const engineId = "stable-diffusion-xl-1024-v1-0";

      if (!apiKey) throw new Error("Missing Stability API key.");

      // const response = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Bearer ${apiKey}`,
      //   },
      console.log("*****************************, input.prompt", input.prompt);
      const response = await fetch(
        `${apiHost}/v1/generation/${engineId}/text-to-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: input.prompt,
                // text: "a blue elephant fly to the moon",
              },
            ],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            steps: 30,
            samples: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Non-200 response: ${await response.text()}`);
      }

      interface GenerationResponse {
        artifacts: Array<{
          base64: string;
          seed: number;
          finishReason: string;
        }>;
      }

      const responseJSON = (await response.json()) as GenerationResponse;

      // })

      if (!response.ok) {
        throw new TRPCError({ code: "NOT_FOUND" }); //
      }
      const base64 = responseJSON.artifacts[0]?.base64 as string;
      const image64 = "data:image/jpg;base64," + base64;

      console.log(
        "+++++++++++++++++++++++++++++++++++++=image65",
        image64.substring(0, 50)
      );

      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: "Gptool-kit/",
      };

      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        image64,
        options
      );
      if (!cloudinaryResponse) {
        throw new TRPCError({ code: "NOT_FOUND" }); //
      }
      return cloudinaryResponse.secure_url;
    }),
  // upload image
  // image from openai
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
      console.log(
        " input.image_url,--==========-----=_+-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-",
        input.image_url
      );
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        input.image_url,
        options
      );

      console.log("cloudinaryResponse", cloudinaryResponse);

      console.log(
        "cloudinaryResponse.secure_url)",
        cloudinaryResponse.secure_url
      );
      return cloudinaryResponse.secure_url;
    }),

  // image from stability ai
  uploadImageToCloudinaryStable: privateProcedure
    .input(z.object({ base64Image: z.string() }))
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
      const { base64Image } = input;
      console.log(
        " input.image_url,--==========-----=_+-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-",
        base64Image
      );
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        base64Image,
        options
      );

      console.log("cloudinaryResponsestable--------------", cloudinaryResponse);

      console.log(
        "cloudinaryResponsestable.secure_url)",
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
  deleteResult: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) return { id: "default-id" };
      const storyDelteResult = await ctx.prisma.storyResult.delete({
        where: {
          id: input.id,
        },
      });
      // if (!SummarizeResult) throw new TRPCError({ code: "NOT_FOUND" });
      // return SummarizeDelteResult;
    }),
});
