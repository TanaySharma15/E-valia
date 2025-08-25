import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  generateText,
  streamText,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  const { messages }: { messages: UIMessage[] } = await req.json();
  const enhancedMessages: UIMessage[] = [
    {
      id: "system-msg-1",
      role: "system",
      parts: [
        {
          type: "text",
          text: `
            You are a resume parser.
            Always output valid JSON in the following format:
            {
              "name": string,
              "skills": string[],
              "experience": [{ "company": string, "role": string, "years": number }],
              "education": string[]
            }
            If data is missing, leave fields empty.
            Do not add commentary or explanations.
          `,
        },
      ],
    },
    ...messages,
  ];

  const result = await generateText({
    model: google("gemini-1.5-flash"),
    messages: convertToModelMessages(enhancedMessages),
  });
  const textOutput =
    result.steps?.[0]?.content
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("")
      .replace("```json", "")
      .replace("```", "") || "";
  // console.log("Result from gemini->  ", textOutput);
  const data = JSON.parse(textOutput);
  // console.log(data.name);

  const { error } = await supabase
    .from("resume")
    .insert([{ user_id: userId, data: data }]);
  if (error) {
    console.log("Error while inserting to db", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error while inserting resume to db",
        error,
      }),
      { status: 500 }
    );
  }
  return new Response(
    JSON.stringify({
      success: true,
      message: "Resume saved successfully",
    }),
    { status: 200 }
  );
}
