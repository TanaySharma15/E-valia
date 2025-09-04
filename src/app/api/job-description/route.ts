import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { jobTitle, companyName }: { jobTitle: string; companyName: string } =
    await req.json();

  const prompt = `
         You are an HR manager. Generate a professional, detailed job description for the role "${jobTitle} at ${companyName}". 
Include the following sections:
1. Job Summary - A short overview of the role.
2. Responsibilities - List 5-7 key tasks the employee will handle.
3. Requirements - List 5-7 qualifications or skills needed.
4. Benefits - Optional perks or advantages of working at the company.
5. Key Skills- 4-5 Skills that are needed for the candidate during the interview or on his work
Make the description clear, engaging, and suitable for publishing in a real job posting.
Do not include instructions or explanations; only output the job description.

Also you should give the output in json format like ->
{
  jobSummary:["abc","xyz"],
  Responsibilities:["abc ","xyz"],
  Requirements:["abc","xyz"],
  Benifits:["abc","xyz"],
  keySkills:["React","node.js","nextjs"]
}

`;

  const result = await generateText({
    model: google("gemini-1.5-flash"),
    prompt: prompt,
  });
  // const description = (
  //   result.steps[0].response.messages[0].content[0] as { text: string }
  // ).text;
  // console.log(description);
  return new Response(JSON.stringify(result));
}
