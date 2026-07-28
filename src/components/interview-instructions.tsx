"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function InterviewInstructions() {
  const router = useRouter();

  const handleStartInterview = () => {
    router.push("/room");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Interview Instructions
        </h1>
        <p className="text-lg text-muted-foreground">
          Please read the following instructions carefully before starting your
          mock interview.
        </p>
      </div>

      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Before You Begin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary-foreground text-sm font-bold">
                  1
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Find a Quiet Space
                </h4>
                <p className="text-muted-foreground text-sm">
                  Choose a quiet environment where you won&apos;t be interrupted
                  during the interview.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary-foreground text-sm font-bold">
                  2
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Check Your Audio
                </h4>
                <p className="text-muted-foreground text-sm">
                  Ensure your microphone is working properly and you can speak
                  clearly.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary-foreground text-sm font-bold">
                  3
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Be Natural</h4>
                <p className="text-muted-foreground text-sm">
                  Treat this as a real interview. Speak naturally and take your
                  time to think before answering.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary-foreground text-sm font-bold">
                  4
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Stay Focused</h4>
                <p className="text-muted-foreground text-sm">
                  The interview will last approximately 15-20 minutes with 5-7
                  questions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">What to Expect</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span>
                Questions will be tailored to your resume and the job
                description
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span>
                You&apos;ll receive real-time feedback on your speaking pace and
                clarity
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span>
                The AI interviewer will ask follow-up questions based on your
                responses
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span>
                After completion, you&apos;ll receive detailed analysis and
                improvement suggestions
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={handleStartInterview} size="lg" className="px-8">
          Start Interview
        </Button>
      </div>
    </div>
  );
}
