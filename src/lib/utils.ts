import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import PocketBase from "pocketbase";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exerciseSchema = z.array(
  z.object({
    id: z.string(),
    container: z.string(),
    name: z.string(),
    reps: z.number(),
    sets: z.number(),
  })
);

export const workoutSchema = z.array(
  z.object({
    exercises: z.array(
      z.object({
        id: z.string(),
        container: z.string(),
        name: z.string(),
        reps: z.number(),
        sets: z.number(),
      })
    ),
    id: z.string(),
    name: z.string(),
    updated: z.string(),
  })
);

type Workout = z.infer<typeof workoutSchema>;
const globalForPB = globalThis as unknown as { pb: PocketBase | undefined };

const pb =
  globalForPB.pb ?? new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

pb.autoCancellation(false);

export { pb };
