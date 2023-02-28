// Partial of ./pages/api/webhooks/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import {
  PrintifyAxios,
  PRINTIFY_SHOP_ID,
} from "../../../server/api/routers/printifyRouter";
import { sendEmail } from "../../../utils/nodeMailer/sendMail";
import { getServerAuthSession } from "../../../server/auth";
import { PrintifyGetProductResponse } from "../../../utils/printify/printifyTypes";

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

    const computedSignature = crypto
      .createHmac("sha256", webhookSecret as string)
      .update(payload)
      .digest("hex");

    if (signature !== "sha256=" + computedSignature) {
      return res.status(403).send("Invalid signature");
    }
    const data = req.body;

    console.log({ req });
    // get published/deleted printify product
    let text = "";
    let html = "";
    if (req.body.type === "product:publish:started") {
      const url = `/shops/${PRINTIFY_SHOP_ID}/products/${data.resource.id}.json`;
      const { data: productData } = await PrintifyAxios.get(url);
      const product = productData as PrintifyGetProductResponse;
      text = `${data.type}: ${product?.title || ""}`;
      html = `<img src=${product.images[0]?.src} width='400px' height='700px'/>`;
    } else {
      text = "product deleted";
      html = "<h1>Sorry</h1>";
    }

    await sendEmail({
      from: "Online Shop",
      to: "ilusionsofsaba@gmail.com",
      subject: "Webhook Notification Online Shop",
      text,
      html,
    });
  }
  res.status(200).end();
}

// {
//   payload: '{"id":"88c956e2-d38b-4196-aa04-8e8c6854c103","type":"product:publish:started","created_at":"2023-02-26 09:03:18+00:00","resource":{"id":"63fb204b8618be89cd0da648","type":"product","data":{"shop_id":5702174,"publish_details":{"title":true,"variants":true,"description":true,"tags":true,"images":true,"key_features":true,"shipping_template":true,"shipping_methods":[1]},"action":"create","out_of_stock_publishing":0,"external_sku_mapping":[]}}}',
//   signature: undefined,
//   headers: {
//     host: 'online-shop-eosin.vercel.app',
//     'content-type': 'application/json',
//     'x-real-ip': '13.58.237.109',
//     'x-vercel-proxied-for': '13.58.237.109',
//     'x-vercel-deployment-url': 'online-shop-b712bh30h-sabamanjavidze.vercel.app',
//     'x-vercel-ip-latitude': '39.9625',
//     'x-vercel-forwarded-for': '13.58.237.109',
//     forwarded: 'for=13.58.237.109;host=online-shop-eosin.vercel.app;proto=https;sig=0QmVhcmVyIGI3Y2UxMTE0NDZmYWNmYTYxODdiMmFlZGRhODc3NWMzM2NkN2MyM2U0MTczNjMyNzJlOTBmMDM0NjMxZjhjZDE=;exp=1677402508',
//     'x-pfy-eventid': '88c956e2-d38b-4196-aa04-8e8c6854c103',
//     'x-vercel-sc-host': 'iad1.suspense-cache.vercel-infra.com',
//     'x-vercel-id': 'cle1::ctkqg-1677402208492-8abfaf361d53',
//     'x-vercel-sc-headers': '{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOiJwcm9kdWN0aW9uIiwiZGVwbG95bWVudElkIjoiZHBsX0Q1RTljWTVFSDdDN01ZVkJkV05jQnVXcmp6QzMiLCJleHAiOjE2Nzc0MDMxMjgsImlhdCI6MTY3NzQwMjIwOCwib3duZXJJZCI6IjhTYldNTmpKRHNkRTUwdTAxeVlYU2FxYyIsInJlcXVlc3RJZCI6ImN0a3FnLTE2Nzc0MDIyMDg0OTItOGFiZmFmMzYxZDUzIiwiZG9tYWluIjoib25saW5lLXNob3AtZW9zaW4udmVyY2VsLmFwcCIsInByb2plY3RJZCI6InByal8zVUxKWVh1QUNjdHFCZVJvUlFvdXZlOVRQdWwyIn0.ElWocJ6Vqs7QMvxY4UOkYl_SPCJqArxzNCstRI7CLM8"}',
//     'x-matched-path': '/api/webhooks',
//     'x-vercel-ip-longitude': '-83.0061',
//     'x-vercel-sc-basepath': '',
//     'content-length': '442',
//     'x-forwarded-host': 'online-shop-eosin.vercel.app',
//     'x-vercel-ip-country': 'US',
//     'x-forwarded-proto': 'https',
//     'x-vercel-ip-timezone': 'America/New_York',
//     'x-forwarded-for': '13.58.237.109',
//     'user-agent': 'Printify-Webhooks v1.0.1',
//     'x-vercel-ip-country-region': 'OH',
//     'x-vercel-ip-city': 'Columbus',
//     'x-vercel-proxy-signature': 'Bearer b7ce111446facfa6187b2aedda8775c33cd7c23e417363272e90f034631f8cd1',
//     'x-vercel-proxy-signature-ts': '1677402508',
//     connection: 'close'
//   }
// }
