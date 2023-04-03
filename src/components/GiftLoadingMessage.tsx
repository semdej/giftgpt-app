import { Loader, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Finding the perfect gift",
  "Checking santa clause’s list",
  "Your gift is on the way... we're just wrapping it up!",
  "GPT is trying to figure out the meaning of a gift",
  "Just like unwrapping a gift, your page is loading!",
  "This page is loading as fast as a kid tearing open a birthday gift!",
  "Our servers are like Santa's workshop, working hard to deliver your gift.",
  "Knocking on GPT's door",
  "Your patience is a gift to us... and we're almost ready to open it!",
  "This loading screen is like a present, the longer you wait, the better it gets!",
  "The wait is almost over, your digital gift is about to be delivered!",
  "Just like a gift, the anticipation makes the payoff even sweeter. Thanks for waiting!",
];

export function GiftsLoadingMessage() {
  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] = useState(
    Math.floor(Math.random() * LOADING_MESSAGES.length)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentLoadingMessageIndex((current) => {
        if (current === LOADING_MESSAGES.length - 1) {
          return 0;
        }
        return current + 1;
      });
    }, 6000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Stack align="center" maw="32rem" ta="center">
      <Text
        size="1.5rem"
        component="span"
        variant="gradient"
        gradient={{ from: "#0085FF", to: "#19C5DC", deg: 45 }}
        fw="700"
      >
        {LOADING_MESSAGES[currentLoadingMessageIndex]}
      </Text>

      <Loader variant="dots" size="xl" />
    </Stack>
  );
}
