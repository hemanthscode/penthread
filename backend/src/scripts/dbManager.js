/**
 * Database Manager Script
 * 
 * Utility for managing database operations (clear, backup info).
 * Run: npm run db:clear or npm run db:seed
 * 
 * @module scripts/dbManager
 */

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/database.js';
import User from '../modules/auth/auth.model.js';
import Post from '../modules/posts/post.model.js';
import Category from '../modules/categories/category.model.js';
import Tag from '../modules/tags/tag.model.js';
import Comment from '../modules/comments/comment.model.js';
import Interaction from '../modules/interactions/interaction.model.js';
import Notification from '../modules/notifications/notification.model.js';
import Activity from '../modules/activity/activity.model.js';

const args = process.argv.slice(2);
const command = args[0];

/**
 * Clears all collections
 */
async function clearDatabase() {
  try {
    console.log('🗑️  Clearing all collections...\n');

    const results = await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Comment.deleteMany({}),
      Interaction.deleteMany({}),
      Notification.deleteMany({}),
      Activity.deleteMany({}),
    ]);

    const total = results.reduce((sum, r) => sum + r.deletedCount, 0);

    console.log('✓ Database cleared successfully!');
    console.log(`  Total documents deleted: ${total}\n`);
  } catch (error) {
    console.error('❌ Clear failed:', error);
    throw error;
  }
}

/**
 * Shows database info
 */
async function showInfo() {
  try {
    console.log('📊 Database Information\n');

    const [
      userCount,
      postCount,
      categoryCount,
      tagCount,
      commentCount,
      interactionCount,
      notificationCount,
      activityCount,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Category.countDocuments(),
      Tag.countDocuments(),
      Comment.countDocuments(),
      Interaction.countDocuments(),
      Notification.countDocuments(),
      Activity.countDocuments(),
    ]);

    console.log('Collections:');
    console.log(`  Users: ${userCount}`);
    console.log(`  Posts: ${postCount}`);
    console.log(`  Categories: ${categoryCount}`);
    console.log(`  Tags: ${tagCount}`);
    console.log(`  Comments: ${commentCount}`);
    console.log(`  Interactions: ${interactionCount}`);
    console.log(`  Notifications: ${notificationCount}`);
    console.log(`  Activities: ${activityCount}`);
    console.log(`  Total: ${userCount + postCount + categoryCount + tagCount + commentCount + interactionCount + notificationCount + activityCount}\n`);
  } catch (error) {
    console.error('❌ Info failed:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await connectDB();

    switch (command) {
      case 'clear':
        await clearDatabase();
        break;
      case 'info':
        await showInfo();
        break;
      default:
        console.log('Usage:');
        console.log('  npm run db:clear  - Clear all collections');
        console.log('  npm run db:info   - Show database info');
        break;
    }

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Operation failed:', error.message);
    process.exit(1);
  }
}

main();
