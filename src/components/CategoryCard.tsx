import Image from "next/image";
import Link from "next/link";

type CategoryCardPropType = {
  href: string;
  title: string;
};
const CategoryCard = ({ href, title }: CategoryCardPropType) => {
  return (
    <Link href={href} className="w-1/3 p-4">
      <Image
        src="https://images-api.printify.com/mockup/63eff0611503e060860a2eb8/75764/54917/canvas-gallery-wraps.jpg&w=128&q=75"
        alt={title}
        width={100}
        height={100}
        className="h-64 w-full object-cover"
      />
      <h3 className="text-center text-xl font-medium ">{title}</h3>
    </Link>
  );
};
export default CategoryCard;
