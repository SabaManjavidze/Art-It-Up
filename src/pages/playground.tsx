// pages/index.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { SiStylelint } from "react-icons/si";
import { MdExitToApp, MdOutlineTextFields, MdTextFields } from "react-icons/md";
import { nanoid } from "nanoid";
import { IoExitOutline } from "react-icons/io5";

type FromType = "text" | "image";
const styles = [
  {
    id: nanoid(),
    title: "3D",
    image: "https://i.redd.it/8v41rlshlqo91.png",
  },
  {
    id: nanoid(),
    title: "Cartoon",
    image:
      "https://replicate.delivery/pbxt/s7CafGeN2Nle1p4Ij2cjnodU1qFVjzPYhqeYq7hD80G63vRBB/out-0.png",
  },
  {
    id: nanoid(),
    title: "Galaxy",
    image:
      "https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTm1VNE56TTBNUzB4TW1ZeExUUmhOemd0T0RaaU5TMHpOVGcyWldSa05tUmlOVFVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fef12f95f46216a496528bf9a800e4a703006605/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWd3T2dwellYWmxjbnNKT2hOemRXSnpZVzF3YkdWZmJXOWtaVWtpQjI5dUJqb0dSVlE2Q25OMGNtbHdWRG9PYVc1MFpYSnNZV05sVkRvTWNYVmhiR2wwZVdsZiIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--935666d13f63ed5aca9daa2416340e3a90b6014e/prompthero-prompt-f6f16e5b98f.png",
  },
  {
    id: nanoid(),
    title: "Galaxy",
    image:
      "https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTm1VNE56TTBNUzB4TW1ZeExUUmhOemd0T0RaaU5TMHpOVGcyWldSa05tUmlOVFVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fef12f95f46216a496528bf9a800e4a703006605/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWd3T2dwellYWmxjbnNKT2hOemRXSnpZVzF3YkdWZmJXOWtaVWtpQjI5dUJqb0dSVlE2Q25OMGNtbHdWRG9PYVc1MFpYSnNZV05sVkRvTWNYVmhiR2wwZVdsZiIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--935666d13f63ed5aca9daa2416340e3a90b6014e/prompthero-prompt-f6f16e5b98f.png",
  },
  {
    id: nanoid(),
    title: "3D",
    image: "https://i.redd.it/8v41rlshlqo91.png",
  },
  {
    id: nanoid(),
    title: "Cartoon",
    image:
      "https://replicate.delivery/pbxt/s7CafGeN2Nle1p4Ij2cjnodU1qFVjzPYhqeYq7hD80G63vRBB/out-0.png",
  },
  {
    id: nanoid(),
    title: "Galaxy",
    image:
      "https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTm1VNE56TTBNUzB4TW1ZeExUUmhOemd0T0RaaU5TMHpOVGcyWldSa05tUmlOVFVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fef12f95f46216a496528bf9a800e4a703006605/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWd3T2dwellYWmxjbnNKT2hOemRXSnpZVzF3YkdWZmJXOWtaVWtpQjI5dUJqb0dSVlE2Q25OMGNtbHdWRG9PYVc1MFpYSnNZV05sVkRvTWNYVmhiR2wwZVdsZiIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--935666d13f63ed5aca9daa2416340e3a90b6014e/prompthero-prompt-f6f16e5b98f.png",
  },
  {
    id: nanoid(),
    title: "Galaxy",
    image:
      "https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTm1VNE56TTBNUzB4TW1ZeExUUmhOemd0T0RaaU5TMHpOVGcyWldSa05tUmlOVFVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fef12f95f46216a496528bf9a800e4a703006605/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWd3T2dwellYWmxjbnNKT2hOemRXSnpZVzF3YkdWZmJXOWtaVWtpQjI5dUJqb0dSVlE2Q25OMGNtbHdWRG9PYVc1MFpYSnNZV05sVkRvTWNYVmhiR2wwZVdsZiIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--935666d13f63ed5aca9daa2416340e3a90b6014e/prompthero-prompt-f6f16e5b98f.png",
  },
  {
    id: nanoid(),
    title: "3D",
    image: "https://i.redd.it/8v41rlshlqo91.png",
  },
  {
    id: nanoid(),
    title: "Cartoon",
    image:
      "https://replicate.delivery/pbxt/s7CafGeN2Nle1p4Ij2cjnodU1qFVjzPYhqeYq7hD80G63vRBB/out-0.png",
  },
  {
    id: nanoid(),
    title: "Galaxy",
    image:
      "https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTm1VNE56TTBNUzB4TW1ZeExUUmhOemd0T0RaaU5TMHpOVGcyWldSa05tUmlOVFVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fef12f95f46216a496528bf9a800e4a703006605/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWd3T2dwellYWmxjbnNKT2hOemRXSnpZVzF3YkdWZmJXOWtaVWtpQjI5dUJqb0dSVlE2Q25OMGNtbHdWRG9PYVc1MFpYSnNZV05sVkRvTWNYVmhiR2wwZVdsZiIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--935666d13f63ed5aca9daa2416340e3a90b6014e/prompthero-prompt-f6f16e5b98f.png",
  },
  {
    id: nanoid(),
    title: "Galaxy",
    image:
      "https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTm1VNE56TTBNUzB4TW1ZeExUUmhOemd0T0RaaU5TMHpOVGcyWldSa05tUmlOVFVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fef12f95f46216a496528bf9a800e4a703006605/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWd3T2dwellYWmxjbnNKT2hOemRXSnpZVzF3YkdWZmJXOWtaVWtpQjI5dUJqb0dSVlE2Q25OMGNtbHdWRG9PYVc1MFpYSnNZV05sVkRvTWNYVmhiR2wwZVdsZiIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--935666d13f63ed5aca9daa2416340e3a90b6014e/prompthero-prompt-f6f16e5b98f.png",
  },
  {
    id: nanoid(),
    title: "3D",
    image: "https://i.redd.it/8v41rlshlqo91.png",
  },
  {
    id: nanoid(),
    title: "Cartoon",
    image:
      "https://replicate.delivery/pbxt/s7CafGeN2Nle1p4Ij2cjnodU1qFVjzPYhqeYq7hD80G63vRBB/out-0.png",
  },
  {
    id: nanoid(),
    title: "Galaxy",
    image:
      "https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTm1VNE56TTBNUzB4TW1ZeExUUmhOemd0T0RaaU5TMHpOVGcyWldSa05tUmlOVFVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fef12f95f46216a496528bf9a800e4a703006605/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWd3T2dwellYWmxjbnNKT2hOemRXSnpZVzF3YkdWZmJXOWtaVWtpQjI5dUJqb0dSVlE2Q25OMGNtbHdWRG9PYVc1MFpYSnNZV05sVkRvTWNYVmhiR2wwZVdsZiIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--935666d13f63ed5aca9daa2416340e3a90b6014e/prompthero-prompt-f6f16e5b98f.png",
  },
  {
    id: nanoid(),
    title: "Galaxy",
    image:
      "https://prompthero.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTm1VNE56TTBNUzB4TW1ZeExUUmhOemd0T0RaaU5TMHpOVGcyWldSa05tUmlOVFVHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--fef12f95f46216a496528bf9a800e4a703006605/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09oUnlaWE5wZW1WZmRHOWZiR2x0YVhSYkIya0NBQWd3T2dwellYWmxjbnNKT2hOemRXSnpZVzF3YkdWZmJXOWtaVWtpQjI5dUJqb0dSVlE2Q25OMGNtbHdWRG9PYVc1MFpYSnNZV05sVkRvTWNYVmhiR2wwZVdsZiIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--935666d13f63ed5aca9daa2416340e3a90b6014e/prompthero-prompt-f6f16e5b98f.png",
  },
];
const Playground = () => {
  const [from, setFrom] = useState<FromType>("image");
  const [value, setValue] = useState("");
  const [styleId, setStyle] = useState("");
  const handleFromClick = (newFrom: FromType) => {
    setFrom(newFrom);
  };
  const handleStyleClick = (styleId: string) => {
    setStyle(styleId);
  };
  return (
    <div className="container">
      <div className="mt-32 flex w-full">
        <section className="w-1/4">
          <div className="flex items-center justify-between rounded-3xl bg-primary text-foreground">
            <Button
              variant={from == "text" ? "accent" : "default"}
              className="flex items-center rounded-3xl py-6"
              onClick={() => handleFromClick("text")}
            >
              <MdTextFields
                className={`rounded-lg bg-background p-1 ${
                  from == "text"
                    ? "text-accent-foreground"
                    : "text-primary-foreground"
                }`}
                size={30}
              />
              <h3 className="ml-3">From Text</h3>
            </Button>
            <Button
              variant={from == "image" ? "accent" : "default"}
              className="flex items-center rounded-3xl py-6"
              onClick={() => handleFromClick("image")}
            >
              <BsFillImageFill size={25} />
              <h3 className="ml-3">From Image</h3>
            </Button>
          </div>

          <Textarea
            className="mt-3 h-32 resize-none rounded-3xl border-none bg-gray-50 py-4 text-primary-foreground shadow-lg placeholder:text-muted-foreground"
            placeholder="Describe what you want"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="mt-5">
            <div className="flex items-center">
              <h2>Styles</h2>
              <SiStylelint size={20} className="ml-2" />
            </div>
            <div className="mt-3 grid max-h-80 gap-2 overflow-x-hidden overflow-y-scroll sm:grid-cols-2 md:grid-cols-3">
              {styles.map((style) => (
                <button
                  onClick={() => handleStyleClick(style.id)}
                  className={`relative h-28 w-28 overflow-hidden rounded-xl border-2 ${
                    styleId == style.id ? "border-accent" : "border-transparent"
                  }`}
                  key={style.id}
                >
                  <Image
                    src={style.image}
                    alt={style.image}
                    className="object-cover"
                    fill
                  />
                  <h3 className="absolute left-3 bottom-1 text-secondary-foreground">
                    {style.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>
          <Button
            variant={"accent"}
            className="mt-5 flex w-full items-center rounded-3xl py-8 text-2xl font-normal"
          >
            <h3 className="mr-2">Generate</h3>
            <IoExitOutline size={25} />
          </Button>
        </section>
        <section className="flex w-3/5 items-end justify-start pl-5">
          <div className="relative h-[95%] w-[550px] overflow-hidden rounded-[40px]">
            <Image
              fill
              className="object-cover"
              src={
                "https://replicate.delivery/pbxt/s7CafGeN2Nle1p4Ij2cjnodU1qFVjzPYhqeYq7hD80G63vRBB/out-0.png"
              }
              alt={
                "https://replicate.delivery/pbxt/s7CafGeN2Nle1p4Ij2cjnodU1qFVjzPYhqeYq7hD80G63vRBB/out-0.png"
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Playground;
