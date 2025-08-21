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
            "You are a strict JSON generator. Extract event details from user input. " +
            "Return ONLY valid JSON with fields: { title, description, location, date, startAt, endAt }. " +
            "All date fields MUST be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ). " +
            "Do NOT return fuzzy text like 'tomorrow evening' or 'next Friday'.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content.trim();

    let event;
    try {
      event = JSON.parse(result);

      // Convert to Date objects
      ['date', 'startAt', 'endAt'].forEach((field) => {
        if (event[field]) event[field] = new Date(event[field]);
      });

    } catch (parseErr) {
      console.error("Failed to parse AI JSON:", result);
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
    }

    return NextResponse.json({ event });
  } catch (err) {
    console.error("Event generation error:", err);
    return NextResponse.json({ error: "Failed to generate event post" }, { status: 500 });
  }
}
