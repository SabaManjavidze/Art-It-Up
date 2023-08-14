import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../utils/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { nanoid } from "nanoid";

const ZodPDForm = z.object({
  phone: z.string().min(9),
  firstName: z.string().min(4),
  lastName: z.string().min(4),
});
type ZodPDFormType = z.infer<typeof ZodPDForm>;
const PersonalDetailsKeys = ["phone", "firstName", "lastName"] as const;
export default function PersonalDetailsSection() {
  const { mutateAsync: AddPersonalDetails } =
    api.user.addPersonalDetails.useMutation();
  const {
    data: personalDetails,
    isLoading: PDLoading,
    error,
  } = api.user.getPersonalDetails.useQuery();

  const form = useForm<ZodPDFormType>({
    resolver: zodResolver(ZodPDForm),
  });

  const onSubmit = async (data: ZodPDFormType) => {
    await AddPersonalDetails({ ...data, phone: parseInt(data.phone) });
  };

  return (
    <section className="min-h-screen bg-background text-primary-foreground">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center pb-20"
        >
          <div className="w-72">
            {PDLoading
              ? null
              : PersonalDetailsKeys.map((key) => {
                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      defaultValue={personalDetails?.[key]?.toString() || ""}
                      render={({ field }) => (
                        <FormItem className="pt-4">
                          <FormLabel>{key}</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full rounded-sm py-2 text-lg text-primary-foreground"
                              placeholder={key}
                              type={key == "phone" ? "number" : "text"}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
          </div>
          <div className="mt-3 flex justify-center">
            <Button
              variant={"default"}
              className="text-secondary-foreground"
              type="submit"
              isLoading={PDLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
