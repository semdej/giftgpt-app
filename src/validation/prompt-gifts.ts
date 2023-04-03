import z from "zod";

export const PromptGiftsSchema = z.object({
  relationship: z
    .string()
    .min(1, "Relationship is required")
    .max(100, "Relationship too long"),
  age: z
    .any()
    // Make sure that the value is not an empty string to prevent coercing it to 0
    .refine((val) => val !== "", "Age is required")
    .pipe(
      z.coerce
        .number()
        .min(0, `Age can't be negative`)
        .max(150, `Age can't be over 150`)
    ),
  hobbies: z
    .array(z.string().max(32, "Hobby can‘t exceed 32 characters"))
    .min(1, "You must provide at least 1 hobby")
    .max(3, "You can only provide up to 3 hobbies"),
});
