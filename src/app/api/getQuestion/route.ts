import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    const { data: resume } = await supabase
      .from("resume")
      .select("data")
      .eq("user_id", userId)
      .maybeSingle();
    const { data: job } = await supabase
      .from("job")
      .select("title,description")
      .eq("user_id", userId);
    const jobTitle = job?.[0].title;
    const jobDescription = job?.[0].description;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const systemPrompt = `
You are Sana, an expert interviewer. 
You are interviewing a candidate for the role of "${jobTitle}".
The candidate's resume is: ${JSON.stringify(resume)} 
The job description is: ${JSON.stringify(jobDescription)}

### Task:
Generate **8-10 tough interview questions at once** in JSON format, based on the candidate's resume and job description. 
Each question should be very specific to the candidate's profile (projects, skills, experiences).

### Rules:
1. Be polite, encouraging, but challenging.
2. Never use placeholders like [Project Name]. Always substitute with actual values.
3. Never ask "Walk me through your resume".
4. Format output as an array of JSON objects in this exact shape:

[
  {
    "id": "Q-1",
    "type": "question",
    "topic": "Project Experience | Skills | System Design | ...",
    "question": "Your actual question with real values from resume/job JSON"
  }
]
    `;

    const result = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: systemPrompt,
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: String(error),
      }),
      { status: 500 }
    );
  }
}
