/**
 * Production-Ready MongoDB Management and Seed Script
 * Supports: clear (delete all collections) and seed (insert rich relational data)
 * Usage:
 *   npm run db:clear   → Clears all collections
 *   npm run db:seed    → Seeds comprehensive sample data
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../config/index.js';
import User from '../modules/auth/auth.model.js';
import Post from '../modules/posts/post.model.js';
import Category from '../modules/categories/category.model.js';
import Tag from '../modules/tags/tag.model.js';
import Comment from '../modules/comments/comment.model.js';
import Interaction from '../modules/interactions/interaction.model.js';
import Notification from '../modules/notifications/notification.model.js';
import Activity from '../modules/activity/activity.model.js';

dotenv.config();

// ==================== DATABASE CONNECTION ====================
async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

// ==================== CLEAR DATABASE ====================
async function clearDB() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
  console.log('🧹 All collections cleared\n');
}

// ==================== SEED DATABASE ====================
async function seedDB() {
  console.log('🌱 Starting database seeding...\n');
  await clearDB();

  // 1️⃣ SEED USERS (15 users: 1 admin, 5 authors, 9 regular users)
  console.log('👥 Seeding users...');
  const usersData = [
    // Admin
    { name: 'Admin Master', email: 'admin@blog.com', password: 'Admin@123', role: 'admin', isActive: true },
    
    // Authors
    { name: 'Alice Johnson', email: 'alice.author@blog.com', password: 'Author@123', role: 'author', isActive: true },
    { name: 'Bob Williams', email: 'bob.author@blog.com', password: 'Author@123', role: 'author', isActive: true },
    { name: 'Carol Martinez', email: 'carol.author@blog.com', password: 'Author@123', role: 'author', isActive: true },
    { name: 'David Chen', email: 'david.author@blog.com', password: 'Author@123', role: 'author', isActive: true },
    { name: 'Emma Rodriguez', email: 'emma.author@blog.com', password: 'Author@123', role: 'author', isActive: true },
    
    // Regular Users
    { name: 'John Smith', email: 'john.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'Jane Doe', email: 'jane.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'Michael Brown', email: 'michael.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'Sarah Davis', email: 'sarah.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'James Wilson', email: 'james.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'Emily Taylor', email: 'emily.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'Robert Anderson', email: 'robert.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'Lisa Thomas', email: 'lisa.user@blog.com', password: 'User@123', role: 'user', isActive: true },
    { name: 'Kevin Lee', email: 'kevin.user@blog.com', password: 'User@123', role: 'user', isActive: false }, // Inactive user
  ];

  const users = [];
  for (const userData of usersData) {
    const user = new User(userData);
    await user.save();
    users.push(user);
  }
  console.log(`   ✓ ${users.length} users created\n`);

  // 2️⃣ SEED CATEGORIES (8 categories)
  console.log('🏷️  Seeding categories...');
  const categories = await Category.insertMany([
    { name: 'Technology', description: 'Latest trends in tech, software development, and digital innovation' },
    { name: 'Science', description: 'Scientific discoveries, research updates, and breakthrough innovations' },
    { name: 'Lifestyle', description: 'Daily living tips, health, wellness, and work-life balance' },
    { name: 'Business', description: 'Entrepreneurship, startups, marketing, and business strategies' },
    { name: 'Travel', description: 'Travel guides, destinations, tips, and adventure stories' },
    { name: 'Food & Cooking', description: 'Recipes, culinary techniques, restaurant reviews, and food culture' },
    { name: 'Education', description: 'Learning resources, study tips, online courses, and educational technology' },
    { name: 'Entertainment', description: 'Movies, music, gaming, books, and pop culture' },
  ]);
  console.log(`   ✓ ${categories.length} categories created\n`);

  // 3️⃣ SEED TAGS (20 tags)
  console.log('🔖 Seeding tags...');
  const tags = await Tag.insertMany([
    { name: 'JavaScript' },
    { name: 'Node.js' },
    { name: 'React' },
    { name: 'AI & Machine Learning' },
    { name: 'Cloud Computing' },
    { name: 'Cybersecurity' },
    { name: 'Health & Fitness' },
    { name: 'Mental Health' },
    { name: 'Space Exploration' },
    { name: 'Climate Change' },
    { name: 'Productivity' },
    { name: 'Remote Work' },
    { name: 'Marketing' },
    { name: 'Finance' },
    { name: 'Photography' },
    { name: 'Design' },
    { name: 'Mobile Development' },
    { name: 'DevOps' },
    { name: 'Data Science' },
    { name: 'Blockchain' },
  ]);
  console.log(`   ✓ ${tags.length} tags created\n`);

  // 4️⃣ SEED POSTS (20 posts with varied statuses)
  console.log('📝 Seeding posts...');
  const postsData = [
    // Technology Posts
    {
      title: 'Building Scalable APIs with Node.js and Express',
      content: 'Node.js has revolutionized backend development with its non-blocking I/O model. In this comprehensive guide, we explore best practices for building RESTful APIs that can handle thousands of concurrent connections. We cover middleware patterns, error handling, database optimization, and deployment strategies. Whether you are building a startup MVP or enterprise application, these techniques will help you create robust, maintainable server-side applications.',
      author: users[1]._id,
      categories: [categories[0]._id],
      tags: [tags[0]._id, tags[1]._id, tags[17]._id],
      status: 'published',
      likesCount: 45,
      favoritesCount: 23,
      viewsCount: 320,
    },
    {
      title: 'React 19: What\'s New and Exciting',
      content: 'React continues to evolve with groundbreaking features that make building user interfaces more intuitive and performant. The latest version introduces server components, improved suspense boundaries, and enhanced concurrent rendering capabilities. This article dives deep into the new hooks, improved TypeScript support, and performance optimizations that make React 19 a game-changer for frontend developers.',
      author: users[2]._id,
      categories: [categories[0]._id],
      tags: [tags[0]._id, tags[2]._id],
      status: 'published',
      likesCount: 67,
      favoritesCount: 34,
      viewsCount: 540,
    },
    {
      title: 'Mastering Cloud Architecture: AWS vs Azure vs GCP',
      content: 'Choosing the right cloud provider is crucial for your application success. This detailed comparison explores the strengths and weaknesses of the three major cloud platforms. We analyze pricing models, service offerings, regional availability, and specific use cases where each platform excels. Learn how to make an informed decision for your infrastructure needs.',
      author: users[3]._id,
      categories: [categories[0]._id],
      tags: [tags[4]._id, tags[17]._id],
      status: 'published',
      likesCount: 52,
      favoritesCount: 28,
      viewsCount: 410,
    },
    {
      title: 'Cybersecurity Best Practices for Modern Web Applications',
      content: 'As cyber threats evolve, securing web applications has never been more critical. This guide covers essential security practices including input validation, authentication strategies, encryption methods, and common vulnerability prevention. Learn how to implement OWASP top 10 protections, secure your APIs, and build applications that protect user data from sophisticated attacks.',
      author: users[1]._id,
      categories: [categories[0]._id],
      tags: [tags[5]._id, tags[0]._id],
      status: 'approved',
      likesCount: 38,
      favoritesCount: 19,
      viewsCount: 290,
    },
    
    // Science Posts
    {
      title: 'The Future of Artificial Intelligence: Beyond ChatGPT',
      content: 'Artificial Intelligence is transforming every industry at an unprecedented pace. From healthcare diagnostics to autonomous vehicles, AI applications are becoming more sophisticated and accessible. This article explores cutting-edge developments in neural networks, natural language processing, computer vision, and the ethical considerations surrounding AI deployment in society.',
      author: users[4]._id,
      categories: [categories[1]._id, categories[0]._id],
      tags: [tags[3]._id, tags[18]._id],
      status: 'published',
      likesCount: 89,
      favoritesCount: 45,
      viewsCount: 780,
    },
    {
      title: 'Space Exploration: Mars Missions and Beyond',
      content: 'Humanity\'s quest to explore the cosmos has entered an exciting new era. With multiple missions to Mars, plans for lunar bases, and ambitious projects to reach the outer planets, space exploration is no longer science fiction. This comprehensive article examines current missions, technological breakthroughs in propulsion and life support, and the future of human colonization beyond Earth.',
      author: users[5]._id,
      categories: [categories[1]._id],
      tags: [tags[8]._id],
      status: 'published',
      likesCount: 72,
      favoritesCount: 38,
      viewsCount: 620,
    },
    {
      title: 'Climate Change: Understanding the Science and Solutions',
      content: 'Climate change represents one of humanity\'s greatest challenges. This evidence-based article explores the scientific consensus on global warming, the impact of greenhouse gases, and innovative solutions being developed worldwide. From renewable energy breakthroughs to carbon capture technology, discover how science and policy are working together to address this existential threat.',
      author: users[3]._id,
      categories: [categories[1]._id],
      tags: [tags[9]._id],
      status: 'published',
      likesCount: 61,
      favoritesCount: 31,
      viewsCount: 510,
    },
    
    // Lifestyle Posts
    {
      title: 'Healthy Routines for Remote Workers',
      content: 'Working from home offers flexibility but can blur work-life boundaries. This practical guide provides actionable strategies for maintaining physical and mental health while working remotely. Learn about ergonomic workspace setups, effective time management techniques, exercise routines you can do at home, and mindfulness practices that boost productivity and well-being.',
      author: users[2]._id,
      categories: [categories[2]._id],
      tags: [tags[6]._id, tags[11]._id, tags[10]._id],
      status: 'published',
      likesCount: 94,
      favoritesCount: 52,
      viewsCount: 850,
    },
    {
      title: 'Mental Health in the Digital Age: Finding Balance',
      content: 'Our constant connectivity comes with psychological costs. This thoughtful exploration examines how digital technology affects mental health, from social media anxiety to screen addiction. Discover evidence-based strategies for maintaining emotional well-being, setting healthy boundaries with technology, and cultivating meaningful real-world connections in an increasingly virtual world.',
      author: users[4]._id,
      categories: [categories[2]._id],
      tags: [tags[7]._id, tags[6]._id],
      status: 'published',
      likesCount: 78,
      favoritesCount: 41,
      viewsCount: 690,
    },
    {
      title: 'Minimalism: Living More with Less',
      content: 'The minimalist lifestyle is gaining popularity as people seek meaning beyond material possessions. This inspiring article explores the philosophy of minimalism, practical decluttering techniques, and the psychological benefits of simplified living. Learn how reducing physical clutter can lead to mental clarity, financial freedom, and a more intentional, fulfilling life.',
      author: users[5]._id,
      categories: [categories[2]._id],
      tags: [tags[10]._id],
      status: 'pending',
      likesCount: 12,
      favoritesCount: 6,
      viewsCount: 95,
    },
    
    // Business Posts
    {
      title: 'Startup Fundraising: A Comprehensive Guide',
      content: 'Raising capital is one of the biggest challenges for entrepreneurs. This detailed guide walks you through every stage of fundraising, from bootstrapping and angel investors to venture capital and IPOs. Learn how to create compelling pitch decks, value your company, negotiate term sheets, and build relationships with investors who believe in your vision.',
      author: users[1]._id,
      categories: [categories[3]._id],
      tags: [tags[12]._id, tags[13]._id],
      status: 'published',
      likesCount: 56,
      favoritesCount: 29,
      viewsCount: 470,
    },
    {
      title: 'Digital Marketing Strategies That Actually Work in 2025',
      content: 'Marketing has evolved dramatically with new platforms and technologies. This comprehensive guide covers proven strategies for SEO, content marketing, social media advertising, email campaigns, and influencer partnerships. Discover data-driven approaches to customer acquisition, retention strategies that build loyalty, and how to measure ROI across all marketing channels.',
      author: users[3]._id,
      categories: [categories[3]._id],
      tags: [tags[12]._id],
      status: 'published',
      likesCount: 83,
      favoritesCount: 44,
      viewsCount: 720,
    },
    
    // Travel Posts
    {
      title: 'Solo Travel: Finding Yourself Around the World',
      content: 'Solo travel is a transformative experience that builds confidence and broadens perspectives. This inspiring guide covers everything from choosing destinations and staying safe to meeting locals and embracing solitude. Discover budget-friendly tips, must-visit locations for solo travelers, and how to turn your journey into unforgettable personal growth.',
      author: users[2]._id,
      categories: [categories[4]._id],
      tags: [tags[14]._id],
      status: 'published',
      likesCount: 69,
      favoritesCount: 37,
      viewsCount: 580,
    },
    {
      title: 'Hidden Gems: Underrated European Destinations',
      content: 'Beyond Paris and Rome lie countless charming towns and breathtaking landscapes waiting to be discovered. This travel guide showcases lesser-known European destinations that offer authentic cultural experiences without tourist crowds. From medieval villages to pristine coastlines, explore places that capture the true essence of European heritage and natural beauty.',
      author: users[5]._id,
      categories: [categories[4]._id],
      tags: [tags[14]._id],
      status: 'draft',
      likesCount: 0,
      favoritesCount: 0,
      viewsCount: 15,
    },
    
    // Food Posts
    {
      title: 'Plant-Based Cooking: Delicious Recipes for Every Meal',
      content: 'Plant-based eating is more than a trend—it\'s a sustainable lifestyle choice with incredible health benefits. This cookbook-style article features mouthwatering recipes from breakfast smoothie bowls to hearty dinner entrées. Learn essential cooking techniques, ingredient substitutions, and how to create nutritionally balanced plant-based meals that satisfy even meat lovers.',
      author: users[4]._id,
      categories: [categories[5]._id],
      tags: [tags[6]._id],
      status: 'published',
      likesCount: 87,
      favoritesCount: 49,
      viewsCount: 760,
    },
    {
      title: 'The Art of Coffee: From Bean to Perfect Brew',
      content: 'Coffee is a global ritual enjoyed by billions. This deep dive explores coffee origins, roasting processes, brewing methods, and tasting notes. Whether you\'re a casual drinker or aspiring barista, learn how to select quality beans, master pour-over techniques, and appreciate the complex flavors that make each cup unique.',
      author: users[1]._id,
      categories: [categories[5]._id],
      tags: [],
      status: 'rejected',
      likesCount: 3,
      favoritesCount: 1,
      viewsCount: 42,
    },
    
    // Education Posts
    {
      title: 'Online Learning: Mastering New Skills from Home',
      content: 'The digital education revolution has made world-class learning accessible to everyone. This guide reviews top online learning platforms, effective study techniques, and how to stay motivated in self-paced courses. Discover strategies for building professional skills, choosing quality courses, and creating personalized learning paths that advance your career.',
      author: users[3]._id,
      categories: [categories[6]._id],
      tags: [tags[10]._id, tags[11]._id],
      status: 'published',
      likesCount: 74,
      favoritesCount: 40,
      viewsCount: 640,
    },
    {
      title: 'Coding Bootcamps vs Computer Science Degrees: What\'s Right for You?',
      content: 'Aspiring developers face important educational choices. This balanced analysis compares intensive coding bootcamps with traditional CS degrees, examining curriculum depth, time investment, costs, and career outcomes. Get insights from industry professionals and recent graduates to make an informed decision about your tech education journey.',
      author: users[2]._id,
      categories: [categories[6]._id, categories[0]._id],
      tags: [tags[0]._id, tags[16]._id],
      status: 'published',
      likesCount: 91,
      favoritesCount: 48,
      viewsCount: 810,
    },
    
    // Entertainment Posts
    {
      title: 'Indie Games Revolution: Hidden Masterpieces You Need to Play',
      content: 'Independent game developers are creating innovative, artistic experiences that rival big-budget titles. This curated list highlights exceptional indie games across genres, from narrative adventures to challenging platformers. Discover unique gameplay mechanics, compelling stories, and creative visions that prove games are a powerful artistic medium.',
      author: users[5]._id,
      categories: [categories[7]._id],
      tags: [],
      status: 'published',
      likesCount: 65,
      favoritesCount: 33,
      viewsCount: 550,
    },
    {
      title: 'Photography Basics: Capturing Stunning Images with Any Camera',
      content: 'Great photography isn\'t about expensive gear—it\'s about understanding light, composition, and storytelling. This beginner-friendly guide covers fundamental concepts like the exposure triangle, rule of thirds, leading lines, and golden hour lighting. Learn editing basics and how to develop your unique photographic style, whether shooting with a DSLR or smartphone.',
      author: users[4]._id,
      categories: [categories[7]._id],
      tags: [tags[14]._id, tags[15]._id],
      status: 'unpublished',
      likesCount: 8,
      favoritesCount: 4,
      viewsCount: 68,
    },
  ];

  const posts = await Post.insertMany(postsData);
  console.log(`   ✓ ${posts.length} posts created\n`);

  // 5️⃣ SEED COMMENTS (40 comments across posts)
  console.log('💬 Seeding comments...');
  const commentsData = [
    // Comments on Post 1 (Node.js)
    { post: posts[0]._id, author: users[6]._id, content: 'Excellent guide! The middleware patterns section was particularly helpful. I implemented these in my latest project.', status: 'approved' },
    { post: posts[0]._id, author: users[7]._id, content: 'Could you elaborate more on error handling strategies? Great article overall!', status: 'approved' },
    { post: posts[0]._id, author: users[8]._id, content: 'This is exactly what I needed for my startup API. Bookmarked for future reference. Thanks!', status: 'approved' },
    { post: posts[0]._id, author: users[9]._id, content: 'What about GraphQL? Would love to see a comparison with REST.', status: 'pending' },
    
    // Comments on Post 2 (React)
    { post: posts[1]._id, author: users[10]._id, content: 'React 19 looks amazing! The server components feature is a game changer.', status: 'approved' },
    { post: posts[1]._id, author: users[11]._id, content: 'Can\'t wait to migrate my projects. Great breakdown of the new features!', status: 'approved' },
    { post: posts[1]._id, author: users[6]._id, content: 'Has anyone tested performance improvements in production yet?', status: 'approved' },
    
    // Comments on Post 3 (Cloud)
    { post: posts[2]._id, author: users[7]._id, content: 'We switched from AWS to GCP last year. This comparison is spot on!', status: 'approved' },
    { post: posts[2]._id, author: users[12]._id, content: 'Azure has really improved their services lately. Worth considering for enterprise.', status: 'approved' },
    
    // Comments on Post 4 (Cybersecurity)
    { post: posts[3]._id, author: users[8]._id, content: 'Security should be everyone\'s priority. Thanks for making this accessible!', status: 'approved' },
    { post: posts[3]._id, author: users[9]._id, content: 'Implementing these practices saved us from a potential breach. Highly recommended!', status: 'approved' },
    { post: posts[3]._id, author: users[13]._id, content: 'What tools do you recommend for automated security testing?', status: 'pending' },
    
    // Comments on Post 5 (AI)
    { post: posts[4]._id, author: users[10]._id, content: 'AI is truly transforming everything. Exciting and slightly scary at the same time!', status: 'approved' },
    { post: posts[4]._id, author: users[11]._id, content: 'The ethical considerations section is crucial. More people need to think about this.', status: 'approved' },
    { post: posts[4]._id, author: users[6]._id, content: 'As an AI researcher, I appreciate the balanced perspective here. Well written!', status: 'approved' },
    { post: posts[4]._id, author: users[12]._id, content: 'How do you see AI affecting job markets in the next 5 years?', status: 'approved' },
    
    // Comments on Post 6 (Space)
    { post: posts[5]._id, author: users[7]._id, content: 'Space exploration fascinates me! The Mars missions are particularly exciting.', status: 'approved' },
    { post: posts[5]._id, author: users[8]._id, content: 'Do you think we\'ll see humans on Mars in our lifetime?', status: 'approved' },
    { post: posts[5]._id, author: users[13]._id, content: 'The propulsion technology section was mind-blowing. Great research!', status: 'approved' },
    
    // Comments on Post 7 (Climate)
    { post: posts[6]._id, author: users[9]._id, content: 'We all need to take climate action seriously. Thanks for the informative article.', status: 'approved' },
    { post: posts[6]._id, author: users[10]._id, content: 'The renewable energy solutions give me hope for the future.', status: 'approved' },
    
    // Comments on Post 8 (Remote Work)
    { post: posts[7]._id, author: users[11]._id, content: 'As someone who works remotely, these tips are golden! Implementing them today.', status: 'approved' },
    { post: posts[7]._id, author: users[6]._id, content: 'The ergonomic workspace section helped me fix my back pain. Thank you!', status: 'approved' },
    { post: posts[7]._id, author: users[12]._id, content: 'Time management is my biggest struggle. Your techniques are really practical.', status: 'approved' },
    { post: posts[7]._id, author: users[7]._id, content: 'Work-life balance is so important. Great comprehensive guide!', status: 'approved' },
    
    // Comments on Post 9 (Mental Health)
    { post: posts[8]._id, author: users[8]._id, content: 'This article really resonated with me. Social media breaks have improved my mood significantly.', status: 'approved' },
    { post: posts[8]._id, author: users[13]._id, content: 'Mental health awareness is crucial. Thank you for addressing this topic.', status: 'approved' },
    { post: posts[8]._id, author: users[9]._id, content: 'The digital detox strategies are exactly what I needed. Feeling better already!', status: 'approved' },
    
    // Comments on Post 11 (Fundraising)
    { post: posts[10]._id, author: users[10]._id, content: 'Currently fundraising for my startup. This guide is incredibly valuable!', status: 'approved' },
    { post: posts[10]._id, author: users[11]._id, content: 'The pitch deck tips helped me secure my first angel investment. Thank you!', status: 'approved' },
    
    // Comments on Post 12 (Marketing)
    { post: posts[11]._id, author: users[6]._id, content: 'Marketing landscape changes so fast. This is the most current guide I\'ve found!', status: 'approved' },
    { post: posts[11]._id, author: users[12]._id, content: 'ROI measurement section is pure gold. Implementing these metrics now.', status: 'approved' },
    
    // Comments on Post 13 (Solo Travel)
    { post: posts[12]._id, author: users[7]._id, content: 'Solo travel changed my life! This guide perfectly captures the experience.', status: 'approved' },
    { post: posts[12]._id, author: users[13]._id, content: 'I\'m planning my first solo trip. This gave me the confidence I needed!', status: 'approved' },
    
    // Comments on Post 15 (Plant-Based)
    { post: posts[14]._id, author: users[8]._id, content: 'These recipes are delicious! Even my meat-loving husband enjoys them.', status: 'approved' },
    { post: posts[14]._id, author: users[9]._id, content: 'Going plant-based was easier than expected thanks to this guide. Amazing!', status: 'approved' },
    
    // Comments on Post 17 (Online Learning)
    { post: posts[16]._id, author: users[10]._id, content: 'Online courses helped me switch careers. This is an excellent resource!', status: 'approved' },
    { post: posts[16]._id, author: users[11]._id, content: 'The motivation tips are really helpful for staying consistent.', status: 'approved' },
    
    // Comments on Post 18 (Bootcamps)
    { post: posts[17]._id, author: users[6]._id, content: 'I did a bootcamp and landed a great job. Highly recommend for career switchers!', status: 'approved' },
    { post: posts[17]._id, author: users[12]._id, content: 'This comparison helped me decide between bootcamp and traditional degree. Thanks!', status: 'approved' },
  ];

  const comments = await Comment.insertMany(commentsData);
  console.log(`   ✓ ${comments.length} comments created\n`);

  // 6️⃣ SEED INTERACTIONS (60 interactions)
  console.log('❤️  Seeding interactions...');
  const interactionsData = [];
  
  // Generate realistic interactions across users and posts
  const publishedPosts = posts.filter(p => p.status === 'published');
  const regularUsers = users.slice(6); // Users 6-14 are regular users
  
  regularUsers.forEach((user, userIdx) => {
    // Each user interacts with 4-6 random posts
    const numInteractions = 4 + Math.floor(Math.random() * 3);
    const shuffledPosts = [...publishedPosts].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numInteractions && i < shuffledPosts.length; i++) {
      interactionsData.push({
        user: user._id,
        post: shuffledPosts[i]._id,
        liked: Math.random() > 0.3, // 70% chance of liking
        favorited: Math.random() > 0.7, // 30% chance of favoriting
      });
    }
  });

  const interactions = await Interaction.insertMany(interactionsData);
  console.log(`   ✓ ${interactions.length} interactions created\n`);

  // 7️⃣ SEED NOTIFICATIONS (25 notifications)
  console.log('🔔 Seeding notifications...');
  const notificationsData = [
    // Post approval notifications
    { user: users[1]._id, title: 'Post Published', message: 'Your post "Building Scalable APIs with Node.js" is now live!', link: `/posts/${posts[0]._id}`, isRead: true },
    { user: users[2]._id, title: 'Post Published', message: 'Your post "React 19: What\'s New and Exciting" is now live!', link: `/posts/${posts[1]._id}`, isRead: true },
    { user: users[4]._id, title: 'Post Published', message: 'Your post "The Future of Artificial Intelligence" is now live!', link: `/posts/${posts[4]._id}`, isRead: false },
    
    // Comment notifications
    { user: users[1]._id, title: 'New Comment', message: 'John Smith commented on your post "Building Scalable APIs with Node.js"', link: `/posts/${posts[0]._id}`, isRead: false },
    { user: users[1]._id, title: 'New Comment', message: 'Jane Doe commented on your post "Building Scalable APIs with Node.js"', link: `/posts/${posts[0]._id}`, isRead: false },
    { user: users[2]._id, title: 'New Comment', message: 'Emily Taylor commented on your post "React 19: What\'s New and Exciting"', link: `/posts/${posts[1]._id}`, isRead: true },
    { user: users[4]._id, title: 'New Comment', message: 'John Smith commented on your post "The Future of Artificial Intelligence"', link: `/posts/${posts[4]._id}`, isRead: false },
    { user: users[2]._id, title: 'New Comment', message: 'Emily Taylor commented on your post "Healthy Routines for Remote Workers"', link: `/posts/${posts[7]._id}`, isRead: false },
    
    // Like notifications
    { user: users[1]._id, title: 'Post Liked', message: 'Your post received 45 likes!', link: `/posts/${posts[0]._id}`, isRead: true },
    { user: users[2]._id, title: 'Post Liked', message: 'Your post "React 19" received 67 likes!', link: `/posts/${posts[1]._id}`, isRead: true },
    { user: users[4]._id, title: 'Post Popular', message: 'Your post "The Future of AI" is trending with 89 likes!', link: `/posts/${posts[4]._id}`, isRead: false },
    { user: users[2]._id, title: 'Post Popular', message: 'Your post "Healthy Routines" hit 94 likes!', link: `/posts/${posts[7]._id}`, isRead: false },
    
    // System notifications
    { user: users[3]._id, title: 'Post Approved', message: 'Admin approved your post "Cybersecurity Best Practices"', link: `/posts/${posts[3]._id}`, isRead: true },
    { user: users[5]._id, title: 'Post Pending Review', message: 'Your post "Minimalism: Living More with Less" is pending approval', link: `/posts/${posts[9]._id}`, isRead: false },
    { user: users[1]._id, title: 'Post Rejected', message: 'Your post "The Art of Coffee" needs revisions. Check feedback.', link: `/posts/${posts[15]._id}`, isRead: false },
    
    // Milestone notifications
    { user: users[2]._id, title: 'Milestone Achieved', message: 'Congratulations! Your content reached 1,000 total views!', link: '/dashboard', isRead: true },
    { user: users[4]._id, title: 'New Follower', message: 'Sarah Davis started following you', link: '/profile', isRead: false },
    { user: users[1]._id, title: 'Achievement Unlocked', message: 'You\'ve published 5 posts! Keep up the great work!', link: '/achievements', isRead: true },
    
    // Welcome notifications
    { user: users[6]._id, title: 'Welcome to Our Blog!', message: 'Thanks for joining! Start exploring amazing content.', link: '/explore', isRead: true },
    { user: users[7]._id, title: 'Welcome to Our Blog!', message: 'Thanks for joining! Start exploring amazing content.', link: '/explore', isRead: true },
    
    // Engagement notifications
    { user: users[3]._id, title: 'Reply to Your Comment', message: 'Alice Johnson replied to your comment', link: `/posts/${posts[2]._id}`, isRead: false },
    { user: users[6]._id, title: 'Comment Approved', message: 'Your comment on "Building Scalable APIs" was approved', link: `/posts/${posts[0]._id}`, isRead: true },
    { user: users[10]._id, title: 'Post Saved', message: '5 users saved your post to their favorites!', link: `/posts/${posts[10]._id}`, isRead: false },
    { user: users[11]._id, title: 'Trending Content', message: 'Your post "Digital Marketing Strategies" is trending!', link: `/posts/${posts[11]._id}`, isRead: false },
    { user: users[5]._id, title: 'Weekly Summary', message: 'Your posts received 150 views this week. Great job!', link: '/analytics', isRead: false },
  ];

  const notifications = await Notification.insertMany(notificationsData);
  console.log(`   ✓ ${notifications.length} notifications created\n`);

  // 8️⃣ SEED ACTIVITIES (50 activities)
  console.log('📊 Seeding activities...');
  const activitiesData = [
    // User registration activities
    { user: users[6]._id, action: 'user_registered', details: 'John Smith joined the platform' },
    { user: users[7]._id, action: 'user_registered', details: 'Jane Doe joined the platform' },
    { user: users[8]._id, action: 'user_registered', details: 'Michael Brown joined the platform' },
    
    // Post creation activities
    { user: users[1]._id, action: 'create_post', details: 'Created draft post "Building Scalable APIs with Node.js"' },
    { user: users[1]._id, action: 'publish_post', details: 'Published post "Building Scalable APIs with Node.js"' },
    { user: users[2]._id, action: 'create_post', details: 'Created draft post "React 19: What\'s New and Exciting"' },
    { user: users[2]._id, action: 'publish_post', details: 'Published post "React 19: What\'s New and Exciting"' },
    { user: users[3]._id, action: 'create_post', details: 'Created post "Mastering Cloud Architecture"' },
    { user: users[3]._id, action: 'publish_post', details: 'Published post "Mastering Cloud Architecture"' },
    { user: users[4]._id, action: 'create_post', details: 'Created post "The Future of Artificial Intelligence"' },
    { user: users[4]._id, action: 'publish_post', details: 'Published post "The Future of AI"' },
    { user: users[5]._id, action: 'create_post', details: 'Created post "Space Exploration: Mars Missions"' },
    { user: users[5]._id, action: 'publish_post', details: 'Published post "Space Exploration"' },
    
    // Comment activities
    { user: users[6]._id, action: 'comment_post', details: 'Commented on post "Building Scalable APIs with Node.js"' },
    { user: users[7]._id, action: 'comment_post', details: 'Commented on post "Building Scalable APIs with Node.js"' },
    { user: users[8]._id, action: 'comment_post', details: 'Commented on post "Building Scalable APIs with Node.js"' },
    { user: users[10]._id, action: 'comment_post', details: 'Commented on post "React 19: What\'s New and Exciting"' },
    { user: users[11]._id, action: 'comment_post', details: 'Commented on post "React 19: What\'s New and Exciting"' },
    { user: users[7]._id, action: 'comment_post', details: 'Commented on post "Mastering Cloud Architecture"' },
    { user: users[8]._id, action: 'comment_post', details: 'Commented on post "Cybersecurity Best Practices"' },
    { user: users[10]._id, action: 'comment_post', details: 'Commented on post "The Future of AI"' },
    
    // Like activities
    { user: users[6]._id, action: 'like_post', details: 'Liked post "Building Scalable APIs with Node.js"' },
    { user: users[7]._id, action: 'like_post', details: 'Liked post "React 19: What\'s New and Exciting"' },
    { user: users[8]._id, action: 'like_post', details: 'Liked post "The Future of AI"' },
    { user: users[9]._id, action: 'like_post', details: 'Liked post "Healthy Routines for Remote Workers"' },
    { user: users[10]._id, action: 'like_post', details: 'Liked post "Mental Health in the Digital Age"' },
    { user: users[11]._id, action: 'like_post', details: 'Liked post "Digital Marketing Strategies"' },
    { user: users[12]._id, action: 'like_post', details: 'Liked post "Solo Travel: Finding Yourself"' },
    { user: users[13]._id, action: 'like_post', details: 'Liked post "Plant-Based Cooking"' },
    
    // Favorite activities
    { user: users[6]._id, action: 'favorite_post', details: 'Added post "Building Scalable APIs" to favorites' },
    { user: users[7]._id, action: 'favorite_post', details: 'Added post "React 19" to favorites' },
    { user: users[8]._id, action: 'favorite_post', details: 'Added post "The Future of AI" to favorites' },
    { user: users[9]._id, action: 'favorite_post', details: 'Added post "Healthy Routines" to favorites' },
    { user: users[10]._id, action: 'favorite_post', details: 'Added post "Startup Fundraising" to favorites' },
    
    // View activities
    { user: users[6]._id, action: 'view_post', details: 'Viewed post "Building Scalable APIs with Node.js"' },
    { user: users[7]._id, action: 'view_post', details: 'Viewed post "React 19: What\'s New and Exciting"' },
    { user: users[8]._id, action: 'view_post', details: 'Viewed post "Mastering Cloud Architecture"' },
    { user: users[9]._id, action: 'view_post', details: 'Viewed post "The Future of AI"' },
    { user: users[10]._id, action: 'view_post', details: 'Viewed post "Space Exploration"' },
    
    // Admin activities
    { user: users[0]._id, action: 'approve_post', details: 'Approved post "Cybersecurity Best Practices"' },
    { user: users[0]._id, action: 'approve_comment', details: 'Approved comment by John Smith' },
    { user: users[0]._id, action: 'reject_post', details: 'Rejected post "The Art of Coffee" - needs revision' },
    { user: users[0]._id, action: 'create_category', details: 'Created category "Technology"' },
    { user: users[0]._id, action: 'create_category', details: 'Created category "Science"' },
    
    // Edit activities
    { user: users[1]._id, action: 'edit_post', details: 'Updated post "Building Scalable APIs with Node.js"' },
    { user: users[2]._id, action: 'edit_post', details: 'Updated post "Healthy Routines for Remote Workers"' },
    { user: users[3]._id, action: 'edit_profile', details: 'Updated profile information' },
    { user: users[4]._id, action: 'edit_profile', details: 'Updated profile information' },
    
    // Share activities
    { user: users[6]._id, action: 'share_post', details: 'Shared post "The Future of AI"' },
    { user: users[7]._id, action: 'share_post', details: 'Shared post "Digital Marketing Strategies"' },
  ];

  const activities = await Activity.insertMany(activitiesData);
  console.log(`   ✓ ${activities.length} activities created\n`);

  console.log('═══════════════════════════════════════════════════');
  console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('═══════════════════════════════════════════════════');
  console.log('\n📊 Summary:');
  console.log(`   • ${users.length} Users (1 admin, 5 authors, 9 regular users)`);
  console.log(`   • ${categories.length} Categories`);
  console.log(`   • ${tags.length} Tags`);
  console.log(`   • ${posts.length} Posts (various statuses)`);
  console.log(`   • ${comments.length} Comments`);
  console.log(`   • ${interactions.length} Interactions`);
  console.log(`   • ${notifications.length} Notifications`);
  console.log(`   • ${activities.length} Activities`);
  console.log('\n🔐 Login Credentials:');
  console.log('   Admin:  admin@blog.com / Admin@123');
  console.log('   Author: alice.author@blog.com / Author@123');
  console.log('   User:   john.user@blog.com / User@123');
  console.log('═══════════════════════════════════════════════════\n');
}

// ==================== MAIN EXECUTION ====================
const operation = process.argv[2];

(async () => {
  try {
    await connectDB();

    if (operation === 'clear') {
      await clearDB();
      console.log('✅ Database cleared successfully\n');
    } else if (operation === 'seed') {
      await seedDB();
    } else {
      console.log('\n⚠️  Please specify an operation:');
      console.log('   npm run db:clear  → Clear all collections');
      console.log('   npm run db:seed   → Seed database with sample data\n');
    }
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
})();