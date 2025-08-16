import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  generateText,
  streamText,
  type UIMessage,
} from "ai";

export async function GET() {
  // const result = await google.speechModel()
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
  const jobDescription = job?.[0].title;
  //   console.log("****Resume*****", resume);
  //   console.log("****jobDescription*****", jobDescription?.[0]);

  const systemPrompt: UIMessage[] = [
    {
      id: "sys-1",
      role: "user",
      parts: [
        {
          type: "text",
          text: `You are Sana, an interview expert at a big YC-backed startup. 
You are interviewing a candidate for the role of "${jobTitle}".
The resume JSON is: ${JSON.stringify(resume)} 
The job JSON is: ${JSON.stringify(job)}

### Important Instructions:
1. Use **real data directly** from the resume and job JSON. 
   - Example: If "name" is "Tanay Sharma", you must say "Hi Tanay Sharma", not "[Candidate Name]".
   - If "experience.company" is "Google", you must say "at Google", not "[Previous Company Name]".
2. Never leave placeholders like [Company Name], [Project Name], etc. — replace with actual values from the JSON.
3. Ask 10 **hard-level** real-life interview questions that can be answered over voice (not coding).
4. Output strictly in the JSON format below:

{
  "interview": [
    {
      "id": "greeting",
      "type": "introduction",
      "script": "Hi <candidate_name>, thanks for joining. I'm Sana, part of the engineering team at <company>. We're hiring for <jobTitle>..."
    },
    {
      "id": "resume-1",
      "Topic": "Project Experience",
      "question": "In your project <project_name>, you mentioned using <tech_stack>. Can you explain..."
    },
    {
      "id": "Q-1",
      "Topic": "Performance",
      "question": "..."
    }
  ]
}

5. Include 1-2 project-based questions and 1-2 experience-based questions directly tied to the resume JSON fields.
6. Maintain a conversational tone, like a real interview happening over voice.

Now generate the full JSON following this exact format.
`,
        },
      ],
    },
  ];
  const result = await generateText({
    model: google("gemini-2.0-flash"),
    messages: convertToModelMessages(systemPrompt),
  });
  return new Response(JSON.stringify(result));
}

// My Prompot: `You are an interview expert at a big YC Backed startup. You are about to interview an individual whose resume is ${resume} and the position for which he is applying is ${jobTitle} and description for the job is ${jobDescription}. You need  to generate 10 real life like problems based on the data they should be **hard level** and return it in json format. You need to ask questions that user can reply don't ask any  questions that he need to code also the format should be clear for example the format that you have to use will be like:
//             {
//                 {
//                 id:"Q-1",
//                 Topic:"Topic to which the question refers",
//                 question:"detailed questions"
//                 }
//             }
//             Also remeber that you need to ask question over voice not for now so ask questions that he can answer over voice.
//             Also first you should greet them and make them comfortable over the complete interview process and also ask question from their resume that I have provided. It should sound like you are hiring for a role and a candidate applied so you should asks like we need person for this role and yours skills are these. 1-2 question should be around his project. and some questions around his experience if he have some.
//             Since you have complete json data for resume and job description use data directly from there don't use things like this: '[Specific Project Name from Resume]'. Also you are Sana.
//           `
