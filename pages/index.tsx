import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Form, Button, Spinner } from "react-bootstrap";
import { FormEvent, useState } from "react";

export default function Home() {
  const [quote, setQuote] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const relationship = formData.get("relationship")?.toString().trim();
    const age = formData.get("age")?.toString().trim();
    const hobbies = formData.get("hobbies")?.toString().trim();

    if (relationship && age && hobbies) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const url = new URL("/api/openai", window.location.href);
        url.searchParams.append("relationship", relationship);
        url.searchParams.append("age", age);
        url.searchParams.append("hobbies", hobbies);

        const response = await fetch(url.pathname + url.search);
        const body = await response.json();
        setQuote(body.quote);
      } catch (error) {
        console.error(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
      }
    } else {
      setQuoteLoadingError(true);
    }
  }

  return (
    <>
      <Head>
        <title>Gift Ideas powered by GPT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <h1>Gift Ideas</h1>
        <h2>powered by GPT-3</h2>
        <div>
          Enter a person and the AI will generate a list of ten gift ideas for
          them.
        </div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className="mb-3" controlId="prompt-input">
            <Form.Label>A gift for a</Form.Label>
            <Form.Control
              name="relationship"
              placeholder="grandmother"
              maxLength={100}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="prompt-input">
            <Form.Label>who is</Form.Label>
            <Form.Control name="age" placeholder="78" maxLength={100} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="prompt-input">
            <Form.Label>years old, their hobbies are</Form.Label>
            <Form.Control
              name="hobbies"
              placeholder="mountainbiking, hiking, and reading"
              maxLength={100}
            />
          </Form.Group>
          <Button type="submit" className="mb-3" disabled={quoteLoading}>
            Generate
          </Button>
        </Form>
        {quoteLoading && <Spinner animation="border" />}
        {quoteLoadingError && "Something went wrong. Please try again."}
        {quote && <h5>{quote}</h5>}
      </main>
    </>
  );
}
