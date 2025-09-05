"use client";
import Vapi from "@vapi-ai/web";
import axios from "axios";
import { InterviewQuestion } from "@/types/question";
import { formatQuestion } from "@/utils/formatQuestions";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "./Loader";

// Type definitions
interface VapiMessage {
  type: string;
  conversation?: ConversationMessage[];
  [key: string]: unknown;
}

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

interface AnalysisResult {
  technicalKnowledge: string;
  problemSolving: string;
  communication: string;
  responseTime: string;
  strengths?: string[];
  improvements?: string[];
  finalRating?: {
    score: number;
    comment: string;
  };
  error?: string;
}

interface JobDetails {
  title: string;
  description: string;
}

interface AnalysisApiResponse {
  text?: string;
  data?: AnalysisResult;
}

export default function InterviewSession() {
  const vapiRef = useRef<Vapi | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion[]>([]);
  const [messages, setMessages] = useState<VapiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const router = useRouter();
  const questToAI = useRef("");
  const [isInterviewStarting, setIsInterviewStarting] = useState(false);

  // Helper function to make text more speech-friendly
  const makeSpeechFriendly = (text: string): string => {
    return text
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
      .replace(/\?/g, "? ")
      .replace(/\./g, ". ")
      .replace(/!/g, "! ")
      .replace(/\s+/g, " ")
      .trim();
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

  // Time tracking effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (started) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    }

    const onCallStart = (): void => {
      console.log("Call started");
      setStarted(true);
      setIsAISpeaking(true);
    };

    const onMessage = (message: VapiMessage): void => {
      console.log("Message received:", message);
      setMessages((prev) => [...prev, message]);

      // Track AI speaking status based on message types
      if (message.type === "speech-start") {
        setIsAISpeaking(true);
      } else if (message.type === "speech-end") {
        setIsAISpeaking(false);
      }
    };

    const onCallEnd = (): void => {
      console.log("Call ended");
      setStarted(false);
      setIsAISpeaking(false);
    };

    const onError = (error: Error): void => {
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
    async function getQuestions(): Promise<void> {
      try {
        setLoading(true);
        const res = await fetch("/api/getQuestion", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        const response = data.steps[0].response.messages[0].content[0].text;
        const formatted = formatQuestion(response);
        const array = JSON.parse(formatted) as InterviewQuestion[];
        setQuestion(array);
      } catch (error) {
        console.log("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    }

    async function getDetails(): Promise<void> {
      try {
        const supabase = await createClient();
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;
        const { data: job } = await supabase
          .from("job")
          .select("title,description")
          .eq("user_id", userId);

        const jobData = job as JobDetails[] | null;
        const jobTitle = jobData?.[0]?.title || "Software Developer";
        setJobPosition(jobTitle);
      } catch (error) {
        console.log("Error fetching job details:", error);
        setJobPosition("Software Developer");
      }
    }

    getQuestions();
    getDetails();
  }, []);

  const startInterview = (): void => {
    try {
      setIsInterviewStarting(true);
      if (question && question.length > 0) {
        questToAI.current = "";
        question.forEach((part) => {
          const speechFriendlyQuestion = makeSpeechFriendly(part.question);
          questToAI.current += `${part.id}: ${speechFriendlyQuestion}\n`;
        });

        const assistantOptions = getAssistantOptions(questToAI.current);
        vapiRef.current?.start(assistantOptions);
      } else {
        alert("Questions are still loading. Please wait.");
      }
    } catch (error) {
      console.log(error);
      alert("Error");
    } finally {
      setIsInterviewStarting(false);
    }
  };

  const endInterview = async (): Promise<void> => {
    try {
      setAnalyzing(true);
      vapiRef.current?.stop();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const lastConversationUpdate = messages.findLast(
        (message) => message.type === "conversation-update"
      );

      let finalConversation: ConversationMessage[] = [];
      if (lastConversationUpdate && lastConversationUpdate.conversation) {
        finalConversation = lastConversationUpdate.conversation;
      }

      if (finalConversation.length === 0) {
        console.warn("No conversation data found to analyze.");
        alert(
          "No conversation data found. Make sure you had a conversation before ending the interview."
        );
        return;
      }

      const res = await axios.post<AnalysisApiResponse>("/api/analysis", {
        conversation: finalConversation,
      });

      let analysisData: AnalysisResult;
      const responseData = res.data;

      if (typeof responseData.text === "string") {
        const jsonMatch = responseData.text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[1]) as AnalysisResult;
        } else {
          try {
            analysisData = JSON.parse(responseData.text) as AnalysisResult;
          } catch {
            console.error("Could not parse analysis response");
            analysisData = {
              error: "Failed to parse analysis",
              technicalKnowledge: "",
              problemSolving: "",
              communication: "",
              responseTime: "",
            };
          }
        }
      } else {
        analysisData = responseData as AnalysisResult;
      }

      setAnalysisResult(analysisData);
    } catch (error) {
      console.error("Error sending conversation to analysis API:", error);
      alert("Failed to analyze the interview. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Pre-interview screen
  if (analyzing) {
    return (
      <div className="w-full h-full">
        <Loader />
      </div>
    );
  }
  if (!started && !analysisResult) {
    return (
      <div className="max-w-2xl mx-auto text-center ">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Ready to Start?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {jobPosition || "Loading..."}
              </Badge>
              <p className="text-muted-foreground">
                Your mock interview is ready to begin. You&apos;ll be asked{" "}
                {question.length} questions covering various aspects of the
                role.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">
                Interview Structure
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Introduction and background questions</li>
                <li>• Technical experience and skills</li>
                <li>• Behavioral and situational questions</li>
                <li>• Role-specific inquiries</li>
              </ul>
            </div>

            <Button
              onClick={startInterview}
              size="lg"
              className={`w-full ${
                isInterviewStarting
                  ? "pointer-events-none"
                  : "pointer-events-auto"
              }`}
              disabled={loading || question.length === 0}
            >
              {loading ? "Loading Questions..." : "Start Interview"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main interview interface
  if (started && !analysisResult) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {jobPosition}
            </Badge>
            <div className="text-muted-foreground">Interview in Progress</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-lg font-mono text-foreground">
              {formatTime(timeElapsed)}
            </div>
            <Button
              variant="outline"
              onClick={endInterview}
              size="sm"
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "End Interview"}
            </Button>
          </div>
        </div>

        {/* Main Interview Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current Status Panel */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Interview Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Status:</span>
                  <Badge variant={started ? "default" : "secondary"}>
                    {started ? "🟢 Active" : "⚪ Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Questions Loaded:</span>
                  <Badge variant="outline">{question.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Messages:</span>
                  <Badge variant="outline">{messages.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Speaking Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Speaking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Status */}
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isAISpeaking ? "bg-primary animate-pulse" : "bg-muted"
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">AI Interviewer</p>
                  <p className="text-sm text-muted-foreground">
                    {isAISpeaking ? "Speaking..." : "Listening"}
                  </p>
                </div>
              </div>

              {/* User Status */}
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    started && !isAISpeaking ? "bg-green-500" : "bg-muted"
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">You</p>
                  <p className="text-sm text-muted-foreground">
                    {started && !isAISpeaking
                      ? "Ready to respond"
                      : "Waiting..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Interview in Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {formatTime(timeElapsed)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 animate-pulse"
                style={{ width: "100%" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (analyzing) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  // Analysis results screen
  if (analysisResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">
              Interview Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisResult.error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                Error: {analysisResult.error}
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Technical Knowledge */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Technical Knowledge
                  </h3>
                  <p className="text-muted-foreground">
                    {analysisResult.technicalKnowledge}
                  </p>
                </div>

                {/* Problem Solving */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Problem Solving
                  </h3>
                  <p className="text-muted-foreground">
                    {analysisResult.problemSolving}
                  </p>
                </div>

                {/* Communication */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Communication
                  </h3>
                  <p className="text-muted-foreground">
                    {analysisResult.communication}
                  </p>
                </div>

                {/* Response Time */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Response Time
                  </h3>
                  <p className="text-muted-foreground">
                    {analysisResult.responseTime}
                  </p>
                </div>

                {/* Strengths and Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  {analysisResult.strengths && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Strengths
                      </h3>
                      <ul className="space-y-1">
                        {analysisResult.strengths.map(
                          (strength: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-green-500 mt-1">•</span>
                              <span className="text-muted-foreground">
                                {strength}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {analysisResult.improvements && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-1">
                        {analysisResult.improvements.map(
                          (improvement: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <span className="text-orange-500 mt-1">•</span>
                              <span className="text-muted-foreground">
                                {improvement}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Final Rating */}
                {analysisResult.finalRating && (
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          Final Rating
                        </h3>
                        <div className="text-3xl font-bold text-primary">
                          {analysisResult.finalRating.score}/10
                        </div>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                          {analysisResult.finalRating.comment}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            Take Another Interview
          </Button>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
