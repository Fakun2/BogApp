import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl border border-transparent text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-btn-primary text-btn-primary-foreground hover:bg-btn-primary/80",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        ghost: "bg-transparent text-foreground hover:bg-secondary/70",
        link: "h-auto bg-transparent p-0 text-primary underline-offset-4 hover:underline",
        secondary:
          "bg-btn-secondary text-btn-secondary-foreground hover:bg-[var(--btn-secondary-hover)] hover:text-foreground",
        outline:
          "border-field-border bg-card text-foreground hover:bg-[var(--btn-secondary-hover)] hover:text-foreground"
      },
      size: {
        default: "h-10 px-4 py-2",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-xs": "h-7 w-7 p-0",
        sm: "h-8 px-3",
        xs: "h-7 px-2 text-xs"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, variant, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        className={cn(buttonVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
