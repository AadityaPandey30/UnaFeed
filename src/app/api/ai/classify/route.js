import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Classify the user input into:\n1 = Event\n2 = Lost & Found\n3 = Announcement\nRespond with ONLY the number.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 5,
      temperature: 0,
    });

    const type = completion.choices[0].message.content.trim();
    return NextResponse.json({ type });
  } catch (err) {
    console.error("Classifier error:", err);
    return NextResponse.json({ error: "Classification failed" }, { status: 500 });
  }
}
