import type { ReactNode } from "react";
import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { twMerge } from "tailwind-merge";

export function Carousel({
  children,
  className,
  onClick,
  autoPlay = true,
}: {
  className?: string;
  children: any;
  autoPlay?: boolean;
  onClick?: (index: number, item: ReactNode) => void;
}) {
  const [selectedItem, setSelectedItem] = useState(0);
  return (
    <ReactCarousel
      showArrows={true}
      selectedItem={selectedItem}
      swipeable
      className={twMerge("w-[90%] px-5", className)}
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
      autoPlay={autoPlay}
      infiniteLoop
      onClickItem={onClick}
      emulateTouch
    >
      {children}
    </ReactCarousel>
  );
}
