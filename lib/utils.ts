import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomHexColor() {
  let letters = "0123456789ABCDEF"
  let color = '#'

  for (let i = 0; i < 6; i++) {
    color += letters[(Math.floor(Math.random() * 16))]
  }

  return color
}

export function initialText(val: string) {
  return val.match(/(\b\S)?/g)?.join("")?.slice(0, 2).toUpperCase()
}