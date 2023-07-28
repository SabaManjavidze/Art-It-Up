import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import lodash from "lodash";
import type { PrintifyGetProductResponse } from "../../../utils/printify/printifyTypes";
import { prisma } from "../../../server/db";
import { printify } from "../../../server/PrintifyClient";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const webhookSecret = process.env.PRINTIFY_WEBHOOK_SECRET;
    const signature = req.headers["x-pfy-signature"] as string;
    const payload = JSON.stringify(req.body);

    const computedSignature = crypto
      .createHmac("sha256", webhookSecret as string)
      .update(payload)
      .digest("hex");

    if (signature !== "sha256=" + computedSignature) {
      return res.status(403).send("Invalid signature");
    }
    const data = req.body;

    if (req.body.type === "product:deleted") {
      await prisma.product.delete({ where: { id: data.resource.id } });
    } else if (req.body.type === "product:publish:started") {
      const product = (await printify.getProduct(
        data.resource.id
      )) as unknown as PrintifyGetProductResponse;
      await prisma.product.create({
        data: {
          id: product.id,
          title: product.title,
          description: product.description,
          picture: product.images[0]?.src.toString() as string,
          created_at: new Date(product.created_at),
        },
      });
      const tags = await prisma.$transaction(
        product.tags.map((tag) => prisma.tags.create({ data: { name: tag } }))
      );
      await prisma.productTags.createMany({
        data: tags.map((tag) => {
          return { tagId: tag.id, productId: product.id };
        }),
      });
    }
    res.status(200).end();
  }
}
