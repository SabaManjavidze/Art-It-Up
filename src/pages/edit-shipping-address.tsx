import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import { countriesArr, countriesObj } from "../utils/countriesArray";
import { AddressObjectKeys, addressToSchema } from "@/utils/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Capitalize } from "@/utils/constants";
import { Combobox } from "@/components/ui/combobox";
import type { UserAddress } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

const formSchema = addressToSchema.omit({ country: true });
type FormType = z.infer<typeof formSchema>;

export default function EditShippingAddress() {
  const [selected, setSelected] = useState("");
  const [address, setAddress] = useState<UserAddress | null>(null);
  const router = useRouter();
  const { mutateAsync: editShippingAddress, isLoading } =
    api.address.editAddress.useMutation();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    async function getAddressFromParams() {
      let defAddress: UserAddress | undefined;
      window.location.href
        .split("?")
        ?.slice(-1)[0]
        ?.split("&")
        .forEach((item) => {
          const [key, value] = item.split("=");
          if (!value || !key) return;
          defAddress = {
            ...defAddress,
            [key]: value.replaceAll("%20", " "),
          } as any;
        });
      if (!defAddress) return;
      try {
        await addressToSchema
          .and(z.object({ id: z.string() }))
          .parseAsync(defAddress);
        setAddress(defAddress);
        setSelected(
          Object.entries(countriesObj).find(
            ([key, value]) => value == defAddress?.country
          )?.[0] || ""
        );
      } catch (error) {
        console.log(error);
      }
    }
    getAddressFromParams();
  }, []);

  const onSubmit = async (data: FormType) => {
    if (!data || !address) return;

    await editShippingAddress({
      ...data,
      country: countriesObj[Capitalize(selected) as keyof typeof countriesObj],
      addressId: address.id,
    });
    router.push("/user/profile");
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="flex flex-col items-center justify-center pb-20"
        >
          <div className="w-72">
            <div className="flex w-full flex-col justify-center">
              <FormLabel className="pb-4">Country</FormLabel>
              {address && (
                <Combobox
                  setValue={setSelected}
                  searchResults={countriesArr.map(({ name }) => {
                    return { label: name, value: name };
                  })}
                  required
                  value={selected}
                  placeholder="Search country..."
                />
              )}
            </div>

            {address &&
              AddressObjectKeys.map((key) => {
                if (key !== "country")
                  return (
                    <div className="flex w-full justify-center pt-4" key={key}>
                      <FormField
                        control={form.control}
                        name={key}
                        defaultValue={address?.[key] || ""}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="flex items-center justify-between">
                              <FormLabel>{Capitalize(key)}</FormLabel>
                              <FormMessage />
                            </div>
                            <FormControl>
                              <Input
                                className="text-md w-full rounded-sm py-2"
                                placeholder={key}
                                type="text"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  );
              })}
          </div>
          <div className="flex w-72 justify-between">
            <Link href="/user/profile">
              <Button variant={"outline"} className="mt-10 w-24 border-2">
                Cancel
              </Button>
            </Link>
            <Button isLoading={isLoading} type="submit" className="mt-10 w-24">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
