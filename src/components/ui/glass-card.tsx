import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div className={cn("glass-card p-6 animate-fade-in", className)} {...props}>
      {children}
    </div>
  );
}
