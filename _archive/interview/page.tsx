"use client";

import { formatQuestion } from "@/utils/formatQuestions";
import type { UIMessage } from "ai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function InterviewPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("Let's start the interview");
  const [conversation, setConversation] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2 * 60);
  const [started, setStarted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!started) {
      return;
    }
    if (timeLeft <= 0) {
      router.push("/analysis");
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        return 0; // never go negative
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, started]);
  const playAudio = async () => {};

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const newMessage: UIMessage = {
        id: `user-msg-${conversation.length + 1}`,
        role: "user",
        parts: [{ type: "text", text: response }],
      };
      const updatedConversation = [...conversation, newMessage];
      setConversation((prev) => [...prev, newMessage]);
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userResponse: updatedConversation,
          currentIndex,
          timeLeft,
        }),
      });
      const data = await res.json();
      // console.log("DATA", data);
      const responseFromAI = data.steps[0].response.messages[0].content[0].text;
      // console.log(responseFromAI);
      const aiMessage: UIMessage = {
        id: `ai-msg-${conversation.length + 1}`,
        role: "assistant",
        parts: [{ type: "text", text: responseFromAI }],
      };
      setConversation((prev) => [...prev, aiMessage]);
      const formattedQuestion = formatQuestion(responseFromAI);
      const tts = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: formattedQuestion }),
      });

      const ttsdata = await tts.json();
      const audio = new Audio(`data:audio/wav;base64,${ttsdata.audio}`);
      audio.play();
      setQuestion(formattedQuestion);
      setCurrentIndex((prev) => prev + 1);
      // console.log("RESponse", data);
    } catch (error) {
      console.log(error);
      toast("Error occured during interview");
    } finally {
      setLoading(false);
      setResponse("");
    }
  };
  const startInterview = () => {
    setStarted(true);
  };
  const endInterview = async () => {
    setStarted(false);
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewChat: conversation }),
    });

    const analysis = await res.json();

    // stash it in memory (or localStorage for now)
    localStorage.setItem("lastAnalysis", JSON.stringify(analysis));
    localStorage.setItem("lastChat", JSON.stringify(conversation));

    router.push("/analysis");
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl">
        {" "}
        Time left: {minutes}:{seconds.toString().padStart(2, "0")}
      </h1>
      {question}
      <input
        type="text"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Enter you response here"
        className="border-2 p-6 outline-0 border-gray-300 m-12"
      />
      <button
        onClick={handleSubmit}
        className={`  px-4 py-2  ${loading ? "bg-slate-500" : "bg-blue-300"}
        ${loading ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {loading ? "Loading..." : "Submit"}
      </button>
      {!started && (
        <button
          className="px-4 py-2 bg-green-300 cursor-pointer"
          onClick={startInterview}
        >
          Start Interview
        </button>
      )}
      {started && (
        <button
          className="px-4 py-2 bg-red-300 cursor-pointer"
          onClick={endInterview}
        >
          End Interview
        </button>
      )}
      <button
        className="px-4 py-2 bg-red-300 cursor-pointer"
        onClick={playAudio}
      >
        TTS
      </button>
    </div>
  );
}
