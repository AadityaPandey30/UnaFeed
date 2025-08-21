import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // type should be "event", "lostfound", "announcement"
    if (!body.type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const newPost = await Post.create(body);

    return NextResponse.json(newPost, { status: 201 });
  } catch (err) {
    console.error("Post creation error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
