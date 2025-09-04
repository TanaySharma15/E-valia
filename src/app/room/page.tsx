import InterviewSession from "@/components/interview-session";
import { Navigation } from "@/components/Navigation";

export default function InterviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10">
        <InterviewSession />
      </main>
    </div>
  );
}
