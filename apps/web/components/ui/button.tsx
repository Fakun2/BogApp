import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-btn-primary text-btn-primary-foreground hover:bg-btn-primary/80",
        secondary:
          "bg-btn-secondary text-btn-secondary-foreground hover:bg-[var(--btn-secondary-hover)] hover:text-foreground",
        outline:
          "border-field-border bg-card text-foreground hover:bg-[var(--btn-secondary-hover)] hover:text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />
    );
  }
);

Button.displayName = "Button";
