import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const resumeSchema = z.object({
  name: z.string(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({ company: z.string(), role: z.string(), years: z.number() }),
  ),
  education: z.array(z.string()),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json(
      { success: false, message: "No file uploaded" },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const { object: data } = await generateObject({
    model: google("gemini-3.6-flash"),
    schema: resumeSchema,
    system:
      "You are a resume parser. Extract structured details from the resume. If data is missing, leave fields empty. Do not add commentary.",
    messages: [
      {
        role: "user",
        content: [
          { type: "file", data: base64, mediaType: "application/pdf" },
          { type: "text", text: "Extract the resume details." },
        ],
      },
    ],
  });

  const { error } = await supabase
    .from("resume")
    .insert([{ user_id: userId, data }]);

  if (error) {
    console.log("Error while inserting to db", error);
    return Response.json(
      { success: false, message: "Error while inserting resume to db", error },
      { status: 500 },
    );
  }

  return Response.json(
    { success: true, message: "Resume saved successfully" },
    { status: 200 },
  );
}
