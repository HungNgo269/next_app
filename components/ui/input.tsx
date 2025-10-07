import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full  rounded-md border border-input bg-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      fieldSize: {
        sm: "h-8 px-2 py-1 text-sm file:text-xs",
        md: "h-9 px-3 py-1 text-base md:text-sm file:text-sm",
        lg: "h-11 px-3 py-2 text-md file:text-base",
        xl: "h-12 px-4 py-3 text-xl file:text-lg",
      },
      variant: {
        default: "border-input",
        ghost: "border-transparent bg-transparent",
        outline: "border-2 border-primary",
        filled: "bg-muted border-transparent",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      fieldSize: "md",
      variant: "default",
      radius: "md",
    },
  }
);

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {} // fieldSize, variant, radius

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fieldSize, variant, radius, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ fieldSize, variant, radius }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
