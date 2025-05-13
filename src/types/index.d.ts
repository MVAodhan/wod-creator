export interface Exercise {
  id: string;
  container: string;
  name: string;
  reps: number;
  sets: number;
}

export interface Workout {
  exercises: Exercise;
  id: string;
  name: string;
  updated: string;
}
