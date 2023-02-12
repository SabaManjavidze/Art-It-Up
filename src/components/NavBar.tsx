import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { FiShoppingCart, FiHeart, FiLogIn } from "react-icons/fi";

const buttons = [
  {
    href: "/wishlist",
    icon: <FiHeart size={20} />,
  },
  {
    href: "/cart",
    icon: <FiShoppingCart size={20} />,
  },
  {
    href: "/api/auth/signin",
    icon: <FiLogIn size={20} />,
    text: "Login",
  },
];
const Navbar = () => {
  const session = useSession();
  useEffect(() => {
    console.log({ session });
  }, [session]);

  return (
    <nav className="flex items-center justify-between bg-skin-secondary p-4 text-white">
      {/* Logo */}
      <div className="text-skin-primary text-lg font-medium">
        Online Clothing Store
      </div>

      {/* Buttons */}
      <div className="flex w-52 items-center justify-around">
        {buttons.map((button) => (
          <a
            href={button.href}
            className="text-skin-primary hover:text-skin-secondary "
            key={button.href}
          >
            {button.icon}
            {button?.text || ""}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
