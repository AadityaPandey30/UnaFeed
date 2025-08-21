import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // keep your key in .env.local
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Ask model to strictly classify into 1, 2, or 3
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // lightweight, fast, hackathon-friendly
      messages: [
        {
          role: "system",
          content:
            "You are a classifier. Classify the user input into one of these categories:\n" +
            "1 = Event (workshops, fests, club activities)\n" +
            "2 = Lost & Found (lost or found items)\n" +
            "3 = Announcement (official notices, timetables, campus-wide updates)\n" +
            "Respond with ONLY the number (1, 2, or 3). Nothing else.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 5,
      temperature: 0,
    });

    const result = completion.choices[0].message.content.trim();

    return NextResponse.json({ type: result });
  } catch (err) {
    console.error("Classifier API Error:", err);
    return NextResponse.json(
      { error: "Failed to classify prompt" },
      { status: 500 }
    );
  }
}
