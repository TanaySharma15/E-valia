import { Navigation } from "@/components/Navigation";
import { ResumeUpload } from "@/components/resume-upload";

export default function UploadResumePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 mt-10">
            Upload Your Resume
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume so our AI can analyze your skills and experience
            to create personalized interview questions.
          </p>
        </div>

        <ResumeUpload />
      </main>
    </div>
  );
}
