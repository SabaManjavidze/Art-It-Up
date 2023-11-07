export interface UserReview {
  desc: string;
  user: { picture: string; name: string };
  rating: number;
}

export type AuthProviders = "google" | "facebook";
