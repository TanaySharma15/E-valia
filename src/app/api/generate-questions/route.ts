import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  generateText,
  streamText,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  // const result = await google.speechModel()
  try {
    const {
      userResponse,
      currentIndex,
      timeLeft,
    }: { userResponse: UIMessage[]; currentIndex: number; timeLeft: number } =
      await req.json();
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

    const lastPart = userResponse[userResponse.length - 1].parts[0];
    let lastUserText = "";
    if (lastPart.type === "text") {
      lastUserText = lastPart.text;
    }

    const systemPrompt: UIMessage[] = [
      {
        id: "sys-1",
        role: "system",
        parts: [
          {
            type: "text",
            text: `You are Sana, an expert interviewer. You are conducting an interview. The interview ends when time runs out.
The time left is ${timeLeft} seconds. 
If timeLeft is less than 60 seconds, ask only short wrap-up questions 
or thank the candidate and end politely.

You must ask questions in sequential order.
The last asked question was Q-${currentIndex}. 
Now you must generate Q-${
              currentIndex + 1
            }, considering the user's reply: "${lastUserText}. 
You are interviewing a candidate for the role of "${jobTitle}". 
The resume JSON is: ${JSON.stringify(resume)} 
The job JSON is: ${JSON.stringify(jobDescription)}

### Rules:
The most important rule is you should be very very polite. Since the person you are interviewing is practising for his interview that's why he came to you so be polite and if he can't answer anything or answers wrong handle with care. and one of the most important rule - In your JSON output, always escape newlines as \n inside strings. Never include raw line breaks in JSON values.Also if there is only one word that too you should return in JSON not plain text understood it is very important
1. Always extract details directly from the JSON.
   - If "name" = "Tanay Sharma", greet with "Hi Tanay Sharma".
   - If "projects" contains [{ "name": "RealTime Dashboard", "tech": "React, Node.js" }], you must ask: 
     "In your RealTime Dashboard project, you used React and Node.js. Can you explain the challenges you faced?"
   - If "experience" has [{ "company": "Google", "role": "SDE Intern" }], you must ask: 
     "During your time at Google as an SDE Intern, what was your biggest technical challenge?"
2. Never ask the candidate to "walk me through your resume".
3. Never leave placeholders like [Project Name]. Always substitute real values.
4. Only output JSON in this shape:
{
  "id": "Q-1",
  "type": "question",
  "topic": "Project Experience | Skills | System Design | ...",
  "question": "Your actual question with real values from resume/job JSON"
}
5. First turn = greeting with candidate's name + job title. 
Second turn onward = one question at a time, using actual resume/job JSON and questions should be tough enough.
***And after the meeting has ended or if the user said that I don't want to continue you just wish them goodbye and don't answer any question after that *NOT A SINGLE ANSWER*. The meeting will be over then and there.Also if there is only one word that too you should return in JSON not plain text understood it is very important like Goodbye also you should return in JSON. After goodbye or saying bye if user asks anything you should NOt reply. NO MEANS NO ***
`,
          },
        ],
      },
      ...userResponse,
    ];

    const result = await generateText({
      model: google("gemini-1.5-flash"),
      messages: convertToModelMessages(systemPrompt),
    });
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
}
