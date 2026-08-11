import React, {
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";

import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "var(--foreground)",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "var(--background)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-foreground/10 px-6 py-3 whitespace-nowrap text-foreground [background:var(--bg)]",
          "shadow-[0_8px_24px_color-mix(in_oklch,var(--foreground)_14%,transparent)] transition-all duration-300 ease-in-out hover:shadow-[0_12px_32px_color-mix(in_oklch,var(--foreground)_28%,transparent)] active:translate-y-px active:shadow-[0_6px_16px_color-mix(in_oklch,var(--foreground)_20%,transparent)] dark:shadow-[0_8px_20px_rgb(255_255_255_/_0.06)] dark:hover:shadow-[0_10px_24px_rgb(255_255_255_/_0.11)] dark:active:shadow-[0_6px_16px_rgb(255_255_255_/_0.08)]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "@container-[size] absolute inset-0 overflow-visible",
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full",

            "[border-radius:var(--radius)] px-4 py-1.5 text-sm font-medium [box-shadow:inset_0_-8px_10px_color-mix(in_oklch,var(--foreground)_16%,transparent)] dark:[box-shadow:inset_0_-8px_10px_rgb(255_255_255_/_0.08)]",

            // transition
            "transform-gpu transition-all duration-300 ease-in-out",

            // on hover
            "group-hover:[box-shadow:inset_0_-6px_12px_color-mix(in_oklch,var(--foreground)_30%,transparent)] dark:group-hover:[box-shadow:inset_0_-6px_12px_rgb(255_255_255_/_0.14)]",

            // on click
            "group-active:[box-shadow:inset_0_-10px_12px_color-mix(in_oklch,var(--foreground)_36%,transparent)] dark:group-active:[box-shadow:inset_0_-10px_12px_rgb(255_255_255_/_0.18)]",
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]",
          )}
        />
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";
