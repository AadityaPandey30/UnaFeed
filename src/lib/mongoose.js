const mongoose = require('mongoose');

let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    if (!process.env.MONGODB_URI) {
      // eslint-disable-next-line no-console
      console.warn('[mongo] MONGODB_URI is not set, falling back to mongodb://127.0.0.1:27017');
    }
    cached.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'iiituna_feed',
      maxPoolSize: 10,
    }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { dbConnect };
