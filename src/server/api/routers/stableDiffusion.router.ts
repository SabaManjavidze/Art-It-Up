import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import axios from "axios";
import { IMG2IMG_COST } from "@/utils/general/constants";
import { decreaseCredits } from "../utils/credits";

const rateLimitMsg = "Rate limit exceeded";

const CommunityModels = axios.create({
  baseURL: "https://stablediffusionapi.com/api/v4/dreambooth/",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});
const EnterprisePlan = axios.create({
  baseURL: "https://stablediffusionapi.com/api/v1/enterprise/",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});
const StableDiffusion = axios.create({
  baseURL: "https://stablediffusionapi.com/api/v3/",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});
const apikey = "C1geu3p0yo7dUESsAxbSYMSOe8HlJbOdPKHAtNy9vQ8N8J9ulL2YxGoYXHJe";
export const stableDiffusionRouter = createTRPCRouter({
  getModels: protectedProcedure.mutation(async () => {
    try {
      const res = await EnterprisePlan.post("get_all_models", {
        key: apikey,
      });
      console.log({ res });
    } catch (error) {
      console.log(error);
    }
  }),
  img2img: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        modelId: z.string().optional(),
        prompt: z.string().optional(),
      })
    )
    .mutation(
      async ({ input: { prompt, imageUrl, modelId }, ctx: { session } }) => {
        try {
          const res = await StableDiffusion.post("img2img", {
            key: apikey,
            prompt,
            model_id: modelId,
            negative_prompt: null,
            init_image: imageUrl,
            width: "512",
            height: "512",
            samples: "1",
            num_inference_steps: "30",
            safety_checker: "yes",
            enhance_prompt: "yes",
            guidance_scale: 7.5,
            strength: 0.7,
            seed: null,
            webhook: null,
            track_id: null,
          });
          //decrease user credits
          await decreaseCredits(session.user.id, IMG2IMG_COST);
          console.log({ res });
        } catch (error) {
          console.log(error);
        }
      }
    ),
});
