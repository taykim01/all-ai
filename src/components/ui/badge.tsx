import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary/20 text-primary-foreground hover:bg-primary/30",
        secondary:
          "border-secondary/20 bg-secondary/20 text-secondary-foreground hover:bg-secondary/30",
        destructive:
          "border-destructive/20 bg-destructive/20 text-destructive-foreground hover:bg-destructive/30",
        success:
          "border-success/20 bg-success/20 text-success hover:bg-success/30",
        warning:
          "border-warning/20 bg-warning/20 text-warning hover:bg-warning/30",
        info: "border-info/20 bg-info/20 text-info hover:bg-info/30",
        outline: "text-foreground border-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
