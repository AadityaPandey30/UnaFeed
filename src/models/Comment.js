const mongoose = require('mongoose');
const { Schema } = mongoose;
const { AttachmentSchema, ToxicitySchema } = require('./_subdocs');

const MemeSchema = new Schema({
  prompt: String,
  imageUrl: String,
  provider: String,
  model: String,
  meta: { type: Schema.Types.Mixed }
}, { _id: false });

const CommentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', index: true, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null, index: true },

  // materialized path for n-level threads
  path: { type: [Schema.Types.ObjectId], index: true, default: [] },
  depth: { type: Number, default: 0 },

  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  deviceId: { type: String, index: true },

  content: { type: String },           // plain text content
  attachments: [AttachmentSchema],     // rarely used for comments
  isMeme: { type: Boolean, default: false },
  meme: { type: MemeSchema },

  toxicity: { type: ToxicitySchema },

  reactionCounts: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    haha: { type: Number, default: 0 },
    wow:  { type: Number, default: 0 },
    sad:  { type: Number, default: 0 },
    angry:{ type: Number, default: 0 }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isEdited: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false },
  status: { type: String, enum: ['active','deleted'], default: 'active', index: true }
}, { versionKey: false });

CommentSchema.index({ postId: 1, createdAt: 1 });
CommentSchema.index({ postId: 1, path: 1 }); // efficiently fetch threads

CommentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
