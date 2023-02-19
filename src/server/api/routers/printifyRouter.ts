import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import {
  PrintifyGetProductResponse,
  PrintifyGetShopProductsResponse,
} from "../../../utils/printify/printifyTypes";

const PrintifyAxios = axios.create({
  baseURL: "https://api.printify.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}`,
  },
});
const PRINTIFY_SHOP_ID = "5702174";

export const printifyRouter = createTRPCRouter({
  getPrintifyProduct: publicProcedure
    .input(z.object({ product_id: z.string().min(1) }))
    .query(async ({ input: { product_id } }) => {
      try {
        const url = `/shops/${PRINTIFY_SHOP_ID}/products/${product_id}.json`;
        const { data } = await PrintifyAxios.get(url);
        return data as PrintifyGetProductResponse;
      } catch (err) {
        console.log({ err });
      }
    }),
  getPrintifyShopProducts: publicProcedure.query(async () => {
    try {
      const { data } = await PrintifyAxios.get(
        `/shops/${PRINTIFY_SHOP_ID}/products.json`
      );
      return data as PrintifyGetShopProductsResponse;
    } catch (err) {
      console.log({ err });
    }
  }),
});
