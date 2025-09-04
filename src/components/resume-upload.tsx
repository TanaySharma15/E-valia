"use client";

import type React from "react";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { convertFileToUrl } from "@/utils/Convert_File";
import { toast } from "sonner";

export function ResumeUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();
  const [files, setFiles] = useState<FileList | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/resume",
    }),
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const fileParts =
        files && files.length > 0 ? await convertFileToUrl(files) : [];
      try {
        await sendMessage({
          role: "user",
          parts: [{ type: "text", text: input }, ...fileParts],
        });

        toast("Resume uploaded successfully");
      } catch (error) {
        toast("Error while uploading resume");
      }

      setFiles(undefined);
      setInput("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      router.push("/job");
    }
  };

  const removeFile = () => {
    setFiles(undefined);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          {!files ? (
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
                onChange={(event) => {
                  if (event.target.files) {
                    setFiles(event.target.files);
                  }
                }}
                ref={fileInputRef}
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
                      {files && files.length > 0 && (
                        <p className="font-medium text-foreground">
                          {Array.from(files)
                            .map((file) => file.name)
                            .join(", ")}
                        </p>
                      )}
                      {files && files.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {Array.from(files)
                            .map((file) => Math.ceil(file.size / 1024))
                            .join(",")}{" "}
                          kB
                        </p>
                      )}
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
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Processing..." : "Continue to Job Description"}
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
