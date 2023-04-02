import { FormEvent, useState } from "react";
import {
  Button,
  MultiSelect,
  NumberInput,
  Loader,
  Text,
  Center,
} from "@mantine/core";
import { Hero } from "../components/Hero";

function GiftResult({ gift }: { gift: string }) {
  const keyWords = gift
    .replace(/[0-9]*\.(.*?)-.*/g, "$1")
    .trim()
    .split(" ")
    .map((word) => word.trim().toLowerCase());
  const link = `https://www.amazon.com/s?k=${keyWords.join(
    "+"
  )}&linkCode=ll2&tag=giftgpt03-20&language=en_US&ref_=as_li_ss_tl`;
  return (
    <p>
      {gift}{" "}
      <a target="_blank" href={link}>
        Link to Amazon
      </a>
    </p>
  );
}

export default function Home() {
  const [person, setPerson] = useState([
    { value: "grandma", label: "Grandma" },
    { value: "dad", label: "Dad" },
  ]);
  const [hobbies, setHobbies] = useState([
    { value: "mountainbike", label: "Mountainbike" },
    { value: "tennis", label: "Tennis" },
  ]);
  const [gifts, setGifts] = useState([]);
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
    <>
      <Hero />

      <Center>
        <form onSubmit={handleSubmit}>
          <Text ta="center" fw={500} size="sm" color="white">
            🤝 I'M LOOKING FOR A GIFT FOR MY
          </Text>
          <MultiSelect
            mt={15}
            size="lg"
            w={400}
            maw="100%"
            data={person}
            name="relationship"
            placeholder="Friend, family, colleague, etc."
            searchable
            maxSelectedValues={1}
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setPerson((current) => [...current, item]);
              return item;
            }}
          />

          <Text mt={30} ta="center" fw={500} size="sm" color="white">
            🧓 WHO IS
          </Text>
          <NumberInput
            mt={15}
            size="lg"
            w={400}
            maw="100%"
            name="age"
            max={120}
            min={0}
            placeholder="25 years old"
          />

          <Text mt={30} ta="center" fw={500} size="sm" color="white">
            ❤️ AND LOVES TO
          </Text>
          <MultiSelect
            mt={15}
            w={400}
            size="lg"
            maw="100%"
            data={hobbies}
            name="hobbies"
            placeholder="Hike, mountainbike, game, etc."
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

          <Center>
            <Button
              size="md"
              variant="gradient"
              gradient={{ from: "#8701F0", to: "#CC01FF" }}
              type="submit"
              disabled={giftsLoading}
              mt={50}
            >
              Find me a gift!
            </Button>
          </Center>
        </form>
      </Center>

      {giftsLoading && (
        <Center>
          <Loader />
        </Center>
      )}
      {giftsLoadingError && "Something went wrong. Please try again."}
      {gifts.map((gift, index) => (
        <GiftResult key={index} gift={gift} />
      ))}
    </>
  );
}
