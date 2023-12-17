import { Prisma } from '@prisma/client'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ActiveUsersProps } from "./type"

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomHexColor(maxBrightness = 16) {
  let letters = "0123456789ABCDEF"
  let color = '#'

  for (let i = 0; i < 6; i++) {
    color += letters[(Math.floor(Math.random() * maxBrightness))]
  }

  return color
}

export function initialText(str: string) {
  return str?.match(/(\b\S)?/g)?.join("")?.slice(0, 2).toUpperCase()
}

export function capitalizeLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLocaleLowerCase()
}

export function prismaExclude<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
}

export function userIsOnline(onlineUser: ActiveUsersProps[], id: string) {
  const online = onlineUser.find(user => user.userId === id)

  return online ? true : false
}

export function convertBase64(file: File) {
  if (file && file.size !== 0) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
}

export function removeNewlines(str: string) {
  // Remove leading and trailing newlines using trim()
  str = str.trim();

  // Remove newline from the beginning of the string
  if (str.startsWith('\n')) {
    str = str.slice(1);
  }

  // Remove newline from the end of the string
  if (str.endsWith('\n')) {
    str = str.slice(0, -1);
  }

  return str;
}