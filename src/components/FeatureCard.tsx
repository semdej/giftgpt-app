import { Box, Card, Text, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  iconContainer: {
    color: theme.fn.primaryColor(),
  },

  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  },
}));

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const { classes, theme } = useStyles();

  return (
    <Card shadow="md" radius="md" className={classes.card} padding="xl">
      <Box className={classes.iconContainer}>{icon}</Box>

      <Text
        component="h2"
        fz="lg"
        fw={500}
        className={classes.cardTitle}
        mt="md"
      >
        {title}
      </Text>

      <Text fz="sm" c="dimmed" mt="sm">
        {description}
      </Text>
    </Card>
  );
}
