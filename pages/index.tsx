import Head from "next/head";
import { FormEvent, useState } from "react";
import { Button, MultiSelect, NumberInput, Loader } from "@mantine/core";
import { Hero } from "components/hero";

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
    { value: "mountainbike", label: "Mountainbiking" },
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
      <Head>
        <title>Gift Ideas powered by GPT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Hero />
      <main>
        <form onSubmit={handleSubmit}>
          <MultiSelect
            label="For who?"
            data={person}
            name="relationship"
            placeholder="Select person"
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
          <NumberInput label="Age" name="age" placeholder="Enter age" />
          <MultiSelect
            label="Hobbies"
            data={hobbies}
            name="hobbies"
            placeholder="Select hobbies"
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
          <Button type="submit" disabled={giftsLoading}>
            Submit
          </Button>
        </form>
        {giftsLoading && <Loader />}
        {giftsLoadingError && "Something went wrong. Please try again."}
        {gifts.map((gift, index) => (
          <GiftResult key={index} gift={gift} />
        ))}
      </main>
    </>
  );
}
