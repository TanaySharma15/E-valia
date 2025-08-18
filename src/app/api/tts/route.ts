// app/api/tts/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // Request WAV audio
  const response = await groq.audio.speech.create({
    model: "playai-tts",
    input: text,
    voice: "Fritz-PlayAI",
    response_format: "wav",
  });

  // Convert ArrayBuffer to base64
  const arrayBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString("base64");

  return NextResponse.json({ audio: base64Audio });
}
