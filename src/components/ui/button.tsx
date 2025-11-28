import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold font-body uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 hover:bg-destructive/90",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
        ghost:
          "text-foreground hover:bg-secondary hover:text-foreground",
        link:
          "text-accent underline-offset-4 hover:underline",
        danger:
          "bg-danger text-primary-foreground shadow-lg shadow-danger/40 hover:shadow-danger/60 pulse-danger",
        warning:
          "bg-warning text-background shadow-lg shadow-warning/30 hover:bg-warning/90",
        safe:
          "bg-safe text-primary-foreground shadow-lg shadow-safe/30 hover:bg-safe/90",
        info:
          "bg-info text-background shadow-lg shadow-info/30 hover:bg-info/90",
        control:
          "bg-secondary border-2 border-muted-foreground/30 text-foreground hover:border-accent hover:text-accent hover:shadow-info transition-all",
        emergency:
          "bg-gradient-to-r from-danger to-warning text-primary-foreground shadow-lg shadow-danger/50 hover:shadow-danger/70 animate-pulse",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
        "icon-lg": "h-12 w-12",
        "icon-xl": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
