import { NextRequest, NextResponse } from "next/server";
import textToSpeech, { protos } from "@google-cloud/text-to-speech";

// Create TTS client (using service account credentials)
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to JSON key file
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Properly typed request
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text },
        voice: {
          languageCode: "en-US",
          ssmlGender:
            protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
        },
        audioConfig: {
          audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        },
      };

    // Call Google TTS API
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      return NextResponse.json(
        { error: "No audio generated" },
        { status: 500 }
      );
    }

    // Return Base64 audio
    return NextResponse.json({
      audioContent: response.audioContent.toString("base64"),
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
