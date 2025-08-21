/* eslint-disable no-console */

// Provide default local Mongo if env is not set
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017';
}
if (!process.env.MONGODB_DB) {
  process.env.MONGODB_DB = 'iiituna_feed';
}

const { dbConnect } = require('../src/lib/mongoose');
const Post = require('../src/models/Post');

async function main() {
  await dbConnect();
  const post = await Post.create({
    type: 'announcement',
    title: 'Welcome to UnaFeed',
    description: 'This is a seeded announcement post for testing comments and reactions.',
  });
  console.log('Seeded post with _id:', String(post._id));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });


