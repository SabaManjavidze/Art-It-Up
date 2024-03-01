import { z } from "zod";

export const image2Schema = z.object({
  id: z.string().optional(),
  src: z.string().optional(),
  // name: z.string(),
  // type: z.string(),
  height: z.number(),
  width: z.number(),
  x: z.number(),
  y: z.number(),
  scale: z.number(),
  angle: z.number(),
});

export const placeholderSchema = z.object({
  position: z.string(),
  images: z.array(image2Schema),
});

export const printAreaSchema = z.object({
  variant_ids: z.array(z.number()),
  placeholders: z.array(placeholderSchema),
  // background: z.string().optional(),
  // font_color: z.string().optional(),
  // font_family: z.string().optional(),
});

export const variantSchema = z.object({
  id: z.number(),
  // sku: z.string(),
  // cost: z.number(),
  price: z.number(),
  // title: z.string(),
  // grams: z.number(),
  is_enabled: z.boolean(),
  // is_default: z.boolean(),
  // is_available: z.boolean(),
  // options: z.array(z.number()),
  // quantity: z.number(),
});
