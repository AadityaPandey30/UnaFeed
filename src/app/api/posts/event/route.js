import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose"; // correct import
import Post from "@/models/Post";

export async function GET(req) {
  await dbConnect(); // correct function
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const filter = { type: "event", status: "active" };
    const events = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    return NextResponse.json({
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
