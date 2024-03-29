import type { NextApiRequest, NextApiResponse } from "next";
import { backOff } from "exponential-backoff";
import { Configuration, OpenAIApi } from "openai";
import { ZodError } from "zod";
import * as Sentry from "@sentry/nextjs";

import { parseGiftResponse } from "../../models/gift";
import { PromptGiftsSchema } from "../../validation/prompt-gifts";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    Sentry.setContext("request", req);

    const { age, hobbies, relationship } = PromptGiftsSchema.parse(req.body);

    const joinedHobbies = hobbies.join(", ");

    const gifts = await backOff(
      async () => {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant for finding gifts. You do not return: experiences, courses, personalized gifts, subscriptions, gift cards.",
            },
            {
              role: "user",
              content:
                "Use the following format for each gift idea: 1. {gift idea} || {gift description}",
            },
            {
              role: "user",
              content: `Create a list of 3 unique gift ideas for my ${relationship} who is ${age} years old and likes to ${joinedHobbies}.`,
            },
          ],
          max_tokens: 500,
          temperature: 1,
          presence_penalty: 0,
          frequency_penalty: 0,
        });

        return (completion.data.choices[0].message?.content || "")
          .split("\n")
          .filter((gift) => gift.length > 0 && /[0-9]\..*/g.test(gift))
          .map(parseGiftResponse)
          .filter((gift) => gift !== null);
      },
      { startingDelay: 1000, maxDelay: 60000, numOfAttempts: 7 }
    );

    res.status(200).json({ gifts });
  } catch (error) {
    console.error(error);

    Sentry.captureException(error, {});

    if (error instanceof ZodError) {
      return res.status(400).json({ error });
    }

    return res.status(500).json({ error: "An unknown error occurred" });
  }
}
