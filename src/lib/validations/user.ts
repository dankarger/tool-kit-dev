import * as z from "zod";

export const userTextInputSchema = z.object({
  text: z.string().min(2).max(1330),
});
