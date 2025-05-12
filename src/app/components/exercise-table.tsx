"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddExercise from "./add-exercise";
import { useEffect, useState } from "react";
import { exerciseSchema, pb } from "@/lib/utils";
import { Exercise } from "@/types";

const ExerciseTable = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercises, setNewExercises] = useState<Exercise[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const saveExercise = async () => {
    setSaving(true);
    for (const excercise of newExercises) {
      await pb.collection("exercises").create({
        container: excercise.container,
        name: excercise.name,
        reps: excercise.reps,
        sets: excercise.sets,
      });
    }
    setNewExercises([]);
    setSaving(false);
    console.log("exercises", exercises);
    console.log("new Exercises", newExercises);
  };

  const getExercises = async () => {
    const exercises = await pb.collection("exercises").getFullList();
    if (exercises.length > 0) {
      const results = exerciseSchema.safeParse(exercises);
      if (!results.success) {
        console.log("error", results.error);
        return;
      } else {
        setExercises(results.data);
      }
    }
  };

  useEffect(() => {
    getExercises();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exercise</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead>Sets</TableHead>
          <TableHead className="flex gap-2 justify-end items-center">
            <AddExercise
              setExercises={setExercises}
              setNewExercises={setNewExercises}
            />
            <Button
              onClick={() => {
                saveExercise();
              }}
              disabled={saving}
            >
              {saving ? (
                <div className="flex justify-center items-center p-4">
                  <div
                    className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"
                    role="status" // Added for accessibility
                    aria-live="polite" // Added for accessibility
                    aria-label="Loading" // Added for accessibility
                  >
                    {/* Visually hidden text for screen readers */}
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises &&
          exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell className="font-medium">{exercise.name}</TableCell>
              <TableCell>{exercise.reps}</TableCell>
              <TableCell>{exercise.sets}</TableCell>
              <TableCell className="flex justify-end items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-150 ease-in-out"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default ExerciseTable;
