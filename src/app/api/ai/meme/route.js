import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Create a funny meme image: ${prompt}`,
      size: "1024x1024"
    });

    if (!response.data || !response.data[0]?.b64_json) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 });
    }

    // Convert base64 to data URL
    const imageBase64 = response.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (err) {
    console.error("Meme generation error:", err);
    return NextResponse.json({ error: "Failed to generate meme" }, { status: 500 });
  }
}
