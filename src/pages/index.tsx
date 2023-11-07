import { useMemo, useState } from "react";
import Image from "next/image";
import { api } from "../utils/api";
import { Loader2 } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsCheck2 } from "react-icons/bs";
import { SIZES_PROP } from "@/utils/general/constants";
import UserReviewCard from "@/components/general/UserReviewCard";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { creditPricing, styles, userReviews } from "@/utils/home/utils";
import { useSession } from "next-auth/react";

const Home = () => {
  const [value, setValue] = useState("");
  const [copyActive, setCopyActive] = useState(false);
  const router = useRouter();
  const session = useSession();
  const { data, isLoading } = api.product.getPrintifyShopProducts.useQuery();
  const {
    data: sd,
    isLoading: sdLoad,
    mutateAsync: txt2img,
  } = api.stableDiffusion.txt2img.useMutation();

  const ReferralLink = useMemo(
    () => `${process.env.NEXTAUTH_URL}/referral/${session?.data?.user.id}`,
    [session]
  );
  if (isLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 size={50} />
      </div>
    );
  const handleCopyReferral = () => {
    if (session?.data) {
      navigator.clipboard.writeText(ReferralLink);
      setCopyActive(true);
      setTimeout(() => {
        setCopyActive(false);
      }, 1000);
    }
  };
  const handlePromptSubmit = async () => {
    const data = await txt2img({
      modelId: undefined,
      prompt: value,
    });
    console.log(data?.output[0]);
  };
  return (
    <>
      <section className="radial-gradient relative flex h-screen w-full flex-col items-center pb-20">
        <div className="flex w-full flex-col items-center text-center">
          <h1 className="mt-52 w-4/5 text-5xl font-medium leading-snug md:w-1/2 md:text-7xl">
            Art it up , but we are still working on it
          </h1>
          <p className="w-4/5 py-3 text-sm text-muted-foreground md:w-2/5">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
        </div>
        <div className="flex w-full justify-center pt-2">
          <div className="relative flex w-4/5 flex-col lg:w-2/5">
            <div className="relative">
              <Input
                className="rounded-3xl bg-primary py-8 text-secondary-foreground"
                placeholder="Describe what you want"
                onSubmitCapture={handlePromptSubmit}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <Button
                variant={"outline"}
                onClick={handlePromptSubmit}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-xl bg-background px-2 text-primary lg:px-5"
              >
                Generate
              </Button>
            </div>
            <div className="flex w-full flex-col justify-between px-0 pt-2 lg:flex-row lg:px-2">
              <Button
                variant={"outline"}
                className="text-md rounded-2xl bg-background py-6 text-primary-foreground"
              >
                <AiOutlineCloudUpload className="mr-2" size={25} />
                Upload a photo
              </Button>
              <div className="mt-2 flex items-center lg:mt-0">
                <p className="mr-3">Styles:</p>
                <div className="flex max-h-10 flex-nowrap overflow-y-hidden">
                  {styles.map((style) => (
                    <Button
                      key={style.id}
                      className="mx-1 rounded-xl bg-background/40 text-primary-foreground before:inset-0 hover:bg-background/40"
                    >
                      {style.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="min-h-screen bg-background text-primary-foreground">
        {/* Second section - Most popular products*/}
        <section className="pb-20">
          <h2 className="py-10 text-center text-4xl font-semibold text-primary-foreground">
            Most Popular
          </h2>
          <div className="bg-whiterst:w-full flex flex-wrap justify-center first:w-full">
            {!isLoading && data ? (
              <Carousel
                onClick={(_, product) => {
                  const prod = product as { props: { href: string } };
                  router.push(prod.props.href);
                }}
              >
                {data.data.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id}>
                    <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                      <div className="aspect-h-4 aspect-w-5 relative hidden overflow-hidden rounded-lg lg:block">
                        <Image
                          src={product.images?.[1]?.src || ""}
                          alt={product.images?.[1]?.src || ""}
                          className="h-full w-full object-contain object-center"
                          fill
                          sizes={SIZES_PROP}
                        />
                      </div>

                      <div className="aspect-h-5 aspect-w-4 relative sm:overflow-hidden sm:rounded-lg lg:aspect-h-4 lg:aspect-w-3">
                        <Image
                          src={product.images?.[0]?.src || ""}
                          alt={product.images?.[0]?.src || ""}
                          className="h-full w-full object-contain object-center"
                          sizes={SIZES_PROP}
                          fill
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </Carousel>
            ) : (
              <div className="w-1/3 p-4">
                <Loader2 />
              </div>
            )}
          </div>
        </section>

        {/* Third section - user reviews */}
        <section className="gradient-section pb-10">
          <div className="container">
            <div className="flex w-full justify-start">
              <h2 className="py-10 text-center text-4xl font-semibold text-primary-foreground">
                Customer Feedback
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {/* Use responsive grid column classes */}
              {userReviews.map((review) => (
                <UserReviewCard review={review} key={nanoid()} />
              ))}
            </div>
          </div>
        </section>
        {/* Fourth section - Credits*/}
        <section className="pb-10">
          <div className="container-xl">
            <div className="flex w-full flex-col items-center justify-center">
              <h2 className="pt-10 text-center text-4xl font-semibold text-primary-foreground">
                Credits
              </h2>
              <h3 className="mt-5 text-center">
                Invite a friend for{" "}
                <p className="contents text-accent"> FREE </p>
                Credits.
              </h3>

              {session.status == "authenticated" ? (
                <div className="relative mt-2 mb-5 flex w-3/5 flex-col items-center lg:w-1/2">
                  <Input
                    className="rounded-3xl border-primary bg-background py-6 placeholder:text-base placeholder:text-primary"
                    placeholder={ReferralLink}
                  />
                  <Button
                    variant={"outline"}
                    onClick={handleCopyReferral}
                    className={`mt-3 w-full rounded-xl bg-background text-primary sm:absolute sm:right-5 sm:top-1/2 sm:mt-0 sm:w-16 sm:-translate-y-1/2 ${
                      copyActive ? "border-green-500" : null
                    } duration-150 ease-in-out`}
                  >
                    {copyActive ? <BsCheck2 color="green" size={20} /> : "Copy"}
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="container mx-auto md:px-6">
              <section>
                <div className="mt-10">
                  <div
                    className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab02"
                    data-te-tab-active
                  >
                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-x-12">
                      {creditPricing.map((credit) => (
                        <div className="mb-6 lg:mb-0" key={credit.id}>
                          <div
                            className={`relative block h-full rounded-[55px] bg-white dark:bg-neutral-700 ${
                              credit.highlited
                                ? "shadow-2xl shadow-accent/50"
                                : "shadow-xl shadow-primary/20"
                            }`}
                          >
                            <div className="border-b-2 border-neutral-100 border-opacity-100 p-6 text-center dark:border-opacity-10">
                              <p className="mb-4 text-sm uppercase">
                                <strong>{credit.title}</strong>
                              </p>
                              <h3 className="mb-6 text-3xl">
                                <strong>$ {credit.price}</strong>
                                {/* <small className="text-base text-neutral-500 dark:text-neutral-300">
                                  /mo
                                </small> */}
                              </h3>
                            </div>
                            <div className="p-6">
                              {/* 
                              <ol className="mb-20 list-inside">
                                {credit.features.map((feature) => (
                                  <li className="mb-4 flex" key={feature.id}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="2"
                                      stroke="currentColor"
                                      className="dark:text-primary-400 mr-3 h-5 w-5 text-primary"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                      />
                                    </svg>
                                    {feature.title}
                                  </li>
                                ))}
                              </ol>
*/}

                              <div className="absolute bottom-6 left-10 right-10">
                                <Button
                                  type="button"
                                  variant={
                                    credit.highlited ? "accent" : "outline"
                                  }
                                  className="w-full rounded-xl border-primary py-6"
                                >
                                  Buy {credit.title}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="pills-profile02"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab02"
                  >
                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-x-12">
                      <div className="mb-6 lg:mb-0">
                        <div className="block h-full border-2 border-primary bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                          <div className="p-6 pt-6 pb-10 text-center">
                            <p className="mb-4 text-sm uppercase">
                              <strong>3 users</strong>
                            </p>
                            <h3 className="mb-6 text-3xl">
                              <strong>$ 799</strong>
                              <small className="text-base text-neutral-500 dark:text-neutral-300">
                                /year
                              </small>
                            </h3>

                            <button
                              type="button"
                              className="text-primary-700 inline-block w-full rounded bg-[hsl(0,0%,95%)] px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-[hsl(0,0%,93%)] focus:bg-[hsl(0,0%,95%)] focus:outline-none focus:ring-0 active:bg-[hsl(0,0%,90%)]"
                              data-te-ripple-init
                              data-te-ripple-color="light"
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 lg:mb-0">
                        <div className="rondedbg-white rounded-x  border-primaryl block h-full border-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                          <div className="p-6 pt-6 pb-10 text-center">
                            <p className="mb-4 text-sm uppercase">
                              <strong>4 users</strong>
                            </p>
                            <h3 className="mb-6 text-3xl">
                              <strong>$ 999</strong>
                              <small className="text-base text-neutral-500 dark:text-neutral-300">
                                /year
                              </small>
                            </h3>

                            <button
                              type="button"
                              className="text-primary-700 inline-block w-full rounded bg-[hsl(0,0%,95%)] px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-[hsl(0,0%,93%)] focus:bg-[hsl(0,0%,95%)] focus:outline-none focus:ring-0 active:bg-[hsl(0,0%,90%)]"
                              data-te-ripple-init
                              data-te-ripple-color="light"
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 lg:mb-0">
                        <div className="block h-full border-2 border-primary bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                          <div className="p-6 pt-6 pb-10 text-center">
                            <p className="mb-4 text-sm uppercase">
                              <strong>More users</strong>
                            </p>
                            <h3 className="mb-6 text-3xl">
                              <strong>Custom offer</strong>
                            </h3>

                            <button
                              type="button"
                              className="hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 inline-block w-full rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                              data-te-ripple-init
                              data-te-ripple-color="light"
                            >
                              Contact us
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
