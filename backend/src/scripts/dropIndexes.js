// dropIndexes.js
import mongoose from 'mongoose';
import config from '../config/index.js';

async function dropIndexes() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;
    const collections = await db.collections();

    for (const collection of collections) {
      try {
        const name = collection.collectionName;
        console.log(`Dropping indexes for collection: ${name}`);
        await collection.dropIndexes();
        console.log(`Dropped indexes for ${name}`);
      } catch (err) {
        if (err.message.includes('ns not found')) {
          console.warn(`Collection ${collection.collectionName} does not exist - skipping.`);
        } else {
          console.error(`Error dropping indexes for ${collection.collectionName}:`, err);
        }
      }
    }

    await mongoose.disconnect();
    console.log('All indexes dropped successfully.');
  } catch (error) {
    console.error('Error dropping indexes:', error);
  }
}

dropIndexes();
