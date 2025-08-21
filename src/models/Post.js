const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
  POST_TYPES, LOSTFOUND_MODE, GeoPointSchema,
  AttachmentSchema, AIClassificationSchema, ToxicitySchema
} = require('./_subdocs');

const EventSubSchema = new Schema({
  location: { type: String },
  geo: { type: GeoPointSchema },
  startAt: { type: Date },
  endAt: { type: Date },
  rsvpCounts: {
    going: { type: Number, default: 0 },
    interested: { type: Number, default: 0 },
    not_going: { type: Number, default: 0 }
  },
  capacity: Number
}, { _id: false });

const LostFoundSubSchema = new Schema({
  mode: { type: String, enum: LOSTFOUND_MODE, required: true }, // lost | found
  itemName: { type: String, required: true },
  lastSeenLocation: { type: String },
  geo: { type: GeoPointSchema },
  lastSeenAt: { type: Date },
  contactHint: { type: String }, // e.g., "DM me", phone/email if allowed
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date }
}, { _id: false });

const AnnouncementSubSchema = new Schema({
  department: { type: String, required: true },
  attachments: [AttachmentSchema], // usually pdf/image
  externalLink: { type: String }
}, { _id: false });

const ReactionCountsSchema = new Schema({
  like:    { type: Number, default: 0 },
  love:    { type: Number, default: 0 },
  haha:    { type: Number, default: 0 },
  wow:     { type: Number, default: 0 },
  sad:     { type: Number, default: 0 },
  angry:   { type: Number, default: 0 }
}, { _id: false });

const PostSchema = new Schema({
  type: { type: String, enum: POST_TYPES, required: true, index: true },

  // author
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  deviceId: { type: String, index: true }, // redundancy for quick lookup

  // common content
  title: { type: String },
  description: { type: String },
  attachments: [AttachmentSchema],

  // type-specific payloads
  event: { type: EventSubSchema },
  lostfound: { type: LostFoundSubSchema },
  announcement: { type: AnnouncementSubSchema },

  // UX metrics
  commentCount: { type: Number, default: 0 },
  reactionCounts: { type: ReactionCountsSchema, default: () => ({}) },
  lastActivityAt: { type: Date, default: Date.now },

  // AI + moderation
  aiClassification: { type: AIClassificationSchema },
  toxicity: { type: ToxicitySchema },

  // lifecycle & flags
  status: { type: String, enum: ['active','archived','deleted'], default: 'active', index: true },
  isEdited: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

PostSchema.index({ createdAt: -1 });
PostSchema.index({ type: 1, createdAt: -1 });
// for map/date filtering
PostSchema.index({ 'event.startAt': 1 });
PostSchema.index({ 'lostfound.mode': 1, 'lostfound.resolved': 1 });

// Full-text (optional, MongoDB Atlas Search is better if enabled)
PostSchema.index({ title: 'text', description: 'text' });

PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
