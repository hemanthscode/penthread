// dropDatabase.js
import mongoose from 'mongoose';
import config from '../config/index.js';

async function dropDatabase() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error dropping database:', error);
  }
}

dropDatabase();
