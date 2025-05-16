import { forwardRef } from "react";
import { Handle, HandleProps } from "@xyflow/react";
import { useNodeConnections } from "@xyflow/react";
import { cn } from "@/lib/utils";

export interface BaseHandleProps extends HandleProps {
  variant?: "default" | "minimal" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  shape?: "circle" | "square";
  connection_count?: number;
}

// Improved BaseHandle component for better interaction
export const BaseHandle = forwardRef<HTMLDivElement, BaseHandleProps>(
  (
    {
      className,
      children,
      variant = "default",
      size = "md",
      disabled = false,
      shape = "circle",
      connection_count = 5,
      ...props
    },
    ref
  ) => {
    const connections = useNodeConnections({
      handleType: props.type,
    });
    return (
      <Handle
        isConnectable={connections.length < connection_count}
        ref={ref}
        className={cn(
          // Base styles
          "border transition-all duration-200 ease-in-out custom-large-handle",
          // Shape
          shape === "circle" ? "rounded-full" : "rounded-sm",
          // Size (increased for better interaction)
          size === "sm" && "h-8 w-8",
          size === "md" && "h-10 w-10",
          size === "lg" && "h-14 w-14",
          // Variant styles (enhanced visibility)
          {
            "border-primary/50 bg-primary/30 border-2": variant === "default",
            "bg-primary/20 border-none": variant === "minimal",
            "border-3 border-primary/70 bg-primary/10": variant === "outline",
          },
          // Improved interactive states
          !disabled && "hover:scale-125 hover:bg-primary hover:border-primary hover:shadow-md transition-all duration-200 ease-in-out",
          // Interactive states
          !disabled && [
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
          ],
          // Disabled state
          disabled && "cursor-not-allowed opacity-60",
          // Performance
          "transform-gpu",
          className
        )}
        aria-disabled={disabled}
        role="button"
        {...props}
      >
        {children}
      </Handle>
    );
  }
);

BaseHandle.displayName = "BaseHandle";