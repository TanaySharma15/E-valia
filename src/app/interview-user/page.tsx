"use client";
import Vapi from "@vapi-ai/web";

import { InterviewQuestion } from "@/types/question";
import { formatQuestion } from "@/utils/formatQuestions";
import type { UIMessage } from "ai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { createClient } from "@/utils/supabase/client";

export default function InterviewPage() {
  const [question, setQuestion] = useState<InterviewQuestion[]>([]);
  const [conversation, setConversation] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [timeLeft, setTimeLeft] = useState(2 * 60);
  const [started, setStarted] = useState(false);
  const router = useRouter();
  let QuestToAI = "";
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

  const assistantOptions: CreateAssistantDTO = {
    name: "AI Recruiter",
    firstMessage: `Hi Tanay, how are you? Ready for your interview on ${jobPosition}?`,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },

    voice: {
      provider: "playht",
      voiceId: "jennifer",
    },

    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.

Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${jobPosition} interview, let’s get started with a few questions!"

Ask one question at a time and wait for the candidate’s response before proceeding. 
Keep the questions clear and concise. Below are the questions asked one by one:

Questions: ${QuestToAI}

If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"

Provide brief, encouraging feedback after each answer. Example:
"Nice! That’s a solid answer."
"Hmm, not quite! Want to try again?"

Keep the conversation natural and engaging—use casual phrases like 
"Alright, next up..." or "Let’s tackle a tricky one!"

After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"

End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"

Key Guidelines:
✅ Be friendly, engaging, and witty
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate’s confidence level
✅ Ensure the interview remains focused on React
        `.trim(),
        },
      ],
    },
  };

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("Call started");
    });
    vapi.on("message", (message) => {
      console.log(message?.conversation);
      setConversation(message?.conversation);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");

      console.log("conversation->", conversation);
    });
  }, [conversation]);
  useEffect(() => {
    async function getQuestions() {
      try {
        setLoading(true);
        const res = await fetch("/api/getQuestion", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const response = data.steps[0].response.messages[0].content[0].text;
        const formatted = formatQuestion(response);
        const array = JSON.parse(formatted);
        setQuestion(array);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    async function getDetails() {
      const supabase = await createClient();
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      const { data: job } = await supabase
        .from("job")
        .select("title,description")
        .eq("user_id", userId);
      const jobTitle = job?.[0].title;
      setJobPosition(jobTitle);
    }
    getQuestions();
    getDetails();
  }, []);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const startInterview = () => {
    if (question) {
      (question as InterviewQuestion[]).forEach((part) => {
        QuestToAI = QuestToAI + part.id + "->" + part.question + ".";
      });
    }

    vapi.start(assistantOptions);
    vapi.on("message", (message) => {
      console.log("message event:", message);
      if (message?.conversation) {
        setConversation(message.conversation);
      }
    });
  };
  const endInterview = async () => {
    try {
      vapi.stop();
    } catch (error) {
      console.log(error);
    }
    console.log("conversation->", conversation);
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl">
        {" "}
        Time left: {minutes}:{seconds.toString().padStart(2, "0")}
      </h1>

      <button
        className={`px-4 py-2 bg-green-300 ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={startInterview}
      >
        {loading ? "Wait..." : "Start Interview"}
      </button>
      <button
        className={`px-4 py-2 bg-red-300 ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={endInterview}
      >
        {loading ? "Wait" : "End Interview"}
      </button>
    </div>
  );
}
