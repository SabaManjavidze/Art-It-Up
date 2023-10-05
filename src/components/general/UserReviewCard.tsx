import type { UserReview } from "@/utils/types/types";
import Image from "next/image";
import { limitTxt } from "@/utils/general/utils";
function UserReviewCard({ review }: { review: UserReview }) {
  return (
    <article className="rounded-3xl bg-background px-5">
      <div className="flex items-center space-x-4 py-4 ">
        <Image
          className="h-10 w-10 rounded-full border"
          height={500}
          width={500}
          src={review.user.picture}
          alt=""
        />
        <div className="space-y-1 font-medium dark:text-white">
          <p>{review.user.name}</p>
        </div>
      </div>
      <p className="mb-2 text-gray-500 dark:text-gray-400">
        {limitTxt(review.desc, 220)}
      </p>
      <div className="flex items-center pb-4 pt-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <svg
            key={item}
            className={`mr-1 h-4 w-4 ${
              item <= review.rating ? "text-yellow-300" : "text-gray-300"
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
      </div>
    </article>
  );
}
export default UserReviewCard;
