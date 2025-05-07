"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nanoid } from "nanoid";
import { SetStateAction, useRef, useState } from "react";

const AddExercise = ({
  setExercises,
}: {
  setExercises: React.Dispatch<SetStateAction<Exercise[]>>;
}) => {
  const addExercise = (name: string, reps: number, sets: number) => {
    setExercises((prev) => [
      ...prev,
      {
        id: nanoid(),
        container: "left",
        name: name,
        reps: reps,
        sets: sets,
      },
    ]);
    setIsOpen(false);
  };
  const nameRef = useRef<HTMLInputElement | null>(null);
  const repsRef = useRef<HTMLInputElement | null>(null);
  const setsRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-800 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true" // Hide from screen readers if it's purely decorative or has adjacent text
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Exercise</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              name="exercise-name"
              className="focus-visible:ring-0"
              ref={nameRef}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="exercise-reps">Exercise Reps</Label>
            <Input
              name="exercise-reps"
              className="focus-visible:ring-0"
              ref={repsRef}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="exercise-reps">Exercise Sets</Label>
            <Input
              name="exercise-reps"
              className="focus-visible:ring-0"
              ref={setsRef}
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              addExercise(
                nameRef!.current!.value,
                parseInt(repsRef!.current!.value),
                parseInt(setsRef!.current!.value)
              );
              setIsOpen(false);
            }}
          >
            Add Exercise
          </Button>
          <Button
            variant="ghost"
            className="text-red-500"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExercise;
