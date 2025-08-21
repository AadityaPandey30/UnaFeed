export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import mongooseModule from '../../../../lib/mongoose';
import Post from '../../../../models/Post';
import Reaction from '../../../../models/Reaction';

const { dbConnect } = mongooseModule;

export async function GET(_request, { params }) {
  try {
    await dbConnect();
    const { postId } = params || {};
    if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });

    const post = await Post.findById(postId).lean();
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // Aggregate counts for the post only (not comments)
    const pipeline = [
      { $match: { targetType: 'post', targetId: post._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ];
    const grouped = await Reaction.aggregate(pipeline);
    const counts = grouped.reduce((acc, g) => { acc[g._id] = g.count; return acc; }, {});

    return NextResponse.json({ success: true, counts: {
      like: counts.like || 0,
      love: counts.love || 0,
      haha: counts.haha || 0,
      wow: counts.wow || 0,
      sad: counts.sad || 0,
      angry: counts.angry || 0
    }});
  } catch (err) {
    console.error('Get reaction counts error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


