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
const PersonalDetailsKeys = [
  { key: "phone", title: "Phone Number" },
  { key: "firstName", title: "First Name" },
  { key: "lastName", title: "Last Name" },
] as const;
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
    <div className="bg-background text-primary-foreground">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-full">
            {PDLoading
              ? null
              : PersonalDetailsKeys.map(({ key, title }) => {
                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      defaultValue={personalDetails?.[key]?.toString() || ""}
                      render={({ field }) => (
                        <FormItem className="pt-4">
                          <FormLabel>{title}</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full rounded-sm py-2 text-lg text-primary-foreground"
                              placeholder={title}
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
          <div className="absolute left-1/2 bottom-0 flex -translate-x-1/2 translate-y-full justify-center pt-6 md:right-5 md:translate-x-0 md:translate-y-0">
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
    </div>
  );
}
