import React, { useState } from "react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import { countriesArr, countriesObj } from "../utils/countriesArray";
import { AddressObjectKeys, addressToSchema } from "@/utils/types/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Capitalize } from "@/utils/general/utils";
import { Combobox } from "@/components/ui/combobox";
import { useRouter } from "next/router";

const formSchema = addressToSchema.omit({ country: true });
type FormType = z.infer<typeof formSchema>;

export default function ShippingAddress() {
  const trpc = api.useContext();
  const [selected, setSelected] = useState("");
  const { mutateAsync: addShippingAddress, isLoading } =
    api.address.addShippingAddress.useMutation({
      onSuccess() {
        trpc.address.getUserAddress.invalidate();
      },
    });
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormType) => {
    if (!data) return;
    await addShippingAddress({
      ...data,
      country: countriesObj[Capitalize(selected) as keyof typeof countriesObj],
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
            {AddressObjectKeys.map((key) => {
              if (key == "country") {
                return (
                  <div
                    className="flex w-full flex-col justify-center pt-4"
                    key={key}
                  >
                    <FormLabel className="pb-2">Country</FormLabel>
                    <Combobox
                      setValue={setSelected}
                      searchResults={countriesArr.map(({ name }) => {
                        return { label: name, value: name };
                      })}
                      contentPos="start"
                      value={selected}
                      defaultValue={""}
                      placeholder="Search country..."
                    />
                  </div>
                );
              }
              return (
                <div className="flex w-full justify-center pt-4" key={key}>
                  <FormField
                    control={form.control}
                    name={key}
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
                            defaultValue={""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <Button isLoading={isLoading} type="submit" className="mt-10 w-24">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
