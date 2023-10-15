import type { Dispatch} from "react";
import { useState } from "react";
import Modal from "../ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { personalDetailsInputSchema } from "@/utils/types/zodTypes";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { personalDetailsArr } from "@/pages/user/profile";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = personalDetailsInputSchema;
type FormType = z.infer<typeof formSchema>;
export function EditDetailsModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });
  const utils = api.useContext();
  const { mutateAsync: editPersonalDetails, isLoading } =
    api.user.updatePersonalDetails.useMutation({
      onSuccess() {
        utils.user.getPersonalDetails.invalidate();
      },
    });
  const {
    data: personalDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = api.user.getPersonalDetails.useQuery();

  const onSubmit = async (data: FormType) => {
    await editPersonalDetails(data);
    setIsOpen(false);
  };
  return (
    <div>
      <Modal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        title="Edit Personal Details"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err);
            })}
            className="flex flex-col items-center justify-center pb-20"
          >
            <div className="w-72">
              {personalDetails &&
                personalDetailsArr.map((key) => {
                  if (key.val !== "birthday" && key.val !== "email")
                    return (
                      <div
                        className="flex w-full justify-center pt-4"
                        key={key.val}
                      >
                        <FormField
                          control={form.control}
                          name={key.val}
                          defaultValue={
                            String(personalDetails?.[key.val]) || ""
                          }
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <div className="flex items-center justify-between">
                                <FormLabel>{key.title}</FormLabel>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  className="text-md w-full rounded-sm py-2"
                                  placeholder={key.title}
                                  type={key.val == "phone" ? "number" : "text"}
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
              <Button
                onClick={() => setIsOpen(false)}
                variant={"outline"}
                className="mt-10 w-24 border-2"
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                type="submit"
                className="mt-10 w-24"
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
    </div>
  );
}
