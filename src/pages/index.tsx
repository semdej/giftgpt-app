import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Center,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import Confetti from "react-dom-confetti";

import { FeatureCard } from "@/components/FeatureCard";
import { useForm, zodResolver } from "@mantine/form";
import { FaArrowLeft, FaGift, FaHeart, FaMicrochip } from "react-icons/fa";
import { ZodError, z } from "zod";

import { GiftsLoadingMessage } from "../components/GiftLoadingMessage";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Gift } from "../models/gift";
import { HOBBIES } from "../models/hobby";
import { RELATIONSHIPS } from "../models/relationship";
import { PromptGiftsSchema } from "../validation/prompt-gifts";

function GiftResult({ gift }: { gift: Gift }) {
  const link = `/api/gift?keywords=${gift.keywords
    .join("+")
    .replaceAll("&", " ")}`;

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

  const [gifts, setGifts] = useState<Gift[] | null>(null);
  const [giftsLoading, setGiftsLoading] = useState(false);
  const [giftsLoadingError, setGiftsLoadingError] = useState<
    Error | ZodError | null
  >(null);

  async function handleSubmit(values: z.infer<typeof PromptGiftsSchema>) {
    try {
      setGifts(null);
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
        {!giftsLoading && !gifts && (
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
              giftsLoadingError.message ||
              "Something went wrong. Please try again later."}
          </Alert>
        )}

        {gifts && (
          <Center>
            <Stack maw="48rem" px="md" spacing="2rem">
              <Group w="100%">
                <ActionIcon onClick={() => setGifts(null)} size="xl">
                  <FaArrowLeft size="1.5rem" />
                </ActionIcon>

                <Title>Your gifts</Title>
              </Group>

              <Stack spacing="4rem" w="100%">
                {gifts.map((gift, index) => (
                  <GiftResult key={index} gift={gift} />
                ))}

                {gifts.length === 0 && (
                  <Alert
                    color="violet"
                    variant="outline"
                    title="No results found!"
                  >
                    Could not find any gifts for your prompt. Try another one!
                  </Alert>
                )}

                <Button
                  onClick={() => {
                    setGifts(null);
                  }}
                >
                  Find new gifts
                </Button>
              </Stack>
            </Stack>
          </Center>
        )}

        <Confetti
          active={giftsLoading}
          config={{
            angle: 95,
            spread: 92,
            startVelocity: 60,
            elementCount: 100,
            dragFriction: 0.11,
            duration: 3000,
            stagger: 4,
            width: "8px",
            height: "8px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
          }}
        />
      </Center>

      <Center pb="4rem">
        <Stack maw="92rem" px="1rem" spacing="4rem">
          <SimpleGrid
            cols={3}
            spacing="xl"
            mt={50}
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
            w="100%"
          >
            <FeatureCard
              title="Smart GPT search"
              description="Our website utilizes a state-of-the-art AI algorithm to generate personalized gift recommendations that are tailored to the interests and preferences of the recipient. Our AI algorithm takes into account various factors such as age, gender and hobbies to provide you with unique and innovative gift ideas."
              icon={<FaMicrochip size="2rem" />}
            />

            <FeatureCard
              title="No more stress!"
              description="We know that finding the perfect gift can be a time-consuming and overwhelming task, which is why we are dedicated to providing you with a hassle-free and enjoyable gift-buying experience. Our AI-powered gift recommendations are constantly updated and refined to ensure that they are always relevant and up-to-date."
              icon={<FaHeart size="2rem" />}
            />

            <FeatureCard
              title="The perfect gift every time"
              description="Our goal at GiftGPT is to provide you with gift recommendations that are both practical and functional, as well as thoughtful and unique. Whether you are looking for a gift for a family member, friend, or colleague, our AI-powered gift recommendations will ensure that your gift is well-received and appreciated."
              icon={<FaGift size="2rem" />}
            />
          </SimpleGrid>

          <Text
            size="lg"
            color="dimmed"
            ta="center"
            w="100%"
            maw="46rem"
            mx="auto"
          >
            So, next time you are struggling to find the perfect gift, turn to
            GiftGPT for personalized gift recommendations that are tailored to
            the recipient's interests and preferences. Our AI-powered gift
            recommendations will help you find a gift that is sure to make a
            lasting impression and create a memorable experience for your loved
            one.
          </Text>
        </Stack>
      </Center>
    </Box>
  );
}
