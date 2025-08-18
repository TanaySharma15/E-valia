import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("VAPI_API_KEY:", process.env.VAPI_API_KEY);
    const response = await fetch("https://api.vapi.ai/v1/auth/token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error creating Vapi token:", err);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
