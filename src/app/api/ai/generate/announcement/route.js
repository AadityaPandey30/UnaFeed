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
            "You are a strict JSON generator. Extract announcement details. " +
            "Return ONLY JSON with the following fields: " +
            "{ department, title, description, date }. " +
            "The date MUST be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ). " +
            "Do NOT return any fuzzy text like 'yesterday' or 'tomorrow'.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content.trim();

    // Parse JSON safely
    let announcement;
    try {
      announcement = JSON.parse(result);
    } catch (parseErr) {
      console.error("Failed to parse AI JSON:", result);
      return NextResponse.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json({ announcement });
  } catch (err) {
    console.error("Announcement generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate announcement post" },
      { status: 500 }
    );
  }
}
