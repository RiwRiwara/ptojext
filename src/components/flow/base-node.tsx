import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BaseNodeProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
}

export const BaseNode = forwardRef<HTMLDivElement, BaseNodeProps>(
  (
    {
      className,
      selected = false,
      variant = "default",
      disabled = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-lg border bg-card text-card-foreground transition-all duration-200 ease-in-out",
        "p-2",
        {
          "border-card-foreground/20 shadow-sm": variant === "default",
          "border-border bg-transparent": variant === "outline",
          "border-none bg-transparent": variant === "ghost",
        },
        selected && !disabled
          ? "border-primary shadow-md ring-2 ring-primary/50"
          : "",
        !disabled && "hover:scale-[1.02] hover:ring-2 hover:ring-primary/30",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        // Disabled state
        disabled && "cursor-not-allowed opacity-60",
        // Animation for smooth scaling
        "transform-gpu",
        className
      )}
      tabIndex={disabled ? undefined : 0}
      role="button"
      aria-selected={selected}
      aria-disabled={disabled}
      {...props}
    />
  )
);

BaseNode.displayName = "BaseNode";