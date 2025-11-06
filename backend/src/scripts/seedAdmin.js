/**
 * Admin Seed Script
 * 
 * Creates the initial admin user for the platform.
 * Run: npm run seed:admin
 * 
 * @module scripts/seedAdmin
 */

import mongoose from 'mongoose';
import readline from 'readline';
import { connectDB } from '../config/database.js';
import User from '../modules/auth/auth.model.js';
import { ROLES } from '../utils/constants.js';
import logger from '../config/logger.js';
import config from '../config/index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompts user for input
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Creates admin user
 */
async function seedAdmin() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: ROLES.ADMIN });
    
    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      
      const overwrite = await prompt('\nDo you want to create another admin? (yes/no): ');
      
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('\n✓ Seed cancelled');
        process.exit(0);
      }
    }

    console.log('\n📝 Create Admin User\n');

    const name = await prompt('Admin Name: ');
    const email = await prompt('Admin Email: ');
    const password = await prompt('Admin Password (min 8 chars): ');

    // Validate inputs
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create admin user
    const admin = new User({
      name,
      email,
      password,
      role: ROLES.ADMIN,
      isActive: true,
    });

    await admin.save();

    console.log('\n✓ Admin user created successfully!\n');
    console.log('Details:');
    console.log(`  Name: ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role: ${admin.role}`);
    console.log(`  ID: ${admin._id}\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run seed
seedAdmin();
