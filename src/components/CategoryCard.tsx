import Image from "next/image";
import Link from "next/link";

type CategoryCardPropType = {
  href: string;
  title: string;
};
const CategoryCard = ({ href, title }: CategoryCardPropType) => {
  return (
    <Link href={href} className="w-1/3 p-4">
      <Image src="" alt={title} className="h-64 w-full object-cover" />
      <h3 className="text-center text-xl font-medium ">{title}</h3>
    </Link>
  );
};
export default CategoryCard;
