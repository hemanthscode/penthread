/**
 * Multi-purpose MongoDB management script.
 * Supports: clear (delete all collections) and seed (insert base data).
 * Usage:
 *   npm run db:clear   -> Drops all collections
 *   npm run db:seed    -> Inserts demo or base data
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';
import User from '../modules/auth/auth.model.js';

dotenv.config();

// Connect to MongoDB using configuration
async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
}

// Clear all collections in the database
async function clearDB() {
  try {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
    console.log('🧹 All collections cleared successfully');
  } catch (err) {
    console.error('❌ Error clearing DB:', err.message);
  }
}

// Seed sample or initial data (e.g., default admin user)
async function seedDB() {
  try {
    await clearDB();

    const users = [
      { name: 'Super Admin', email: 'admin@blogplatform.com', password: 'Admin@123', role: 'admin', isActive: true },
      { name: 'Author One', email: 'author1@blog.com', password: 'Admin@123', role: 'author', isActive: true },
      { name: 'Author Two', email: 'author2@blog.com', password: 'Admin@123', role: 'author', isActive: true },
      { name: 'Regular User', email: 'user1@blog.com', password: 'Admin@123', role: 'user', isActive: true },
      { name: 'Inactive User', email: 'user2@blog.com', password: 'Admin@123', role: 'user', isActive: false },
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();  // password will be hashed automatically by pre 'save' hook
      console.log(`🌱 Created user: ${user.email} (${user.role})`);
    }

    console.log('✅ Seeding completed. All users created with password "Admin@123".');
  } catch (err) {
    console.error('❌ Error seeding DB:', err.message);
  }
}


// Determine operation from CLI arguments
const operation = process.argv[2];

(async () => {
  await connectDB();

  switch (operation) {
    case 'clear':
      await clearDB();
      break;

    case 'seed':
      await seedDB();
      break;

    default:
      console.log('Please provide an operation: clear or seed');
  }

  await mongoose.connection.close();
  console.log('🔌 Disconnected from MongoDB');
  process.exit();
})();
