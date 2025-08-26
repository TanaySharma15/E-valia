import { InterviewInstructions } from "@/components/interview-instructions";
import { Navigation } from "@/components/navigation";

export default function InterviewInstructionsPage() {
  return (
    <div className="min-h-screen bg-background mt-10 mb-10">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <InterviewInstructions />
      </main>
    </div>
  );
}
