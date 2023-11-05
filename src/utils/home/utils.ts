import { LOREM_IPSUM } from "../general/constants";
import type { UserReview } from "../types/types";
import { nanoid } from "nanoid";

export const creditPricing = [
  {
    id: nanoid(),
    title: "150 Credits",
    price: 10,
    highlited: false,
    features: [
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
    ],
  },
  {
    id: nanoid(),
    title: "150 Credits",
    price: 20,
    highlited: true,
    features: [
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
    ],
  },
  {
    id: nanoid(),
    title: "150 Credits",
    price: 30,
    highlited: false,
    features: [
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
      {
        id: nanoid(),
        title: "Unlimited Images",
      },
    ],
  },
];
export const styles = [
  {
    title: "Creative",
    id: nanoid(),
  },
  {
    title: "Space",
    id: nanoid(),
  },
  {
    title: "Galaxy",
    id: nanoid(),
  },
  {
    title: "Dog",
    id: nanoid(),
  },
];
export const userReviews: UserReview[] = [
  {
    desc: LOREM_IPSUM,
    rating: 5,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "gela",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 5,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "gocha",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 5,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "geimeri",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 5,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "geimeri",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 4,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "geimeri",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 1,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "geimeri",
    },
  },
];
