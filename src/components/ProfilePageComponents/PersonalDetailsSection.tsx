import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../utils/api";

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

  const {
    register: PDForm,
    handleSubmit,
    formState,
  } = useForm<ZodPDFormType>({
    resolver: zodResolver(ZodPDForm),
  });

  const onSubmit = async (data: ZodPDFormType) => {
    await AddPersonalDetails({ ...data, phone: parseInt(data.phone) });
  };

  return (
    <section className="min-h-screen bg-skin-main text-white">
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
        className="flex flex-col items-center justify-center pb-20"
      >
        <div className="w-72">
          <h2 className="text-2xl text-red-500">
            {formState?.errors["phone"]?.message}
          </h2>

          {PDLoading
            ? null
            : PersonalDetailsKeys.map((key) => {
                return (
                  <div
                    className="mb-4 flex w-full justify-center pt-7"
                    key={nanoid()}
                  >
                    <input
                      className="w-full rounded-sm bg-skin-secondary py-2 text-lg text-white"
                      placeholder={key}
                      defaultValue={personalDetails?.[key] || undefined}
                      type={key == "phone" ? "number" : "text"}
                      {...PDForm(key)}
                    />
                  </div>
                );
              })}
        </div>
        <div className="flex justify-center">
          <button
            className="my-4 w-32 rounded-md bg-skin-secondary px-10 py-2 text-lg
             text-white duration-150 hover:bg-skin-light-secondary active:scale-105"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
