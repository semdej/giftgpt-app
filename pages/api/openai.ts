// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { z, ZodError } from "zod";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface Request extends NextApiRequest {
  query: {
    relationship: string;
    age: string;
    hobbies: string;
  };
}

const QuerySchema = z.object({
  relationship: z.string().max(100, "Relationship too long"),
  age: z.coerce
    .number()
    .min(0, `Age can't be negative`)
    .max(150, `Age can't be over 150`),
  hobbies: z.string().max(100, "Hobbies too long"),
});

export default async function handler(req: Request, res: NextApiResponse) {
  try {
    console.log("req.query", req.query);

    const { age, hobbies, relationship } = QuerySchema.parse(req.query);

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Give me 10 unique gift ideas with for my ${relationship} who is ${age} years old and likes to ${hobbies}`,
      max_tokens: 500,
      temperature: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    });
    const quote = completion.data.choices[0].text;

    res.status(200).json({ quote });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }

    return res.status(500).json({ error: "An unknown error occurred" });
  }
}
