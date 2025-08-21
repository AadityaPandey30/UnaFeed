export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Import CommonJS modules via default interop
import mongooseModule from '../../../../lib/mongoose';
import Post from '../../../../models/Post';
import Comment from '../../../../models/Comment';

const { dbConnect } = mongooseModule;

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { postId, parentId = null, content = '', attachments = [], isMeme = false, meme = null } = body || {};

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    const post = await Post.findById(postId).lean();
    if (!post || post.status === 'deleted') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const headerDeviceId = request.headers.get('x-device-id');
    let deviceId = headerDeviceId || null;
    let cookieStore = null;
    let cookieToSet = null;
    if (!deviceId) {
      cookieStore = await cookies();
      deviceId = cookieStore.get('deviceId')?.value || null;
      if (!deviceId) {
        let cryptoModule;
        try { cryptoModule = await import('node:crypto'); } catch {}
        deviceId = cryptoModule?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
        cookieToSet = {
          name: 'deviceId',
          value: deviceId,
          options: {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 365
          }
        };
      }
    }

    let path = [];
    let depth = 0;
    if (parentId) {
      const parent = await Comment.findById(parentId).lean();
      if (!parent || String(parent.postId) !== String(postId)) {
        return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 });
      }
      path = [...(parent.path || []), parent._id];
      depth = (parent.depth || 0) + 1;
    }

    const commentDoc = await Comment.create({
      postId,
      parentId: parentId || null,
      path,
      depth,
      deviceId,
      content,
      attachments,
      isMeme: Boolean(isMeme),
      meme: isMeme ? meme : null
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
      $set: { lastActivityAt: new Date() }
    }).lean();

    const res = NextResponse.json({ success: true, comment: commentDoc }, { status: 201 });
    if (cookieToSet) {
      res.cookies.set(cookieToSet.name, cookieToSet.value, cookieToSet.options);
    }
    return res;
  } catch (err) {
    console.error('Create comment error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


