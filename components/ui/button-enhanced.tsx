"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-white text-black shadow-lg hover:bg-gray-100 active:bg-gray-200 hover:shadow-xl",
        destructive: "bg-red-600 text-white shadow-lg hover:bg-red-700 active:bg-red-800",
        outline:
          "border border-gray-700 bg-transparent text-white shadow-sm hover:bg-gray-900 hover:border-gray-600 active:bg-gray-800",
        secondary: "bg-gray-900 text-white shadow-sm hover:bg-gray-800 active:bg-gray-700",
        ghost: "text-white hover:bg-gray-900 hover:text-white active:bg-gray-800",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2 min-h-[44px]",
        sm: "h-9 rounded-lg px-4 text-xs min-h-[36px]",
        lg: "h-12 rounded-xl px-8 text-base min-h-[48px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
