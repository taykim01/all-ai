import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "glass-button inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary/30 text-primary-foreground focus-visible:ring-primary",
        secondary:
          "bg-secondary/30 text-secondary-foreground focus-visible:ring-secondary",
        ghost:
          "hover:bg-accent/40 hover:text-accent-foreground focus-visible:ring-accent",
        destructive:
          "bg-destructive/30 text-destructive-foreground focus-visible:ring-destructive",
      },
      size: {
        default: "h-10 px-5 py-2 text-base",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {}

export function GlassButton({
  className,
  variant,
  size,
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={cn(glassButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
