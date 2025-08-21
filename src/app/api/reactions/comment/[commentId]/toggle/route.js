export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

import mongooseModule from '../../../../../../lib/mongoose';
import Reaction from '../../../../../../models/Reaction';
import Comment from '../../../../../../models/Comment';
import subdocs from '../../../../../../models/_subdocs';

const { dbConnect } = mongooseModule;
const { REACTION_TYPES } = subdocs;

function incPath(type) {
  return `reactionCounts.${type}`;
}

export async function POST(request, context) {
  try {
    await dbConnect();
    const { commentId } = await context.params;
    if (!commentId) return NextResponse.json({ error: 'commentId required' }, { status: 400 });
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: 'Invalid commentId' }, { status: 400 });
    }

    const body = await request.json();
    const { type } = body || {};
    if (!REACTION_TYPES.includes(type)) return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });

    const headerDeviceId = request.headers.get('x-device-id');
    let deviceId = headerDeviceId || null;
    let cookieStore = null;
    if (!deviceId) {
      cookieStore = await cookies();
      deviceId = cookieStore.get('deviceId')?.value || null;
    }
    let cookieToSet = null;
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

    const comment = await Comment.findById(commentId);
    if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });

    const existing = await Reaction.findOne({ targetType: 'comment', targetId: comment._id, deviceId });
    if (existing) {
      await existing.deleteOne();
      await Comment.updateOne({ _id: comment._id }, { $inc: { [incPath(existing.type)]: -1 } });
      const res = NextResponse.json({ success: true, toggled: 'off', type: existing.type });
      if (cookieToSet) res.cookies.set(cookieToSet.name, cookieToSet.value, cookieToSet.options);
      return res;
    }

    await Reaction.create({ targetType: 'comment', targetId: comment._id, deviceId, type });
    await Comment.updateOne({ _id: comment._id }, { $inc: { [incPath(type)]: 1 } });

    const res = NextResponse.json({ success: true, toggled: 'on', type });
    if (cookieToSet) res.cookies.set(cookieToSet.name, cookieToSet.value, cookieToSet.options);
    return res;
  } catch (err) {
    if (err && err.code === 11000) {
      return NextResponse.json({ success: true, toggled: 'noop' });
    }
    console.error('Toggle comment reaction error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


