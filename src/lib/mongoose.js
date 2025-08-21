const mongoose = require('mongoose');

let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    cached.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'iiituna_feed',
      maxPoolSize: 10,
    }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { dbConnect };
