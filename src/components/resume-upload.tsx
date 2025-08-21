"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function ResumeUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (
      file &&
      (file.type === "application/pdf" || file.name.endsWith(".pdf"))
    ) {
      setUploadedFile(file);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploadedFile(file);
      }
    },
    []
  );

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);

    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Store file info in localStorage for demo purposes
    localStorage.setItem(
      "uploadedResume",
      JSON.stringify({
        name: uploadedFile.name,
        size: uploadedFile.size,
        uploadedAt: new Date().toISOString(),
      })
    );

    setIsUploading(false);
    router.push("/job-description");
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                Drop your resume here
              </h3>
              <p className="text-muted-foreground mb-6">
                or click to browse your files
              </p>

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />

              <Button asChild className="mb-4">
                <label htmlFor="resume-upload" className="cursor-pointer">
                  Upload Resume
                </label>
              </Button>

              <p className="text-sm text-muted-foreground">
                Supports PDF files up to 10MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                Resume Uploaded Successfully
              </h3>

              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="font-medium text-foreground">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={removeFile}>
                  Upload Different File
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading
                    ? "Processing..."
                    : "Continue to Job Description"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Your resume is processed securely and never shared with third parties.
        </p>
      </div>
    </div>
  );
}
