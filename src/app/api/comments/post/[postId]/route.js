export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import mongooseModule from '../../../../../lib/mongoose';
import Comment from '../../../../../models/Comment';

const { dbConnect } = mongooseModule;

export async function GET(request, context) {
  try {
    await dbConnect();
    const { postId } = await context.params;
    if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
    }

    const comments = await Comment.find({ postId, status: 'active' })
      .sort({ path: 1, createdAt: 1 })
      .lean();

    const idToNode = new Map();
    const roots = [];
    for (const c of comments) {
      const node = { ...c, replies: [] };
      idToNode.set(String(c._id), node);
    }
    for (const c of comments) {
      const node = idToNode.get(String(c._id));
      if (c.parentId) {
        const parentNode = idToNode.get(String(c.parentId));
        if (parentNode) parentNode.replies.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    }

    return NextResponse.json({ success: true, comments: roots });
  } catch (err) {
    console.error('Fetch comments error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


