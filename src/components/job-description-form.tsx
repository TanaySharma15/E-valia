"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { displayJSON, formatAIJSON } from "@/utils/format_AI_JSON";
import { createClient } from "@/utils/supabase/client";

interface ExtractedDetails {
  role: string;
  company: string;
  keySkills: string[];
  responsibilities: string[];
  requirements: string[];
}

export function JobDescriptionForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [skills, setSkills] = useState([]);
  const [responsiblity, setResponsiblity] = useState([]);
  const [required, setRequired] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedDetails, setExtractedDetails] =
    useState<ExtractedDetails | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const router = useRouter();

  const handleAISubmit = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTitle, companyName }),
      });
      const data = await res.json();
      const response = data.steps[0].response.messages[0].content[0].text;
      const formattedDescription = formatAIJSON(response); //formattedQuestion -> string
      const { jobSummary, responsibilities, requirements, benefits } =
        displayJSON(formattedDescription);
      setSkills(JSON.parse(formattedDescription).keySkills);
      setRequired(JSON.parse(formattedDescription).Requirements);
      setResponsiblity(JSON.parse(formattedDescription).Responsibilities);
      const description = `Job Summary \n\n ${jobSummary} \n\n Responsiblites \n\n ${responsibilities} \n\n Requirements \n\n ${requirements} \n\n Benifits \n\n ${benefits} `;
      setJobDescription(description);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtractDetails = async () => {
    if (!jobDescription.trim()) return;

    setIsExtracting(true);

    // Simulate extraction process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const extracted: ExtractedDetails = {
      role: jobTitle || "Software Developer",
      company: companyName || "Tech Company",
      keySkills: skills,
      responsibilities: responsiblity,
      requirements: required,
    };

    setExtractedDetails(extracted);
    setIsExtracting(false);
  };

  const handleStartInterview = async () => {
    // Store job details for the interview
    const jobData = {
      jobTitle,
      companyName,
      jobDescription,
      extractedDetails,
    };
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    await supabase
      .from("job")
      .insert([
        { user_id: userId, title: jobTitle, description: jobDescription },
      ]);
    localStorage.setItem("jobDetails", JSON.stringify(jobData));
    router.push("/interview-instructions");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Job Description Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="job-title">Select Job Title</Label>
            <Select value={jobTitle} onValueChange={setJobTitle}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a job title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend Developer">
                  Frontend Developer
                </SelectItem>
                <SelectItem value="Backend Developer">
                  Backend Developer
                </SelectItem>
                <SelectItem value="Full Stack Developer">
                  Full Stack Developer
                </SelectItem>
                <SelectItem value="Software Engineer">
                  Software Engineer
                </SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                <SelectItem value="UX Designer">UX Designer</SelectItem>
                <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-name">Enter Company Name (Optional)</Label>
            <Input
              id="company-name"
              placeholder="e.g., Google, Microsoft, Startup Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Enter Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here or use AI to generate one..."
              className="min-h-[200px] resize-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleAISubmit}
              disabled={!jobTitle || isGenerating}
              className={`flex-1 bg-transparent ${
                isGenerating ? "cursor-none" : "cursor-pointer"
              } ${isGenerating ? "pointer-events-none" : ""}`}
            >
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
            <Button
              onClick={handleExtractDetails}
              disabled={!jobDescription.trim() || isExtracting}
              className="flex-1"
            >
              {isExtracting ? "Extracting..." : "Extract Details"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Job Details */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Extracted Job Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {extractedDetails ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Role & Company
                </h4>
                <p className="text-muted-foreground">
                  {extractedDetails.role} at {extractedDetails.company}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Key Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {extractedDetails.keySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Key Responsibilities
                </h4>
                <ul className="space-y-1">
                  {extractedDetails.responsibilities.map(
                    (responsibility, index) => (
                      <li
                        key={index}
                        className="text-muted-foreground text-sm flex items-start"
                      >
                        <span className="text-primary mr-2">•</span>
                        {responsibility}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Requirements
                </h4>
                <ul className="space-y-1">
                  {extractedDetails.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground text-sm flex items-start"
                    >
                      <span className="text-primary mr-2">•</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={handleStartInterview}
                className="w-full"
                size="lg"
              >
                Start Interview
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">
                Enter a job description and click &quot;;Extract Details&quot;
                to see the analysis here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
