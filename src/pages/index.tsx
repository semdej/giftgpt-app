import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import Confetti from "react-dom-confetti";

import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { GiftsLoadingMessage } from "../components/GiftLoadingMessage";
import { Gift } from "../models/gift";
import { HOBBIES } from "../models/hobby";
import { RELATIONSHIPS } from "../models/relationship";
import { PromptGiftsSchema } from "../validation/prompt-gifts";
import { useForm, zodResolver } from "@mantine/form";
import { ZodError, z } from "zod";

function GiftResult({ gift }: { gift: Gift }) {
  const link = `https://www.amazon.com/s?k=${gift.keywords.join(
    "+"
  )}&linkCode=ll2&tag=giftgpt03-20&language=en_US&ref_=as_li_ss_tl`;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text weight={500} mb="xs" size="xl">
        {gift.title}
      </Text>

      <Text size="sm" color="dimmed">
        {gift.description}
      </Text>
      <Button
        component="a"
        target="_blank"
        href={link}
        fullWidth
        mt="md"
        radius="md"
        variant="gradient"
        gradient={{ from: "#8701F0", to: "#CC01FF" }}
        maw={250}
      >
        Check available products
      </Button>
    </Card>
  );
}

export default function Home() {
  const form = useForm<z.infer<typeof PromptGiftsSchema>>({
    validate: zodResolver(PromptGiftsSchema),
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      relationship: "",
      age: "",
      hobbies: [],
    } as any,
  });

  const [relationship, setRelationship] = useState(() =>
    RELATIONSHIPS.map((relationship) => ({
      value: relationship.toLowerCase(),
      label: relationship,
    }))
  );

  const [hobbies, setHobbies] = useState(() =>
    HOBBIES.map((hobby) => ({ value: hobby.toLowerCase(), label: hobby }))
  );

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [giftsLoading, setGiftsLoading] = useState(false);
  const [giftsLoadingError, setGiftsLoadingError] = useState<
    Error | ZodError | null
  >(null);

  async function handleSubmit(values: z.infer<typeof PromptGiftsSchema>) {
    try {
      setGifts([]);
      setGiftsLoadingError(null);
      setGiftsLoading(true);

      const response = await fetch("/api/prompt-gifts", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await response.json();

      if (!response.ok) {
        if (body.error?.name === "ZodError") {
          throw new ZodError(body.error.issues);
        }

        throw new Error(body.error || "An unknown error occurred.");
      }

      setGifts(body.gifts);
    } catch (error) {
      console.error(error);
      setGiftsLoadingError(
        (error as Error | ZodError) || new Error("An unknown error occurred.")
      );
    } finally {
      setGiftsLoading(false);
    }
  }

  return (
    <Box style={{ overflow: "hidden", minHeight: "100vh" }}>
      <Header />

      <Hero />

      <Center component={Stack} pb="4rem" spacing="xl">
        {!giftsLoading && gifts.length === 0 && (
          <Box
            component="form"
            onSubmit={form.onSubmit(handleSubmit)}
            w="100%"
            maw="32rem"
          >
            <Stack spacing="3rem" px="md">
              <Stack spacing=".5rem">
                <Text ta="center" fw={500} size="md" color="white">
                  🤝 I'M LOOKING FOR A GIFT FOR MY
                </Text>
                <Select
                  {...form.getInputProps("relationship")}
                  mt={15}
                  size="lg"
                  w="100%"
                  data={relationship}
                  placeholder="Select a relationship or type a new one"
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    const item = { value: query, label: query };
                    setRelationship((current) => [...current, item]);
                    return item;
                  }}
                />
              </Stack>

              <Stack spacing=".5rem">
                <Text ta="center" fw={500} size="md" color="white">
                  🧓 WITH AN AGE OF
                </Text>
                <NumberInput
                  {...form.getInputProps("age")}
                  mt={15}
                  size="lg"
                  w="100%"
                  placeholder="25 years old"
                />
              </Stack>

              <Stack spacing=".5rem">
                <Text ta="center" fw={500} size="md" color="white">
                  ❤️ AND LOVES (TO)
                </Text>
                <MultiSelect
                  {...form.getInputProps("hobbies")}
                  mt={15}
                  w="100%"
                  size="lg"
                  data={hobbies}
                  placeholder="Select a hobby or type a new one"
                  searchable
                  creatable
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    const item = { value: query, label: query };
                    setHobbies((current) => [...current, item]);
                    return item;
                  }}
                />
              </Stack>

              <Center>
                <Button
                  size="md"
                  variant="gradient"
                  gradient={{ from: "#8701F0", to: "#CC01FF" }}
                  type="submit"
                  disabled={giftsLoading}
                >
                  Find me a gift!
                </Button>
              </Center>
            </Stack>
          </Box>
        )}

        {giftsLoading && <GiftsLoadingMessage />}

        {giftsLoadingError && (
          <Alert title="Bummer!" color="orange">
            {(giftsLoadingError instanceof ZodError &&
              giftsLoadingError.issues[0]?.message) ||
              giftsLoadingError.name ||
              "Something went wrong. Please try again later."}
          </Alert>
        )}

        {gifts.length > 0 && (
          <Center>
            <Stack spacing="4rem" w="100%" maw="48rem" px="md">
              {gifts.map((gift, index) => (
                <GiftResult key={index} gift={gift} />
              ))}

              <Button
                onClick={() => {
                  setGifts([]);
                }}
              >
                Find new gifts
              </Button>
            </Stack>
          </Center>
        )}

        <Confetti
          active={giftsLoading}
          config={{
            angle: 95,
            spread: 92,
            startVelocity: 40,
            elementCount: 86,
            dragFriction: 0.11,
            duration: 1570,
            stagger: 2,
            width: "8px",
            height: "8px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
          }}
        />
      </Center>
    </Box>
  );
}
