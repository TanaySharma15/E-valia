import { JobDescriptionForm } from "@/components/job-description-form";
import { Navigation } from "@/components/Navigation";

export default function JobDescriptionPage() {
  return (
    <div className="min-h-screen bg-background mt-10">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Job Description
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Provide the job description you're applying for, or let our AI
            generate relevant interview questions based on your role.
          </p>
        </div>

        <JobDescriptionForm />
      </main>
    </div>
  );
}
