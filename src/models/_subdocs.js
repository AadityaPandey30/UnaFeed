const mongoose = require('mongoose');
const { Schema } = mongoose;

// ---- Enums
const POST_TYPES = ['event', 'lostfound', 'announcement'];
const REACTION_TYPES = ['like','love','haha','wow','sad','angry'];
const RSVP_STATUS = ['going','interested','not_going'];
const LOSTFOUND_MODE = ['lost','found'];

// ---- Geo point
const GeoPointSchema = new Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], default: undefined } // [lng, lat]
}, { _id: false });

// ---- Attachment (image/pdf/others)
const AttachmentSchema = new Schema({
  kind: { type: String, enum: ['image','pdf','file'], required: true },
  url:  { type: String, required: true },
  mime: { type: String },
  size: { type: Number }, // bytes
  width: Number,
  height: Number,
  pageCount: Number,      // for PDFs if you want
  meta: { type: Schema.Types.Mixed } // anything extra (e.g. blurhash)
}, { _id: false });

// ---- AI classification result
const AIClassificationSchema = new Schema({
  provider: String,           // e.g. 'openai'
  model: String,              // e.g. 'gpt-4o-mini'
  label: { type: String, enum: POST_TYPES }, // predicted post type
  confidence: Number,
  extracted: { type: Schema.Types.Mixed },   // fields pulled out (date, location, item, etc.)
  raw: { type: Schema.Types.Mixed }          // raw response if needed
}, { _id: false });

// ---- Toxicity moderation result
const ToxicitySchema = new Schema({
  provider: String,
  model: String,
  flagged: { type: Boolean, default: false },
  categories: { type: Schema.Types.Mixed },     // granular reasons/scores
  suggestion: { type: String }                  // softened rewrite
}, { _id: false });

// ---- Meme generation (for comments)
const MemeSchema = new Schema({
  prompt: String,
  imageUrl: String,
  provider: String,
  model: String,
  meta: { type: Schema.Types.Mixed }
}, { _id: false });

module.exports = {
  POST_TYPES,
  REACTION_TYPES,
  RSVP_STATUS,
  LOSTFOUND_MODE,
  GeoPointSchema,
  AttachmentSchema,
  AIClassificationSchema,
  ToxicitySchema,
  MemeSchema
};
