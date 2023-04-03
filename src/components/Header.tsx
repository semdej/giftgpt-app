import {
  ActionIcon,
  Container,
  Group,
  Header as MantineHeader,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { FaInstagram, FaTiktok } from "react-icons/fa";

import { Logo } from "./Logo";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: rem(76),

    [theme.fn.smallerThan("sm")]: {
      justifyContent: "flex-start",
    },
  },

  social: {
    width: rem(260),

    [theme.fn.smallerThan("sm")]: {
      width: "auto",
      marginLeft: "auto",
    },
  },
}));

export function Header() {
  const { classes } = useStyles();

  return (
    <MantineHeader height={76}>
      <Container className={classes.inner}>
        <Group>
          <Logo />
          <Text component="h1" color="#fff" sx={{ fontSize: "1.5rem" }}>
            Gift
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: "#0085FF", to: "#19C5DC", deg: 45 }}
            >
              GPT
            </Text>
          </Text>
        </Group>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <a href="https://www.instagram.com/giftsgpt/" target="_blank">
            <ActionIcon size="lg">
              <FaInstagram size="1.1rem" />
            </ActionIcon>
          </a>

          <a href="https://www.tiktok.com/@giftgpt" target="_blank">
            <ActionIcon size="lg">
              <FaTiktok size="1.1rem" />
            </ActionIcon>
          </a>
        </Group>
      </Container>
    </MantineHeader>
  );
}
