"use client";
import { pb, workoutSchema } from "@/lib/utils";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Workout } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);

  const getWorkouts = async () => {
    const res = await pb.collection("workouts").getFullList();
    const workouts = workoutSchema.safeParse(res);
    if (workouts.success) {
      setWorkouts(workouts.data as unknown as Workout[]);
    }

    const user = await pb.authStore.record;
    console.log(user);
  };

  useEffect(() => {
    getWorkouts();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Workout Name</TableHead>
          <TableHead className="   border-green-500">Last Updated</TableHead>
          <TableHead className="   border-green-500">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-full">
        {workouts &&
          workouts.map((workout: Workout) => (
            <TableRow key={workout.id}>
              <TableCell>{workout.name}</TableCell>

              <TableCell>{workout.updated.split(" ")[0]}</TableCell>
              <TableCell>
                <Link href={`/workouts/viewer/${workout.id}`}>
                  <Button variant="outline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 256 256"
                    >
                      <path
                        fill="currentColor"
                        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m45.66-93.66a8 8 0 0 1 0 11.32l-32 32a8 8 0 0 1-11.32-11.32L148.69 136H88a8 8 0 0 1 0-16h60.69l-18.35-18.34a8 8 0 0 1 11.32-11.32Z"
                      />
                    </svg>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default Page;
