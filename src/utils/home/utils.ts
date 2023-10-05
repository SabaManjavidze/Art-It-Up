import { LOREM_IPSUM } from "../general/constants";
import { UserReview } from "../types/types";

export const creditPricing = [
  {
    id: 1,
    title: "150 Credits",
    price: 10,
    highlited: false,
    features: [
      {
        id: 1,
        title: "Unlimited Images",
      },
      {
        id: 2,
        title: "Unlimited Images",
      },
      {
        id: 3,
        title: "Unlimited Images",
      },
      {
        id: 4,
        title: "Unlimited Images",
      },
      {
        id: 5,
        title: "Unlimited Images",
      },
      {
        id: 6,
        title: "Unlimited Images",
      },
    ],
  },
  {
    id: 2,
    title: "150 Credits",
    price: 20,
    highlited: true,
    features: [
      {
        id: 1,
        title: "Unlimited Images",
      },
      {
        id: 2,
        title: "Unlimited Images",
      },
      {
        id: 3,
        title: "Unlimited Images",
      },
      {
        id: 4,
        title: "Unlimited Images",
      },
      {
        id: 5,
        title: "Unlimited Images",
      },
      {
        id: 6,
        title: "Unlimited Images",
      },
    ],
  },
  {
    id: 1,
    title: "150 Credits",
    price: 30,
    highlited: false,
    features: [
      {
        id: 1,
        title: "Unlimited Images",
      },
      {
        id: 2,
        title: "Unlimited Images",
      },
      {
        id: 3,
        title: "Unlimited Images",
      },
      {
        id: 4,
        title: "Unlimited Images",
      },
      {
        id: 5,
        title: "Unlimited Images",
      },
      {
        id: 6,
        title: "Unlimited Images",
      },
    ],
  },
];
export const styles = [
  {
    title: "Creative",
    id: 1,
  },
  {
    title: "Space",
    id: 2,
  },
  {
    title: "Galaxy",
    id: 3,
  },
  {
    title: "Dog",
    id: 4,
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
