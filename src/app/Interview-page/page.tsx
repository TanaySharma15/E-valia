"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Interview() {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(0);
  const [jobTitle, setJobTitle] = useState("");
  const router = useRouter();

  const questions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "What are your greatest strengths?",
    "Describe a challenging project you've worked on.",
    "Where do you see yourself in 5 years?",
    "Do you have any questions for us?",
  ];

  useEffect(() => {
    // Check if job details exist
    const storedJobTitle = localStorage.getItem("jobTitle");
    if (!storedJobTitle) {
      router.push("/job-details");
      return;
    }
    setJobTitle(storedJobTitle);

    let interval: NodeJS.Timeout;
    if (isInterviewActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive, router]);

  const startInterview = () => {
    setIsInterviewActive(true);
    setTimer(0);
    setCurrentQuestion(0);
    // Simulate starting voice chat
    setIsRecording(true);
  };

  const endInterview = () => {
    setIsInterviewActive(false);
    setIsRecording(false);

    // Save interview data
    const interviewData = {
      id: Date.now(),
      jobTitle,
      date: new Date().toISOString(),
      duration: timer,
      questionsAsked: currentQuestion + 1,
      totalQuestions: questions.length,
    };

    const interviews = JSON.parse(localStorage.getItem("interviews") || "[]");
    interviews.push(interviewData);
    localStorage.setItem("interviews", JSON.stringify(interviews));
    localStorage.setItem("currentInterview", JSON.stringify(interviewData));

    router.push("/analysis");
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              AI Interview
            </h1>
            <p className="text-lg text-gray-600">Position: {jobTitle}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isInterviewActive
                        ? "bg-red-400 animate-pulse"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-lg font-medium">
                    {isInterviewActive ? "Interview Active" : "Interview Ready"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono">{formatTime(timer)}</div>
                  <div className="text-sm opacity-75">Duration</div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
              {!isInterviewActive ? (
                /* Pre-Interview */
                <div className="text-center space-y-8">
                  <div className="bg-blue-50 p-8 rounded-xl">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                      Ready to Start?
                    </h2>
                    <p className="text-blue-700 mb-6">
                      Your AI interviewer is ready to conduct a mock interview.
                      Make sure your microphone is working and you're in a quiet
                      environment.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl mb-2">📝</div>
                        <div className="font-medium">Resume Analyzed</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="font-medium">Job Matched</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-2xl mb-2">🎤</div>
                        <div className="font-medium">Voice Ready</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={startInterview}
                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <svg
                      className="mr-3 h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Start Interview
                  </button>
                </div>
              ) : (
                /* Active Interview */
                <div className="space-y-8">
                  {/* Current Question */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-medium text-indigo-600">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={previousQuestion}
                          disabled={currentQuestion === 0}
                          className="p-2 rounded-lg bg-white shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={nextQuestion}
                          disabled={currentQuestion === questions.length - 1}
                          className="p-2 rounded-lg bg-white shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {questions[currentQuestion]}
                    </h3>
                  </div>

                  {/* Voice Interface */}
                  <div className="bg-gray-50 p-8 rounded-xl text-center">
                    <div className="mb-6">
                      <div
                        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                          isRecording
                            ? "bg-red-500 animate-pulse"
                            : "bg-gray-300"
                        }`}
                      >
                        <svg
                          className="w-12 h-12 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 mb-4">
                      {isRecording
                        ? "Listening to your response..."
                        : "Click to speak"}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          isRecording
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </button>
                    </div>
                  </div>

                  {/* End Interview */}
                  <div className="text-center">
                    <button
                      onClick={endInterview}
                      className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      End Interview
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
