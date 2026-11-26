import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "headline-mobile", "headline-lg", "headline-md", "title-lg", "title-md",
        "body-lg", "body-md", "body-sm", "label-lg", "label-md",
      ],
      radius: ["control"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
