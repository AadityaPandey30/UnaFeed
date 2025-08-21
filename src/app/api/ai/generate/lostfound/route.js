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
            "Return ONLY JSON: { mode: 'lost'|'found', itemName, description, lastSeenLocation, lastSeenAt }. " +
            "The lastSeenAt field MUST be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ). " +
            "Do NOT return fuzzy text like 'yesterday evening'.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content.trim();

    let lostfound;
    try {
      lostfound = JSON.parse(result);

      // Convert lastSeenAt to Date
      if (lostfound.lastSeenAt) lostfound.lastSeenAt = new Date(lostfound.lastSeenAt);

    } catch (parseErr) {
      console.error("Failed to parse AI JSON:", result);
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
    }

    return NextResponse.json({ lostfound });
  } catch (err) {
    console.error("LostFound generation error:", err);
    return NextResponse.json({ error: "Failed to generate lostfound post" }, { status: 500 });
  }
}
