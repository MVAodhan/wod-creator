import { pb } from "@/lib/utils";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";
import { NextResponse } from "next/server";



// Create Document Component
const MyDocument = ({ exercises }) => (
  <Document >
    <Page size="A4" style={{ margin: 0, padding: 0}}>
      <View style={{flexDirection: 'row', gap: '50px'}}>
        <Text style={{border: '1px solid red', width: '33%'}}>Name</Text>
        <Text style={{border: '1px solid red', width: '33%'}}>Reps</Text>
        <Text style={{border: '1px solid red', width: '33%'}}>Sets</Text>
      </View>

      <View style={{ margin: 0, padding: 0}}>

      {exercises.map((exercise) => (
              <View key={exercise.id} style={{flexDirection: 'row', gap: '50px'}} >
                <Text style={{border: '1px solid red', width: '33%'}}>{exercise.name}</Text>
                <Text style={{border: '1px solid red', width: '33%'}}>{exercise.reps}</Text>
                <Text style={{border: '1px solid red', width: '33%'}}>{exercise.sets}</Text>
              </View>
            ))}}
      </View>
    </Page>
  </Document>
);


export async function GET(req: Request) {
  const workout = await pb.collection("workouts").getFullList();

  const exercises = [...workout[0].exercises];


  const stream = await renderToStream(<MyDocument exercises={exercises} />);
  return new NextResponse(stream as unknown as ReadableStream);
}
