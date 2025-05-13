"use client";
import { pb, workoutSchema } from "@/lib/utils";
import { SetStateAction, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Workout } from "@/types";
import Link from "next/link";

const Page = () => {
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);

  const getWorkouts = async () => {
    const res = await pb.collection("workouts").getFullList();
    const workouts = workoutSchema.safeParse(res);
    if (workouts.success) {
      setWorkouts(workouts.data as unknown as Workout[]);
    }
  };
  useEffect(() => {
    getWorkouts();
  }, []);

  console.log(workouts);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Workout Name</TableHead>
          <TableHead className="flex items-center justify-end ">
            Last Updated
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-full">
        {workouts &&
          workouts.map((workout: Workout) => (
            <TableRow className="w-full" key={workout.id}>
              <TableCell className="">{workout.name}</TableCell>

              <TableCell className="flex items-center justify-end ">
                {workout.updated.split(" ")[0]}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default Page;
