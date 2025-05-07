import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import PocketBase from "pocketbase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const globalForPB = globalThis as unknown as { pb: PocketBase | undefined };

const pb =
  globalForPB.pb ?? new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

pb.autoCancellation(false);

export { pb };
