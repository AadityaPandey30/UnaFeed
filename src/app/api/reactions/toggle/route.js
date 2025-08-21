export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import mongooseModule from '../../../../lib/mongoose';
import Reaction from '../../../../models/Reaction';
import Post from '../../../../models/Post';
import Comment from '../../../../models/Comment';
import subdocs from '../../../../models/_subdocs';

const { dbConnect } = mongooseModule;
const { REACTION_TYPES } = subdocs;

function incPath(type) {
  return `reactionCounts.${type}`;
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { targetType, targetId, type } = body || {};

    if (!['post','comment'].includes(targetType)) {
      return NextResponse.json({ error: 'Invalid targetType' }, { status: 400 });
    }
    if (!targetId) return NextResponse.json({ error: 'targetId required' }, { status: 400 });
    if (!REACTION_TYPES.includes(type)) return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });

    const cookieStore = cookies();
    let deviceId = cookieStore.get('deviceId')?.value;
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

    const TargetModel = targetType === 'post' ? Post : Comment;
    const target = await TargetModel.findById(targetId);
    if (!target) return NextResponse.json({ error: 'Target not found' }, { status: 404 });

    // Toggle: if existing reaction exists, remove it; else create
    const existing = await Reaction.findOne({ targetType, targetId, deviceId });
    if (existing) {
      await existing.deleteOne();
      await TargetModel.updateOne({ _id: targetId }, { $inc: { [incPath(existing.type)]: -1 } });
      const res = NextResponse.json({ success: true, toggled: 'off', type: existing.type });
      if (cookieToSet) res.cookies.set(cookieToSet.name, cookieToSet.value, cookieToSet.options);
      return res;
    }

    // Otherwise, create the new reaction and increment counter
    await Reaction.create({ targetType, targetId, deviceId, type });
    await TargetModel.updateOne({ _id: targetId }, { $inc: { [incPath(type)]: 1 } });

    const res = NextResponse.json({ success: true, toggled: 'on', type });
    if (cookieToSet) res.cookies.set(cookieToSet.name, cookieToSet.value, cookieToSet.options);
    return res;
  } catch (err) {
    // Handle duplicate key (unique index) gracefully
    if (err && err.code === 11000) {
      return NextResponse.json({ success: true, toggled: 'noop' });
    }
    console.error('Toggle reaction error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


