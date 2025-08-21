import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose"; // make sure path is correct
import Post from "@/models/Post";
import { Types } from "mongoose";

// GET /api/posts/announcement/[id]
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    const announcement = await Post.findOne({ _id: id, type: "announcement" });

    if (!announcement) {
      return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: announcement }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
