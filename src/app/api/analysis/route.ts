import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { conversation }: { conversation: any[] } = await req.json();
    // console.log("Received conversation:", conversation);

    if (
      !conversation ||
      !Array.isArray(conversation) ||
      conversation.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "No interview chat provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Filter out system messages and format the conversation
    const relevantMessages = conversation.filter(
      (msg) => msg.role === "user" || msg.role === "assistant"
    );

    if (relevantMessages.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No user or assistant messages found in conversation",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create a readable conversation transcript
    const conversationTranscript = relevantMessages
      .map((msg, index) => {
        const speaker = msg.role === "assistant" ? "Interviewer" : "Candidate";
        return `${speaker}: ${msg.content}`;
      })
      .join("\n\n");

    // console.log("Formatted conversation transcript:", conversationTranscript);

    const systemPrompt = `You are an expert technical interviewer and evaluator.
Your task is to carefully analyze the full interview transcript between the interviewer (AI) and the candidate (user). 

Here is the interview transcript:
${conversationTranscript}

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

Make sure to return valid JSON within the code block.`;

    const result = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: systemPrompt,
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    // console.log("AI Analysis result:", result.text);

    return new Response(
      JSON.stringify({
        success: true,
        text: result.text,
        usage: result.usage,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analysis API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze interview",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
