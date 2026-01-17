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
 * Creates admin user with production credentials
 */
async function seedAdmin() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'hemanth@gmail.com' });
    
    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      
      const overwrite = await prompt('\nDo you want to overwrite the existing admin? (yes/no): ');
      
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('\n✓ Seed cancelled');
        process.exit(0);
      }
      
      // Delete existing admin to recreate
      await User.deleteOne({ email: 'hemanth@gmail.com' });
      console.log('✓ Existing admin removed');
    }

    console.log('\n📝 Creating Admin User\n');

    // Production admin credentials
    const adminData = {
      name: 'Hemanth',
      email: 'hemanth@gmail.com',
      password: 'Test@123',
      role: ROLES.ADMIN,
      isActive: true,
    };

    // Create admin user
    const admin = new User(adminData);
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
