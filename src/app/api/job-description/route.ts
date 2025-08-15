import { google } from "@ai-sdk/google";
import { convertToModelMessages, generateText, type UIMessage } from "ai";

export async function POST(req: Request) {
  const { jobTitle }: { jobTitle: UIMessage[] } = await req.json();
  const enhancedMessages: UIMessage[] = [
    {
      id: "system-msg-1",
      role: "system",
      parts: [
        {
          type: "text",
          text: `
         You are an HR manager. Generate a professional, detailed job description for the role "${jobTitle}". 
Include the following sections:
1. Job Summary - A short overview of the role.
2. Responsibilities - List 5-7 key tasks the employee will handle.
3. Requirements - List 5-7 qualifications or skills needed.
4. Benefits - Optional perks or advantages of working at the company.
Make the description clear, engaging, and suitable for publishing in a real job posting.
Do not include instructions or explanations; only output the job description.
        
          `,
        },
      ],
    },
    ...jobTitle,
  ];

  const result = await generateText({
    model: google("gemini-2.0-flash"),
    messages: convertToModelMessages(enhancedMessages),
  });
  const description = (
    result.steps[0].response.messages[0].content[0] as { text: string }
  ).text;
  // console.log(description);

  return new Response(JSON.stringify(result));
}
