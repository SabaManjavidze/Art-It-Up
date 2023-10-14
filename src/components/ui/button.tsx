import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/shadcnUtils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex relative disabled:border-muted-foreground disabled:border items-center justify-center rounded-md text-sm font-medium ring-offset-background duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-secondary-foreground hover:bg-primary/90",
        accent: "bg-accent text-secondary-foreground hover:bg-accent/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-muted hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost: "hover:bg-primary/[8%] hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        slim: "h-9 px-4",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-[75px] rounded-[25px] px-12",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  contentPos?: "start" | "center" | "end";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      isLoading = false,
      variant,
      size,
      asChild = false,
      contentPos = "center",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* {isLoading ? <Loader2 size={20} /> : children} */}
        <div className="inline-flex w-full items-center justify-center">
          <div
            className={`${
              isLoading ? "opacity-0" : "opacity-100"
            } flex w-full items-center justify-${contentPos}`}
          >
            {children}
          </div>
          <div
            className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2"
            hidden={!isLoading}
          >
            <Loader2 size={20} />
          </div>
        </div>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
