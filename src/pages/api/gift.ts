import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.keywords) {
    return res.status(500).json({ error: "An unknown error occurred" });
  }

  return res.redirect(
    `https://www.amazon.com/s?k=${req.query.keywords}&tag=giftgpt03-20&language=en_US&ref_=as_li_ss_tl`
  );
}
