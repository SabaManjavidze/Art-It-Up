import { type NextPage } from "next";
import { ReactNode, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import CategoryCard from "../components/CategoryCard";
import { api } from "../utils/api";
import { Loader2 } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { LOREM_IPSUM, SIZES_PROP } from "@/utils/constants";
import UserReviewCard from "@/components/general/UserReviewCard";
import { UserReview } from "@/utils/types/types";
import { nanoid } from "nanoid";

const userReviews: UserReview[] = [
  {
    desc: LOREM_IPSUM,
    rating: 5,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "gela",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 5,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "gocha",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 5,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "geimeri",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 5,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "geimeri",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 4,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "geimeri",
    },
  },
  {
    desc: LOREM_IPSUM,
    rating: 1,
    user: {
      picture:
        "https://images-api.printify.com/mockup/63fe7544bdb6399f6f0c91a7/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      name: "geimeri",
    },
  },
];
const Home: NextPage = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const router = useRouter();
  const { data, isLoading } = api.product.getPrintifyShopProducts.useQuery();

  if (isLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 size={50} />
      </div>
    );
  return (
    <>
      <Head>
        <title>Online Shop</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-background text-primary-foreground">
        {/* Second section - Gallery of products */}
        <div className="py-20">
          <h2 className="text-center text-3xl font-medium ">
            Featured Products
          </h2>
          <div className="bg-whiterst:w-full flex flex-wrap justify-center first:w-full">
            {!isLoading && data ? (
              <Carousel
                showArrows={true}
                selectedItem={selectedItem}
                swipeable
                className="w-[90%] px-5"
                showThumbs={false}
                renderArrowNext={(clickHandler, hasNext, label) => (
                  <button
                    type="button"
                    onClick={clickHandler}
                    className={`${
                      hasNext ? "block" : "hidden"
                    } absolute top-1/2 bottom-0 right-0 z-10 mt-0 -translate-y-1/2 p-1`}
                  >
                    <BsChevronRight
                      size={30}
                      className="text-primary duration-150 hover:scale-110"
                    />
                  </button>
                )}
                renderArrowPrev={(clickHandler, hasPrev, label) => (
                  <button
                    type="button"
                    onClick={clickHandler}
                    className={`${
                      hasPrev ? "block" : "hidden"
                    } absolute top-1/2 bottom-0 left-0 z-10 mt-0 -translate-y-1/2 p-1`}
                  >
                    <BsChevronLeft
                      size={30}
                      className="text-primary duration-150 hover:scale-110"
                    />
                  </button>
                )}
                renderIndicator={(e, isSelected, index) => {
                  return (
                    <li
                      value={index}
                      role="button"
                      onClick={() => {
                        setSelectedItem(index);
                      }}
                      className={`${
                        isSelected ? "border-2 border-white" : null
                      } mx-2 inline-block h-2 w-2 rounded-full bg-black duration-150`}
                    ></li>
                  );
                }}
                autoPlay
                infiniteLoop
                onClickItem={(_, product) => {
                  const prod = product as { props: { href: string } };
                  router.push(prod.props.href);
                }}
                emulateTouch
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
        </div>

        {/* Third section - user reviews */}
        <div className="gradient-section pb-10">
          <div className="container">
            <div className="flex w-full justify-start">
              <h2 className="py-10 text-center text-4xl font-semibold text-primary-foreground">
                Customer Feedback
              </h2>
            </div>
            <div className="grid w-full grid-cols-3 grid-rows-2 gap-5">
              {userReviews.map((review) => (
                <UserReviewCard review={review} key={nanoid()} />
              ))}
            </div>
          </div>
        </div>
        {/* Fourth section - pricing plans*/}
        <div className="pb-10">
          <div className="container-xl">
            <div className="flex w-full flex-col items-center">
              <h2 className="pt-10 text-center text-4xl font-semibold text-primary-foreground">
                Pricing Plans
              </h2>
              <p className="mt-1 w-56 text-center text-sm text-muted-foreground">
                Choose the type of payment that is more acceptable to you
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
