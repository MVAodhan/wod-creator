"use client";

import { pb } from "@/lib/utils";
import { Exercise } from "@/types";
import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";

const MyDocument = () => (
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
        <View style={{ flexDirection: "row", gap: "50px" }}>
          <Text style={{ width: "33%" }}>Push Ups</Text>
          <Text style={{ width: "33%" }}>15</Text>
          <Text style={{ width: "33%" }}>3</Text>
        </View>
      </View>
    </Page>
  </Document>
);

const Viewer = () => {
  return (
    <PDFViewer style={{ height: "100%" }}>
      <MyDocument />
    </PDFViewer>
  );
};

export default Viewer;
