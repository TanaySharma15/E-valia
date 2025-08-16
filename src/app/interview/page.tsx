"use client";

import { useEffect, useState } from "react";

export default function InterviewPage() {
  const [question, setQuestion] = useState("");
  useEffect(() => {
    const fetchResumeAndJob = async () => {
      const res = await fetch("/api/generate-questions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setQuestion(data.steps[0].response.messages[0].content[0].text);
      console.log("RESponse", data);
    };
    fetchResumeAndJob();
  }, []);
  return <div>{question}</div>;
}
