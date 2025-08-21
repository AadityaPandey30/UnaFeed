import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import { dbConnect } from "@/lib/mongoose";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid id required" }, { status: 400 });
    }

    // Get deviceId from header first, fallback to cookie
    let deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      const cookieStore = await cookies();
      deviceId = cookieStore.get("deviceId")?.value || null;
    }
    if (!deviceId) {
      return NextResponse.json({ error: "No device session" }, { status: 401 });
    }

    const comment = await Comment.findById(id);
    if (!comment || comment.status === "deleted") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Simple ownership check (no full auth system)
    if (comment.deviceId !== deviceId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete the comment, keep thread integrity
    comment.status = "deleted";
    comment.isHidden = true;
    await comment.save();

    // Decrement comment count on parent post (prevent negatives)
    if (comment.postId) {
      await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete comment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
