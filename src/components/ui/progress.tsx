import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'default' | 'danger' | 'warning' | 'safe' | 'info';
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'default', ...props }, ref) => {
  const indicatorStyles = {
    default: 'bg-primary',
    danger: 'bg-danger',
    warning: 'bg-warning',
    safe: 'bg-safe',
    info: 'bg-info',
  };

  // Auto-determine color based on value
  const autoVariant = variant === 'default' 
    ? (value || 0) >= 80 ? 'safe' : (value || 0) >= 50 ? 'warning' : 'danger'
    : variant;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-all", indicatorStyles[autoVariant])}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
