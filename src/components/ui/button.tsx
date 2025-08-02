import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 backdrop-blur backdrop-filter border border-solid shadow-sm active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-glass-background border-glass-border text-primary-foreground shadow-lg hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-primary",
        destructive:
          "bg-destructive/30 border-destructive/50 text-destructive-foreground hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-destructive",
        outline:
          "border-primary bg-glass-background hover:bg-primary/10 hover:text-primary focus-visible:ring-primary",
        secondary:
          "bg-secondary/30 border-secondary/50 text-secondary-foreground hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-secondary",
        ghost:
          "border-transparent bg-transparent hover:bg-accent/40 hover:text-accent-foreground focus-visible:ring-accent",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
      },
      size: {
        default: "h-10 px-5 py-2 text-base",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-lg",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
