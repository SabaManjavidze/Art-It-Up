// Partial of ./pages/api/webhooks/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: true,
    // sizeLimit: "1mb",
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

    console.log({ payload, signature, headers: req.headers });
    const computedSignature = crypto
      .createHmac("sha256", webhookSecret as string)
      .update(payload)
      .digest("hex");

    if (signature !== "sha256=" + computedSignature) {
      return res.status(403).send("Invalid signature");
    }

    const event = req.headers["x-printify-event"] as string;
    const data = req.body.data;

    console.log({ event, data });
  }
  res.status(200).end();
}
