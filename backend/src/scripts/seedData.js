/**
 * Data Seed Script
 * 
 * Seeds the database with sample data for development/testing.
 * Run: npm run seed:data
 * 
 * @module scripts/seedData
 */

import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import User from '../modules/auth/auth.model.js';
import Post from '../modules/posts/post.model.js';
import Category from '../modules/categories/category.model.js';
import Tag from '../modules/tags/tag.model.js';
import Comment from '../modules/comments/comment.model.js';
import { ROLES, POST_STATUS, COMMENT_STATUS } from '../utils/constants.js';
import logger from '../config/logger.js';

/**
 * Sample data
 */
const sampleUsers = [
  { name: 'John Author', email: 'john@example.com', password: 'Password123', role: ROLES.AUTHOR },
  { name: 'Jane Writer', email: 'jane@example.com', password: 'Password123', role: ROLES.AUTHOR },
  { name: 'Bob Reader', email: 'bob@example.com', password: 'Password123', role: ROLES.USER },
];

const sampleCategories = [
  { name: 'Technology', description: 'Tech news and tutorials' },
  { name: 'Lifestyle', description: 'Life, health, and wellness' },
  { name: 'Travel', description: 'Travel guides and tips' },
  { name: 'Food', description: 'Recipes and food reviews' },
];

const sampleTags = [
  { name: 'javascript' },
  { name: 'nodejs' },
  { name: 'react' },
  { name: 'mongodb' },
  { name: 'tutorial' },
  { name: 'guide' },
];

const samplePosts = [
  {
    title: 'Getting Started with Node.js',
    content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 engine. In this comprehensive guide, we\'ll explore how to set up your development environment, understand the event loop, and build your first Node.js application. We\'ll cover modules, npm packages, and best practices for building scalable applications.',
    status: POST_STATUS.PUBLISHED,
  },
  {
    title: 'React Best Practices in 2025',
    content: 'React continues to evolve with new patterns and best practices. This article covers the latest recommendations including hooks, context API, error boundaries, and performance optimization techniques. We\'ll also discuss state management solutions and when to use them.',
    status: POST_STATUS.PUBLISHED,
  },
  {
    title: 'MongoDB Schema Design Patterns',
    content: 'Designing effective MongoDB schemas requires understanding document modeling patterns. We\'ll explore embedding vs referencing, polymorphic patterns, and how to optimize for your query patterns. Learn when to denormalize and how to handle relationships in a NoSQL database.',
    status: POST_STATUS.PUBLISHED,
  },
];

/**
 * Seeds the database
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Comment.deleteMany({}),
    ]);
    console.log('✓ Data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✓ Created ${users.length} users\n`);

    // Create categories
    console.log('📁 Creating categories...');
    const categories = await Category.insertMany(sampleCategories);
    console.log(`✓ Created ${categories.length} categories\n`);

    // Create tags
    console.log('🏷️  Creating tags...');
    const tags = await Tag.insertMany(sampleTags);
    console.log(`✓ Created ${tags.length} tags\n`);

    // Create posts
    console.log('📝 Creating posts...');
    const authors = users.filter(u => u.role === ROLES.AUTHOR);
    
    const posts = await Promise.all(
      samplePosts.map((postData, index) => {
        const post = new Post({
          ...postData,
          author: authors[index % authors.length]._id,
          categories: [categories[index % categories.length]._id],
          tags: [
            tags[index % tags.length]._id,
            tags[(index + 1) % tags.length]._id,
          ],
          publishedAt: new Date(),
        });
        return post.save();
      })
    );
    console.log(`✓ Created ${posts.length} posts\n`);

    // Create comments
    console.log('💬 Creating comments...');
    const reader = users.find(u => u.role === ROLES.USER);
    
    const comments = await Promise.all(
      posts.map((post) => {
        const comment = new Comment({
          post: post._id,
          author: reader._id,
          content: 'Great article! Very informative and well-written.',
          status: COMMENT_STATUS.APPROVED,
        });
        return comment.save();
      })
    );
    console.log(`✓ Created ${comments.length} comments\n`);

    // Summary
    console.log('✅ Database seeded successfully!\n');
    console.log('Summary:');
    console.log(`  Users: ${users.length}`);
    console.log(`  Categories: ${categories.length}`);
    console.log(`  Tags: ${tags.length}`);
    console.log(`  Posts: ${posts.length}`);
    console.log(`  Comments: ${comments.length}\n`);

    console.log('Login credentials:');
    sampleUsers.forEach(u => {
      console.log(`  ${u.email} / Password123 (${u.role})`);
    });
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
