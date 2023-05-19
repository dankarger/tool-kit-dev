import { Configuration, OpenAIApi } from "openai";
import type { OpenAIApi as OpenAIApiType } from "openai";
import OpenAI from "openai-api";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default openai;
export { OpenAIApiType };
