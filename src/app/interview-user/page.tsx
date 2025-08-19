"use client";
import Vapi from "@vapi-ai/web";
import axios from "axios";
import { InterviewQuestion } from "@/types/question";
import { formatQuestion } from "@/utils/formatQuestions";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { createClient } from "@/utils/supabase/client";

export default function InterviewPage() {
  const vapiRef = useRef<Vapi | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion[]>([]);
  // Store all messages from Vapi event handler
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [timeLeft, setTimeLeft] = useState(2 * 60);
  const [started, setStarted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();
  const questToAI = useRef("");

  // Helper function to make text more speech-friendly
  const makeSpeechFriendly = (text: string): string => {
    return (
      text
        // Replace technical terms with pronunciation-friendly versions
        .replace(/NextJS/gi, "Next J S")
        .replace(/Next\.js/gi, "Next J S")
        .replace(/ReactJS/gi, "React J S")
        .replace(/React\.js/gi, "React J S")
        .replace(/NodeJS/gi, "Node J S")
        .replace(/Node\.js/gi, "Node J S")
        .replace(/JavaScript/gi, "Java Script")
        .replace(/TypeScript/gi, "Type Script")
        .replace(/MongoDB/gi, "Mongo D B")
        .replace(/PostgreSQL/gi, "Postgres Q L")
        .replace(/MySQL/gi, "My S Q L")
        .replace(/HTML/gi, "H T M L")
        .replace(/CSS/gi, "C S S")
        .replace(/API/gi, "A P I")
        .replace(/REST/gi, "R E S T")
        .replace(/GraphQL/gi, "Graph Q L")
        .replace(/JSON/gi, "J S O N")
        .replace(/XML/gi, "X M L")
        .replace(/HTTP/gi, "H T T P")
        .replace(/HTTPS/gi, "H T T P S")
        .replace(/URL/gi, "U R L")
        .replace(/DOM/gi, "D O M")
        .replace(/CSS3/gi, "C S S 3")
        .replace(/HTML5/gi, "H T M L 5")
        .replace(/ES6/gi, "E S 6")
        .replace(/ES2015/gi, "E S 2015")
        .replace(/npm/gi, "N P M")
        .replace(/yarn/gi, "Yarn")
        .replace(/webpack/gi, "Web Pack")
        .replace(/babel/gi, "Babel")
        .replace(/eslint/gi, "E S Lint")
        .replace(/git/gi, "Git")
        .replace(/github/gi, "Git Hub")
        .replace(/vs code/gi, "V S Code")
        .replace(/IDE/gi, "I D E")
        // Add periods for better pacing
        .replace(/\?/g, "? ")
        .replace(/\./g, ". ")
        .replace(/!/g, "! ")
        // Clean up extra spaces
        .replace(/\s+/g, " ")
        .trim()
    );
  };

  const getAssistantOptions = (questions: string): CreateAssistantDTO => ({
    name: "AI Recruiter",
    firstMessage: `Hi! Welcome to your ${jobPosition} interview. I'm ready to begin when you are!`,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      stability: 0.8,
      similarityBoost: 0.8,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: makeSpeechFriendly(`
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.

Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.

Ask one question at a time and wait for the candidate's response before proceeding. 
Keep the questions clear and concise. Below are the questions to ask one by one:

Also don't pronounce Q-1 as "Q minus 1" instead pronounce it as "Question number 1" or "let's start with question number 1"

${questions}

IMPORTANT SPEECH GUIDELINES:
- When mentioning technical terms, pronounce them clearly: say "Next J S" instead of "NextJS"
- Use "React J S" instead of "ReactJS"  
- Say "Java Script" instead of "JavaScript"
- Pause naturally between sentences
- Speak slowly and clearly

If the candidate struggles, offer hints or rephrase the question without giving away the answer.

Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Good thinking, let's move to the next one."

Keep the conversation natural and engaging—use casual phrases like 
"Alright, next up..." or "Let's tackle another one!"

After all questions, wrap up the interview smoothly.

Key Guidelines:
✅ Be friendly, engaging, and professional
✅ Keep responses short and natural, like a real conversation
✅ Ask questions one by one in order
✅ Wait for complete answers before moving on
✅ Pronounce technical terms clearly and slowly
          `),
        },
      ],
    },
  });

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    }

    const onCallStart = () => {
      console.log("Call started");
      setStarted(true);
    };

    // Store all messages from Vapi
    const onMessage = (message: any) => {
      console.log("Message received:", message);
      setMessages((prev) => [...prev, message]);
    };

    const onCallEnd = () => {
      console.log("Call ended");
      setStarted(false);
    };

    const onError = (error: any) => {
      console.error("Vapi error ->", error);
    };

    vapiRef.current.on("call-start", onCallStart);
    vapiRef.current.on("message", onMessage);
    vapiRef.current.on("call-end", onCallEnd);
    vapiRef.current.on("error", onError);

    return () => {
      vapiRef.current?.off("call-start", onCallStart);
      vapiRef.current?.off("message", onMessage);
      vapiRef.current?.off("call-end", onCallEnd);
      vapiRef.current?.off("error", onError);
      vapiRef.current?.stop();
    };
  }, []);

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
        console.log("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    }

    async function getDetails() {
      try {
        const supabase = await createClient();
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;
        const { data: job } = await supabase
          .from("job")
          .select("title,description")
          .eq("user_id", userId);
        const jobTitle = job?.[0]?.title || "Software Developer";
        setJobPosition(jobTitle);
      } catch (error) {
        console.log("Error fetching job details:", error);
        setJobPosition("Software Developer"); // fallback
      }
    }

    getQuestions();
    getDetails();
  }, []);

  const startInterview = () => {
    if (question && question.length > 0) {
      questToAI.current = "";
      (question as InterviewQuestion[]).forEach((part) => {
        // Make questions speech-friendly before adding to AI prompt
        const speechFriendlyQuestion = makeSpeechFriendly(part.question);
        questToAI.current += `${part.id}: ${speechFriendlyQuestion}\n`;
      });

      const assistantOptions = getAssistantOptions(questToAI.current);
      vapiRef.current?.start(assistantOptions);
    } else {
      alert("Questions are still loading. Please wait.");
    }
  };

  const endInterview = async () => {
    try {
      setAnalyzing(true);
      vapiRef.current?.stop();

      // Wait a moment for final messages to arrive
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // console.log("All messages:", messages);

      // Find the last message of type 'conversation-update'
      const lastConversationUpdate = messages.findLast(
        (message) => message.type === "conversation-update"
      );

      let finalConversation = [];
      if (lastConversationUpdate && lastConversationUpdate.conversation) {
        finalConversation = lastConversationUpdate.conversation;
      }

      // console.log("Final conversation to analyze:", finalConversation);

      if (finalConversation.length === 0) {
        console.warn("No conversation data found to analyze.");
        alert(
          "No conversation data found. Make sure you had a conversation before ending the interview."
        );
        return;
      }

      const res = await axios.post("/api/analysis", {
        conversation: finalConversation,
      });

      // console.log("Analysis response:", res.data);

      // Parse the response properly - handle unknown type
      let analysisData: any;
      const responseData = res.data as any;

      if (typeof responseData.text === "string") {
        // Extract JSON from the response text
        const jsonMatch = responseData.text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[1]);
        } else {
          // Try to parse the entire text as JSON
          try {
            analysisData = JSON.parse(responseData.text);
          } catch {
            console.error("Could not parse analysis response");
            analysisData = { error: "Failed to parse analysis" };
          }
        }
      } else {
        analysisData = responseData;
      }

      setAnalysisResult(analysisData);
    } catch (error) {
      console.error("Error sending conversation to analysis API:", error);
      alert("Failed to analyze the interview. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex gap-4">
        <button
          className={`px-6 py-3 rounded-lg font-medium ${
            loading || started
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
          }`}
          onClick={startInterview}
          disabled={loading || started}
        >
          {loading
            ? "Loading Questions..."
            : started
            ? "Interview in Progress"
            : "Start Interview"}
        </button>

        <button
          className={`px-6 py-3 rounded-lg font-medium ${
            !started || analyzing
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
          }`}
          onClick={endInterview}
          disabled={!started || analyzing}
        >
          {analyzing ? "Analyzing..." : "End Interview"}
        </button>
      </div>

      {/* Interview Status */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Interview Status</h3>
        <p
          className={`text-sm ${started ? "text-green-600" : "text-gray-500"}`}
        >
          {started ? "🟢 Interview in progress" : "⚪ Interview not started"}
        </p>
        {jobPosition && (
          <p className="text-sm text-gray-600">Position: {jobPosition}</p>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Interview Analysis</h3>

          {analysisResult.error ? (
            <p className="text-red-600">Error: {analysisResult.error}</p>
          ) : (
            <div className="space-y-3">
              <div>
                <strong>Technical Knowledge:</strong>
                <p className="text-gray-700">
                  {analysisResult.technicalKnowledge}
                </p>
              </div>

              <div>
                <strong>Problem Solving:</strong>
                <p className="text-gray-700">{analysisResult.problemSolving}</p>
              </div>

              <div>
                <strong>Communication:</strong>
                <p className="text-gray-700">{analysisResult.communication}</p>
              </div>

              <div>
                <strong>Response Time:</strong>
                <p className="text-gray-700">{analysisResult.responseTime}</p>
              </div>

              {analysisResult.strengths && (
                <div>
                  <strong>Strengths:</strong>
                  <ul className="list-disc list-inside text-gray-700">
                    {analysisResult.strengths.map(
                      (strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {analysisResult.improvements && (
                <div>
                  <strong>Areas for Improvement:</strong>
                  <ul className="list-disc list-inside text-gray-700">
                    {analysisResult.improvements.map(
                      (improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {analysisResult.finalRating && (
                <div>
                  <strong>Final Rating:</strong>
                  <p className="text-gray-700">
                    Score: {analysisResult.finalRating.score}/10
                  </p>
                  <p className="text-gray-700">
                    {analysisResult.finalRating.comment}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-medium mb-2">Debug Info</h4>
        <p className="text-sm text-gray-600">
          Messages received: {messages.length}
        </p>
        <p className="text-sm text-gray-600">
          Questions loaded: {question.length}
        </p>
      </div>
    </div>
  );
}
