"use client";

import { pb, singleWorkoutSchema } from "@/lib/utils";
import { Exercise, Workout } from "@/types";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";

const MyDocument = ({ exercises }: { exercises: Exercise[] }) => (
  <Document style={{ width: "100%", height: "100%" }}>
    <Page size="A4" style={{ marginLeft: 20, marginTop: 20, padding: 0 }}>
      <View style={{ flexDirection: "row", gap: "50px" }}>
        <Text style={{ width: "33%" }}>Name</Text>
        <Text style={{ width: "33%" }}>Reps</Text>
        <Text style={{ width: "33%" }}>Sets</Text>
      </View>

      <View
        style={{
          margin: 0,
          padding: 0,
          flexDirection: "column",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {exercises.map((exercise: Exercise) => (
          <View style={{ flexDirection: "row", gap: "50px" }} key={exercise.id}>
            <Text style={{ width: "33%" }}>{exercise.name}</Text>
            <Text style={{ width: "33%" }}>{exercise.reps}</Text>
            <Text style={{ width: "33%" }}>{exercise.sets}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const Viewer = ({ params }: { params: Promise<{ id: string }> }) => {
  const [workout, setWorkout] = useState<Workout | null>();
  const [ID, setID] = useState<string>();
  const getId = async () => {
    const { id } = await params;
    setID(id);
  };

  const getWorkout = async (id: string) => {
    const workout = await pb.collection("workouts").getOne(id);

    const parsedWorkout = singleWorkoutSchema.safeParse(workout);

    if (parsedWorkout.success)
      setWorkout(parsedWorkout.data as unknown as Workout);
  };

  useEffect(() => {
    getId();
  }, []);

  useEffect(() => {
    if (!ID || workout) return;
    getWorkout(ID!);
  }, [ID]);

  console.log(workout?.exercises);
  return (
    <div className="w-full h-full">
      {workout ? (
        <PDFViewer style={{ height: "100%", width: "100%" }}>
          <MyDocument exercises={workout.exercises as unknown as Exercise[]} />
        </PDFViewer>
      ) : (
        <>No Data</>
      )}
    </div>
  );
};

export default Viewer;
