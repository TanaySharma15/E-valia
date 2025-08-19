"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JobDetails() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if resume was uploaded
    if (!localStorage.getItem("resumeUploaded")) {
      router.push("/");
    }
  }, [router]);

  const generateJobDescription = async () => {
    if (!jobTitle.trim()) {
      alert("Please enter a job title first");
      return;
    }

    setGenerating(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const sampleDescription = `We are seeking a talented ${jobTitle} to join our dynamic team. The ideal candidate will have strong technical skills, excellent problem-solving abilities, and experience in relevant technologies. 

Key Responsibilities:
• Lead technical projects and collaborate with cross-functional teams
• Design and implement scalable solutions
• Mentor junior team members and contribute to team growth
• Stay updated with industry trends and best practices

Requirements:
• Bachelor's degree in relevant field or equivalent experience
• 3+ years of experience in related role
• Strong communication and leadership skills
• Proficiency in relevant programming languages and tools
• Experience with agile development methodologies

We offer competitive compensation, comprehensive benefits, and opportunities for professional growth in a collaborative environment.`;

    setJobDescription(sampleDescription);
    setGenerating(false);
  };

  const handleStartInterview = () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      alert("Please fill in both job title and description");
      return;
    }

    // Store job details for the interview
    localStorage.setItem("jobTitle", jobTitle);
    localStorage.setItem("jobDescription", jobDescription);

    router.push("/Interview-page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Job Details
            </h1>
            <p className="text-lg text-gray-600">
              Provide the job information for your interview practice
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Title Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Resume Uploaded
                  </h3>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-blue-800 font-medium">
                      {localStorage.getItem("resumeName") || "resume.pdf"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Description Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Job Description *
                    </label>
                    <button
                      onClick={generateJobDescription}
                      disabled={generating || !jobTitle.trim()}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {generating ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-3 w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        "✨ Generate with AI"
                      )}
                    </button>
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors h-64 resize-none"
                    placeholder="Paste the job description here or generate one using AI..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleStartInterview}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Start Interview Practice
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
