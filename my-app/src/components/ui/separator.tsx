"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, children, ...props }, ref) => {
    if (children) {
      return (
        <div
          ref={ref}
          className={cn("relative my-4 flex items-center justify-center w-full", className)}
          {...props}
        >
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
              {children}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0 bg-zinc-200 dark:bg-zinc-800",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator };
