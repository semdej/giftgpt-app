export interface Gift {
  title: string;
  description: string;
  keywords: string[];
}

export function parseGiftResponse(gift: string): Gift | null {
  const [_match, title, description] =
    gift.match(/[0-9]*\.(.*?)\|\|(.*)/)?.map((result) => result.trim()) || [];

  if (!title || !description) {
    return null;
  }

  return {
    title,
    description,
    keywords: title
      .split(" ")
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 0),
  };
}
