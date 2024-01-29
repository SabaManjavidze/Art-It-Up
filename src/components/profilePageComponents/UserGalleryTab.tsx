import { usePagination } from "@/hooks/usePaginationHook";
import type { RouterOutputs } from "@/utils/api";
import type { InfiniteData } from "@tanstack/react-query";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
const sizes = {
  lg: "grid gap-4 gap-x-10 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  sm: "grid gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3",
} as const;
export default function UserGalleryTab({
  gallery,
  size = "lg",
  className = "",
}: {
  gallery: InfiniteData<RouterOutputs["gallery"]["getUserGallery"]> | undefined;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const { page } = usePagination();
  return (
    <div className={twMerge(sizes[size], className)}>
      {gallery
        ? gallery.pages[page]?.imgs.map((picture) => (
            <div key={picture.id} className="w-58 relative h-64">
              <Image
                src={picture.url}
                fill
                quality={100}
                className="rounded-lg border-2 border-primary-foreground/70 object-contain"
                alt="User Profile Picture rounded-full"
              />
            </div>
          ))
        : null}
    </div>
  );
}
