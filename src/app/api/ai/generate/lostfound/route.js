import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator. Extract lost or found item details. " +
            "Return ONLY JSON: { mode: 'lost'|'found', itemName, description, lastSeenLocation, lastSeenAt }.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content.trim();

    return NextResponse.json({ lostfound: JSON.parse(result) });
  } catch (err) {
    console.error("LostFound generation error:", err);
    return NextResponse.json({ error: "Failed to generate lostfound post" }, { status: 500 });
  }
}
