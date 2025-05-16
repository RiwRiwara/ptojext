"use client";
import React, { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { HandleProps, Position } from "@xyflow/react";

import { BaseHandle } from "@/components/flow/base-handle";

const flexDirections: Record<Position, string> = {
  top: "flex-col items-center",
  right: "flex-row-reverse items-center justify-end",
  bottom: "flex-col-reverse items-center justify-end",
  left: "flex-row items-center",
};

// Omit 'id' from HTMLAttributes to avoid conflict with HandleProps
interface LabeledHandleProps
  extends HandleProps,
  Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  title: string;
  handleClassName?: string;
  labelClassName?: string;
  variant?: "default" | "minimal" | "outline";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  connection_count?: number;
}

// Enhanced labeled handle component for better interaction
export const LabeledHandle = forwardRef<HTMLDivElement, LabeledHandleProps>(
  (
    {
      className,
      labelClassName,
      handleClassName,
      title,
      position = Position.Top,
      variant = "default",
      disabled = false,
      size = "md",
      connection_count,
      id,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      title={title}
      className={cn(
        "relative flex",
        flexDirections[position],
        size === "sm" && "gap-1",
        size === "md" && "gap-1.5",
        size === "lg" && "gap-2",
        !disabled && "transition-all duration-200 ease-in-out",
        className
      )}
      role="group"
      aria-label={`Handle with label: ${title}`}
      aria-disabled={disabled}
    >
      <BaseHandle
        id={id}
        position={position}
        className={cn(
          {
            "border-3 border-primary/70 bg-primary/30": variant === "default",
            "bg-primary/30 border-primary/50 border-2": variant === "minimal",
            "border-3 border-primary/80 bg-primary/20": variant === "outline",
          },
          // Increased sizes for better interaction
          size === "sm" && "h-8 w-8",
          size === "md" && "h-10 w-10",
          size === "lg" && "h-14 w-14",
          // Enhanced hover effects
          !disabled && "hover:scale-130 hover:bg-primary hover:border-primary/90 hover:shadow-lg transition-all duration-200",
          disabled && "cursor-not-allowed opacity-60",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
          handleClassName
        )}
        variant={variant}
        disabled={disabled}
        size={size}
        connection_count={connection_count}
        {...props}
      />
      <label
        className={cn(
          "text-foreground select-none font-medium",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-lg",
          variant === "minimal" && "text-muted-foreground",
          "px-2 py-1 rounded-md",
          !disabled && "hover:text-primary hover:bg-background/50",
          disabled && "opacity-60",
          labelClassName
        )}
      >
        {title}
      </label>
    </div>
  )
);

LabeledHandle.displayName = "LabeledHandle";