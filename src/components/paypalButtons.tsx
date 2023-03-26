import type {
  PayPalNamespace,
  PayPalButtonsComponentOptions} from "@paypal/paypal-js";
import {
  loadScript
} from "@paypal/paypal-js";
import { clientEnv } from "../env/schema.mjs";
import { printify } from "../server/api/routers/printify.router";

export const loadPaypal = async (
  id: string,
  price: number | string,
  onApprove?: PayPalButtonsComponentOptions["onApprove"],
  onClick?: PayPalButtonsComponentOptions["onClick"]
) => {
  let paypal: PayPalNamespace | null = null;

  try {
    paypal = await loadScript({
      "client-id": process.env.PAYPAL_CLIENT_ID as string,
    });
  } catch (error) {
    console.error("failed to load the PayPal JS SDK script", error);
  }

  if (paypal) {
    try {
      await paypal
        .Buttons?.({
          onError: async function (error) {
            console.log({ error });
          },
          onClick,
          onApprove,
          createOrder: async function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price.toString(),
                  },
                },
              ],
            });
          },
          style: { tagline: false },
        })
        .render(id);
    } catch (error) {
      console.error("failed to render the PayPal Buttons", error);
    }
  }
};
