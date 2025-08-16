"use client";
import { useEffect, useState } from "react";

export default function Analysis() {
  const [analysis, setAnalysis] = useState("");
  useEffect(() => {
    // const fetchAnalysis = async () => {
    //   const res = await fetch("/api/analysis", {
    //     method: "POST",
    //   });
    // };
    const data = localStorage.getItem("lastAnalysis");
    const res = JSON.parse(data!);
    setAnalysis(
      res.steps[0].response.messages[0].content[0].text
        .replace("```json", "")
        .replace("```", "")
        .trim()
    );
  }, []);
  return <div>{analysis} </div>;
}
