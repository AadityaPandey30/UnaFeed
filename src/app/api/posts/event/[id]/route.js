import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose"; // or your correct path
import Post from "@/models/Post";

// GET /api/posts/event/[id]
export async function GET(req, { params }) {
  await dbConnect();
  try {
    const post = await Post.findOne({ _id: params.id, type: "event" });
    if (!post) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
