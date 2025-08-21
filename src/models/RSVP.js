const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RSVP_STATUS } = require('./_subdocs');

const RSVPSchema = new Schema({
  eventPostId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  userId:      { type: Schema.Types.ObjectId, ref: 'User', index: true },
  deviceId:    { type: String, index: true },
  status:      { type: String, enum: RSVP_STATUS, required: true },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
}, { versionKey: false });

RSVPSchema.index({ eventPostId: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } });
RSVPSchema.index({ eventPostId: 1, deviceId: 1 }, { unique: true, partialFilterExpression: { deviceId: { $exists: true } } });

RSVPSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models.RSVP || mongoose.model('RSVP', RSVPSchema);
