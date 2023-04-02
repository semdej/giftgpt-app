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
import { FormEvent, useState } from "react";
import Confetti from "react-dom-confetti";

import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { GiftsLoadingMessage } from "../components/GiftLoadingMessage";
import { Gift } from "../models/gift";
import { HOBBIES } from "../models/hobby";
import { RELATIONSHIPS } from "../models/relationship";

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
  const [giftsLoadingError, setGiftsLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const relationship = formData.get("relationship")?.toString().trim();
    const age = formData.get("age")?.toString().trim();
    const hobbies = formData.get("hobbies")?.toString().trim();

    if (relationship && age && hobbies) {
      try {
        setGifts([]);
        setGiftsLoadingError(false);
        setGiftsLoading(true);

        const url = new URL("/api/openai", window.location.href);
        url.searchParams.append("relationship", relationship);
        url.searchParams.append("age", age);
        url.searchParams.append("hobbies", hobbies);

        const response = await fetch(url.pathname + url.search);
        const body = await response.json();
        setGifts(body.gifts);
      } catch (error) {
        console.error(error);
        setGiftsLoadingError(true);
      } finally {
        setGiftsLoading(false);
      }
    } else {
      setGiftsLoadingError(true);
    }
  }

  return (
    <Box style={{ overflow: "hidden", minHeight: "100vh" }}>
      <Header />

      <Hero />

      <Center component={Stack} pb="4rem" spacing="xl">
        {!giftsLoading && gifts.length === 0 && (
          <Box component="form" onSubmit={handleSubmit} w="100%" maw="32rem">
            <Stack spacing="3rem" px="md">
              <Stack spacing=".5rem">
                <Text ta="center" fw={500} size="md" color="white">
                  🤝 I'M LOOKING FOR A GIFT FOR MY
                </Text>
                <Select
                  mt={15}
                  size="lg"
                  w="100%"
                  data={relationship}
                  name="relationship"
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
                  🧓 WHO IS
                </Text>
                <NumberInput
                  mt={15}
                  size="lg"
                  w="100%"
                  name="age"
                  max={120}
                  min={0}
                  placeholder="25 years old"
                />
              </Stack>

              <Stack spacing=".5rem">
                <Text ta="center" fw={500} size="md" color="white">
                  ❤️ AND LOVES (TO)
                </Text>
                <MultiSelect
                  mt={15}
                  w="100%"
                  size="lg"
                  data={hobbies}
                  name="hobbies"
                  placeholder="Select a hobby or type a new one"
                  searchable
                  creatable
                  maxSelectedValues={3}
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
            Something went wrong. Please try again later.
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
