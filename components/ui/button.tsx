import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva("focus-ring inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition-transform active:scale-95", { variants: { variant: { default: "bg-[var(--primary)] text-white", secondary: "glass-pill text-[var(--foreground)]" } }, defaultVariants: { variant: "default" } });
export function Button({ className, variant, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) { return <button className={cn(buttonVariants({ variant }), className)} {...props} />; }
