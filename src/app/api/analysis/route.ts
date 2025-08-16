import { google } from "@ai-sdk/google";
import { convertToModelMessages, generateText, UIMessage } from "ai";

export async function POST(req: Request) {
  const { interviewChat }: { interviewChat: UIMessage[] } = await req.json();
  const systemPrompt: UIMessage[] = [
    {
      id: "sys-1",
      role: "system",
      parts: [
        {
          type: "text",
          text: `You are an expert technical interviewer and evaluator.
Your task is to carefully analyze the full interview transcript between the interviewer (AI) and the candidate (user). 
Provide structured, objective feedback for the candidate on the following parameters:

1. **Technical Knowledge** - Accuracy and depth of technical answers.  
2. **Problem-Solving & Reasoning** - How well they explain their approach to solving challenges.  
3. **Communication Clarity** - How clear, concise, and professional their responses are.  
4. **Response Time & Confidence** - Does the candidate respond quickly and with confidence, or do they hesitate and give incomplete answers?  
5. **Strengths Highlighted** - Areas where the candidate performed particularly well.  
6. **Areas for Improvement** - Weak spots in their answers, and how they can improve.  
7. **Final Rating** - Give a rating out of 10 with a short justification.  

Return the analysis in **JSON format** like this:

\`\`\`json
{
  "technicalKnowledge": "...",
  "problemSolving": "...",
  "communication": "...",
  "responseTime": "...",
  "strengths": ["..."],
  "improvements": ["..."],
  "finalRating": {
    "score": 7.5,
    "comment": "Good technical knowledge but needs more concise communication."
  }
}
\`\`\`
`,
        },
      ],
    },
  ];

  const result = await generateText({
    model: google("gemini-1.5-flash"),
    messages: convertToModelMessages([...systemPrompt, ...interviewChat]),
  });
  return new Response(JSON.stringify(result));
}
