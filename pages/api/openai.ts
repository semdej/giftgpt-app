// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt;
  const prompt2 = req.query.prompt2;
  const prompt3 = req.query.prompt3;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt missing" });
  } else if (!prompt2) {
    return res.status(400).json({ error: "Prompt2 missing" });
  } else if (!prompt3) {
    return res.status(400).json({ error: "Prompt3 missing" });
  }

  if (prompt.length > 100) {
    return res.status(400).json({ error: "Prompt too long" });
  } else if (prompt2.length > 100) {
    return res.status(400).json({ error: "Prompt2 too long" });
  } else if (prompt3.length > 100) {
    return res.status(400).json({ error: "Prompt3 too long" });
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Give me 10 unique gift ideas with for my ${prompt} who is ${prompt2} years old and likes to ${prompt3}`,
    max_tokens: 500,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });
  const quote = completion.data.choices[0].text;

  res.status(200).json({ quote });
}
