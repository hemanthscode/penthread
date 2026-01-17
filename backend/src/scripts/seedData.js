/**
 * Data Seed Script
 * 
 * Seeds the database with sample data for development/testing.
 * Run: npm run seed:data
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
 * Production-ready sample data matching login credentials
 */
const sampleUsers = [
  { 
    name: 'Meghi', 
    email: 'meghi@gmail.com', 
    password: 'Author@123', 
    role: ROLES.AUTHOR,
    isActive: true 
  },
  { 
    name: 'Adi', 
    email: 'adi@user.com', 
    password: 'Test@123', 
    role: ROLES.USER,
    isActive: true 
  },
  { 
    name: 'Priya Kumar', 
    email: 'priya@example.com', 
    password: 'Test@123', 
    role: ROLES.AUTHOR,
    isActive: true 
  },
  { 
    name: 'Rahul Sharma', 
    email: 'rahul@example.com', 
    password: 'Test@123', 
    role: ROLES.USER,
    isActive: true 
  },
];

const sampleCategories = [
  { name: 'Technology', slug: 'technology', description: 'Latest tech news, tutorials, and programming guides' },
  { name: 'Web Development', slug: 'web-development', description: 'Frontend and backend development articles' },
  { name: 'Database', slug: 'database', description: 'Database design, optimization, and best practices' },
  { name: 'Career', slug: 'career', description: 'Career tips, interview prep, and job hunting advice' },
  { name: 'Tools', slug: 'tools', description: 'Developer tools, frameworks, and libraries' },
];

const sampleTags = [
  { name: 'javascript', slug: 'javascript' },
  { name: 'nodejs', slug: 'nodejs' },
  { name: 'react', slug: 'react' },
  { name: 'mongodb', slug: 'mongodb' },
  { name: 'express', slug: 'express' },
  { name: 'tutorial', slug: 'tutorial' },
  { name: 'beginner', slug: 'beginner' },
  { name: 'advanced', slug: 'advanced' },
  { name: 'best-practices', slug: 'best-practices' },
  { name: 'fullstack', slug: 'fullstack' },
];

// ✅ FIXED: sampleComments is now an array of STRINGS (not objects)
const sampleComments = [
  'Great article! Very helpful for beginners like me.',
  'Thanks for sharing this detailed guide. Looking forward to more content.',
  'This cleared up a lot of confusion I had. Well explained.',
  'Excellent tutorial. The examples are easy to follow.',
  'I learned something new today. Keep up the good work.',
  'Very informative post. Bookmarked for future reference.',
  'The step by step approach makes it easy to understand.',
  'Thanks for taking the time to write this. Really useful.',
];

const samplePosts = [
  {
    title: 'Getting Started with Node.js for Beginners',
    slug: 'getting-started-with-nodejs-for-beginners',
    content: 'Node.js is a powerful JavaScript runtime built on Chrome V8 engine that allows you to run JavaScript on the server side. This guide will walk you through the basics of Node.js development. First, you need to install Node.js from the official website. Once installed, you can verify the installation by running node -v in your terminal. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. You can create your first server using the built-in http module. The npm package manager comes bundled with Node.js and gives you access to thousands of open-source packages. Understanding asynchronous programming is key to mastering Node.js. We will explore callbacks, promises, and async await patterns. By the end of this tutorial, you will be able to build basic Node.js applications and understand the core concepts.',
    excerpt: 'Learn the fundamentals of Node.js and build your first server-side application',
    status: POST_STATUS.PUBLISHED,
  },
  {
    title: 'React Hooks Complete Guide',
    slug: 'react-hooks-complete-guide',
    content: 'React Hooks revolutionized the way we write React components by allowing us to use state and lifecycle features in functional components. The most commonly used hooks are useState and useEffect. useState lets you add state to functional components without converting them to class components. useEffect replaces lifecycle methods like componentDidMount and componentDidUpdate. Custom hooks allow you to extract component logic into reusable functions. The useContext hook makes it easy to consume context without wrapping components. useReducer is great for managing complex state logic. useMemo and useCallback help optimize performance by memoizing values and functions. Understanding the rules of hooks is essential. Always call hooks at the top level and only from React functions. This guide covers practical examples and common patterns you will encounter in real projects.',
    excerpt: 'Master React Hooks with practical examples and best practices',
    status: POST_STATUS.PUBLISHED,
  },
  {
    title: 'MongoDB Schema Design Best Practices',
    slug: 'mongodb-schema-design-best-practices',
    content: 'Designing effective MongoDB schemas requires understanding the differences between SQL and NoSQL databases. MongoDB uses a flexible document model where data is stored in JSON-like documents. One of the key decisions is choosing between embedding and referencing related data. Embedding works well for one-to-few relationships where data is frequently accessed together. Referencing is better for one-to-many or many-to-many relationships. Always design your schema based on your application query patterns. Denormalization is common in MongoDB and can improve read performance. However, it requires careful consideration of data consistency. Indexing is crucial for query performance. Create indexes on fields that are frequently used in queries. The aggregation pipeline is a powerful tool for data processing and transformation. Avoid unbounded arrays that can grow indefinitely. Use schema validation to enforce data quality. Understanding these patterns will help you build scalable MongoDB applications.',
    excerpt: 'Learn how to design efficient MongoDB schemas for your applications',
    status: POST_STATUS.PUBLISHED,
  },
  {
    title: 'Building RESTful APIs with Express',
    slug: 'building-restful-apis-with-express',
    content: 'Express is a minimal and flexible Node.js web application framework that provides robust features for building web and mobile applications. Creating RESTful APIs with Express is straightforward and follows standard HTTP conventions. Start by setting up your Express server and defining routes for different HTTP methods like GET, POST, PUT, and DELETE. Middleware functions have access to the request and response objects and can modify them or end the request-response cycle. Use express.json middleware to parse incoming JSON payloads. Route parameters and query strings help you create dynamic endpoints. Error handling middleware catches errors and sends appropriate responses to clients. Organizing your code into separate route files and controllers improves maintainability. Input validation is essential for API security. Use libraries like express-validator or Joi to validate incoming data. Authentication and authorization protect your API endpoints. JWT tokens are commonly used for stateless authentication. Following REST conventions and proper HTTP status codes makes your API intuitive for other developers.',
    excerpt: 'Create professional RESTful APIs using Express.js framework',
    status: POST_STATUS.PUBLISHED,
  },
  {
    title: 'JavaScript ES6 Features You Should Know',
    slug: 'javascript-es6-features-you-should-know',
    content: 'ES6 introduced many new features that make JavaScript more powerful and easier to write. Let and const provide block-scoped variable declarations replacing var. Arrow functions offer a concise syntax and lexically bind the this value. Template literals make string interpolation cleaner with backticks. Destructuring allows you to extract values from arrays and objects into distinct variables. The spread operator and rest parameters simplify working with arrays and function arguments. Default parameters let you set default values for function parameters. Classes provide a cleaner syntax for creating objects and inheritance. Promises make asynchronous code easier to write and understand. Modules allow you to organize code into separate files with import and export statements. The for-of loop iterates over iterable objects like arrays and strings. Map and Set are new data structures with useful methods. Understanding these features will make you a more productive JavaScript developer and prepare you for modern frameworks.',
    excerpt: 'Explore essential ES6 features that every JavaScript developer should master',
    status: POST_STATUS.PUBLISHED,
  },
  {
    title: 'Full Stack Development Roadmap 2026',
    slug: 'full-stack-development-roadmap-2026',
    content: 'Becoming a full stack developer requires learning both frontend and backend technologies. Start with HTML, CSS, and JavaScript fundamentals. Master responsive design and CSS frameworks like Tailwind or Bootstrap. Learn a frontend framework such as React, Vue, or Angular. Understanding state management is crucial for complex applications. On the backend, choose a language like JavaScript with Node.js, Python, or Java. Learn to build RESTful APIs and understand HTTP protocols. Database knowledge is essential. Start with SQL databases like PostgreSQL or MySQL, then explore NoSQL options like MongoDB. Version control with Git is a must-have skill. Learn about authentication and authorization mechanisms. Understanding DevOps basics like Docker and CI/CD pipelines is valuable. Cloud platforms like AWS or Azure are increasingly important. Testing your code with unit and integration tests ensures quality. Soft skills like problem-solving and communication matter as much as technical skills. Build projects that showcase your abilities. Contributing to open source helps you learn and network. Stay updated with industry trends and continue learning throughout your career.',
    excerpt: 'A comprehensive roadmap to becoming a successful full stack developer',
    status: POST_STATUS.PUBLISHED,
  },
];

/**
 * Seeds the database with production-ready data
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');
    await connectDB();

    // Clear existing data (preserve admin)
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({ email: { $ne: 'hemanth@gmail.com' } }),
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
            tags[(index + 2) % tags.length]._id,
          ],
          publishedAt: new Date(Date.now() - (index * 86400000)),
          featured: index < 2,
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 50) + 10,
        });
        return post.save();
      })
    );
    console.log(`✓ Created ${posts.length} posts\n`);

    // ✅ FIXED: Create comments - now uses STRING values directly
    console.log('💬 Creating comments...');
    const readers = users.filter(u => u.role === ROLES.USER);
    
    const comments = [];
    for (let i = 0; i < posts.length; i++) {
      const commentCount = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < commentCount; j++) {
        const comment = new Comment({
          post: posts[i]._id,
          author: readers[j % readers.length]._id,
          content: sampleComments[(i + j) % sampleComments.length], // ✅ FIXED: Direct string
          status: COMMENT_STATUS.APPROVED,
          createdAt: new Date(Date.now() - ((i * j + 1) * 3600000)),
        });
        comments.push(await comment.save());
      }
    }
    console.log(`✓ Created ${comments.length} comments\n`);

    // Summary
    console.log('✅ Database seeded successfully!\n');
    console.log('Summary:');
    console.log(`  Users: ${users.length}`);
    console.log(`  Categories: ${categories.length}`);
    console.log(`  Tags: ${tags.length}`);
    console.log(`  Posts: ${posts.length}`);
    console.log(`  Comments: ${comments.length}\n`);

    console.log('📋 Production Login Credentials:\n');
    console.log('  Admin:');
    console.log('    Email: hemanth@gmail.com');
    console.log('    Password: Test@123\n');
    console.log('  Author:');
    console.log('    Email: meghi@gmail.com');
    console.log('    Password: Author@123\n');
    console.log('  User:');
    console.log('    Email: adi@user.com');
    console.log('    Password: Test@123\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();
