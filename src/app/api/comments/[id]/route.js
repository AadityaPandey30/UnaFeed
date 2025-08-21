export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import mongooseModule from '../../../../lib/mongoose';
import Comment from '../../../../models/Comment';
import Post from '../../../../models/Post';

const { dbConnect } = mongooseModule;

export async function DELETE(request, context) {
  try {
    await dbConnect();
    const { params } = await context;
    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const headerDeviceId = request.headers.get('x-device-id');
    let deviceId = headerDeviceId || null;
    if (!deviceId) {
      const cookieStore = await cookies();
      deviceId = cookieStore.get('deviceId')?.value || null;
    }
    if (!deviceId) return NextResponse.json({ error: 'No device session' }, { status: 401 });

    const comment = await Comment.findById(id);
    if (!comment || comment.status === 'deleted') return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Simple ownership check via deviceId (no full auth)
    if (comment.deviceId !== deviceId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete the comment; keep thread integrity
    comment.status = 'deleted';
    comment.isHidden = true;
    await comment.save();

    // decrement post commentCount (guard against negatives)
    if (comment.postId) {
      await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } }).lean();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete comment error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


