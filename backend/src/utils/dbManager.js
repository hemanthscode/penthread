/**
 * Multi-purpose MongoDB management and seed script
 * Supports: clear (delete all collections) and seed (insert baseline data)
 * Usage:
 *   npm run db:clear   → Clears all collections
 *   npm run db:seed    → Seeds sample relational data
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../config/index.js';
import bcrypt from 'bcryptjs';
import User from '../modules/auth/auth.model.js';
import Post from '../modules/posts/post.model.js';
import Category from '../modules/categories/category.model.js';
import Tag from '../modules/tags/tag.model.js';
import Comment from '../modules/comments/comment.model.js';
import Interaction from '../modules/interactions/interaction.model.js';
import Notification from '../modules/notifications/notification.model.js';
import Activity from '../modules/activity/activity.model.js';

dotenv.config();

async function connectDB() {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ MongoDB connected');
}

async function clearDB() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
  console.log('🧹 All collections cleared');
}

async function seedDB() {
  await clearDB();

  // 1️⃣ USERS
  const usersData = [
    { name: 'Admin Master', email: 'admin@blog.com', password: 'Admin@123', role: 'admin', isActive: true },
    { name: 'Author Alice', email: 'alice.author@blog.com', password: 'Admin@123', role: 'author', isActive: true },
    { name: 'Author Bob', email: 'bob.author@blog.com', password: 'Admin@123', role: 'author', isActive: true },
    { name: 'Regular User John', email: 'john.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'Regular User Jane', email: 'jane.user@blog.com', password: 'User@123', role: 'user', isActive: true },
  ];

  const users = [];
  for (const item of usersData) {
    const user = new User(item);
    await user.save();
    users.push(user);
  }
  console.log('👥 Users seeded');

  // 2️⃣ CATEGORIES
  const categories = await Category.insertMany([
    { name: 'Technology', description: 'Latest trends in tech and software' },
    { name: 'Science', description: 'Scientific discoveries and research updates' },
    { name: 'Lifestyle', description: 'Daily living hacks, health, and wellness' },
  ]);
  console.log('🏷️ Categories seeded');

  // 3️⃣ TAGS
  const tags = await Tag.insertMany([
    { name: 'JavaScript' },
    { name: 'Node.js' },
    { name: 'AI' },
    { name: 'Health' },
    { name: 'Space' },
  ]);
  console.log('🔖 Tags seeded');

  // 4️⃣ POSTS
  const posts = await Post.insertMany([
    {
      title: 'Exploring Node.js for Backend Scalability',
      content: 'Node.js makes it easy to create scalable servers using event-driven architecture...',
      author: users[1]._id,
      categories: [categories[0]._id],
      tags: [tags[0]._id, tags[1]._id],
      status: 'published',
      likesCount: 3,
      favoritesCount: 2,
      viewsCount: 10,
    },
    {
      title: 'The Future of Artificial Intelligence',
      content: 'AI advancements are reshaping industries and redefining productivity...',
      author: users[2]._id,
      categories: [categories[1]._id],
      tags: [tags[2]._id],
      status: 'approved',
      likesCount: 2,
      favoritesCount: 1,
      viewsCount: 8,
    },
    {
      title: 'Healthy Routines for Modern Professionals',
      content: 'Balancing work and health has become vital in modern corporate culture...',
      author: users[2]._id,
      categories: [categories[2]._id],
      tags: [tags[3]._id],
      status: 'published',
      likesCount: 5,
      favoritesCount: 3,
      viewsCount: 12,
    },
  ]);
  console.log('📝 Posts seeded');

  // 5️⃣ COMMENTS
  const comments = await Comment.insertMany([
    {
      post: posts[0]._id,
      author: users[3]._id,
      content: 'Awesome insight, really helpful 👏!',
      status: 'approved',
    },
    {
      post: posts[1]._id,
      author: users[4]._id,
      content: 'AI truly is the future. Great post.',
      status: 'approved',
    },
    {
      post: posts[2]._id,
      author: users[3]._id,
      content: 'I’ll definitely try these routines. Thanks for sharing!',
      status: 'approved',
    },
  ]);
  console.log('💬 Comments seeded');

  // 6️⃣ INTERACTIONS
  const interactions = await Interaction.insertMany([
    { user: users[3]._id, post: posts[0]._id, liked: true, favorited: false },
    { user: users[4]._id, post: posts[0]._id, liked: true, favorited: true },
    { user: users[3]._id, post: posts[1]._id, liked: false, favorited: true },
  ]);
  console.log('❤️ Interactions seeded');

  // 7️⃣ NOTIFICATIONS
  const notifications = await Notification.insertMany([
    {
      user: users[1]._id,
      title: 'New Comment on Your Post',
      message: `${users[3].name} commented on your post "${posts[0].title}"`,
      link: `/posts/${posts[0]._id}`,
    },
    {
      user: users[2]._id,
      title: 'Your Post Approved',
      message: `Admin ${users[0].name} approved your AI post.`,
      link: `/posts/${posts[1]._id}`,
    },
  ]);
  console.log('🔔 Notifications seeded');

  // 8️⃣ ACTIVITIES
  const activities = await Activity.insertMany([
    {
      user: users[3]._id,
      action: 'comment_post',
      details: `Commented on post "${posts[0].title}"`,
    },
    {
      user: users[4]._id,
      action: 'like_post',
      details: `Liked the post "${posts[1].title}"`,
    },
    {
      user: users[1]._id,
      action: 'publish_post',
      details: `Published a new post "${posts[0].title}"`,
    },
  ]);
  console.log('📊 Activities seeded');

  console.log('✅ SEEDING COMPLETED SUCCESSFULLY');
}

const operation = process.argv[2];
(async () => {
  try {
    await connectDB();

    if (operation === 'clear') {
      await clearDB();
    } else if (operation === 'seed') {
      await seedDB();
    } else {
      console.log('Please specify an operation: clear or seed');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
})();
