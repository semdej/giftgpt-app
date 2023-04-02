import {
  createStyles,
  Header as MantineHeader,
  Group,
  ActionIcon,
  Container,
  rem,
  Text,
} from "@mantine/core";
import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

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
          <Text component="h1" color="#fff" sx={{ fontSize: "1.75rem" }}>
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
          <ActionIcon size="lg">
            <FaTwitter size="1.1rem" />
          </ActionIcon>
          <ActionIcon size="lg">
            <FaYoutube size="1.1rem" />
          </ActionIcon>
          <ActionIcon size="lg">
            <FaInstagram size="1.1rem" />
          </ActionIcon>
        </Group>
      </Container>
    </MantineHeader>
  );
}
