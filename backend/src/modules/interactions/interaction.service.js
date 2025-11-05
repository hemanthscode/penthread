import Interaction from './interaction.model.js';
import Post from '../posts/post.model.js';
import Comment from '../comments/comment.model.js';

/**
 * Toggle like status with atomic operations
 */
export async function toggleLike(userId, postId) {
  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  let interaction = await Interaction.findOne({ user: userId, post: postId });

  if (!interaction) {
    // Create new interaction with like
    interaction = new Interaction({ user: userId, post: postId, liked: true, favorited: false });
    await interaction.save();
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    return { liked: true, favorited: false };
  }

  // Toggle existing like
  const newLikedStatus = !interaction.liked;
  interaction.liked = newLikedStatus;
  await interaction.save();

  // Update post count
  await Post.findByIdAndUpdate(
    postId,
    { $inc: { likesCount: newLikedStatus ? 1 : -1 } }
  );

  return { liked: newLikedStatus, favorited: interaction.favorited };
}

/**
 * Toggle favorite status with atomic operations
 */
export async function toggleFavorite(userId, postId) {
  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  let interaction = await Interaction.findOne({ user: userId, post: postId });

  if (!interaction) {
    // Create new interaction with favorite
    interaction = new Interaction({ user: userId, post: postId, liked: false, favorited: true });
    await interaction.save();
    await Post.findByIdAndUpdate(postId, { $inc: { favoritesCount: 1 } });
    return { liked: false, favorited: true };
  }

  // Toggle existing favorite
  const newFavoritedStatus = !interaction.favorited;
  interaction.favorited = newFavoritedStatus;
  await interaction.save();

  // Update post count
  await Post.findByIdAndUpdate(
    postId,
    { $inc: { favoritesCount: newFavoritedStatus ? 1 : -1 } }
  );

  return { liked: interaction.liked, favorited: newFavoritedStatus };
}

/**
 * Record a view increment on a post
 */
export async function recordView(postId) {
  await Post.findByIdAndUpdate(postId, { $inc: { viewsCount: 1 } });
}

/**
 * Get user's liked posts with pagination
 */
export async function getUserLikedPosts(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  // Find interactions where user liked
  const interactions = await Interaction.find({ user: userId, liked: true })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'post',
      match: { status: 'published' },
      populate: [
        { path: 'author', select: 'name email role' },
        { path: 'categories', select: 'name' },
        { path: 'tags', select: 'name' }
      ]
    });

  // Filter out null posts
  const posts = interactions
    .filter(i => i.post)
    .map(i => {
      const post = i.post.toObject();
      post.userInteractions = { liked: true, favorited: i.favorited };
      return post;
    });

  // Add comment counts
  const postIds = posts.map(p => p._id);
  const commentCounts = await Comment.aggregate([
    { $match: { post: { $in: postIds }, status: 'approved' } },
    { $group: { _id: '$post', count: { $sum: 1 } } }
  ]);

  const commentCountMap = new Map(
    commentCounts.map(item => [item._id.toString(), item.count])
  );

  posts.forEach(post => {
    post.commentsCount = commentCountMap.get(post._id.toString()) || 0;
  });

  // Get total count
  const total = await Interaction.countDocuments({ user: userId, liked: true });

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  };
}

/**
 * Get user's favorited posts with pagination
 */
export async function getUserFavoritedPosts(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  // Find interactions where user favorited
  const interactions = await Interaction.find({ user: userId, favorited: true })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'post',
      match: { status: 'published' },
      populate: [
        { path: 'author', select: 'name email role' },
        { path: 'categories', select: 'name' },
        { path: 'tags', select: 'name' }
      ]
    });

  // Filter out null posts
  const posts = interactions
    .filter(i => i.post)
    .map(i => {
      const post = i.post.toObject();
      post.userInteractions = { liked: i.liked, favorited: true };
      return post;
    });

  // Add comment counts
  const postIds = posts.map(p => p._id);
  const commentCounts = await Comment.aggregate([
    { $match: { post: { $in: postIds }, status: 'approved' } },
    { $group: { _id: '$post', count: { $sum: 1 } } }
  ]);

  const commentCountMap = new Map(
    commentCounts.map(item => [item._id.toString(), item.count])
  );

  posts.forEach(post => {
    post.commentsCount = commentCountMap.get(post._id.toString()) || 0;
  });

  // Get total count
  const total = await Interaction.countDocuments({ user: userId, favorited: true });

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  };
}

/**
 * Get interaction status for a user and single post
 * THIS IS THE KEY FIX - Returns the actual interaction data
 */
export async function getUserInteractions(userId, postId) {
  if (!userId || !postId) {
    return { liked: false, favorited: false };
  }

  const interaction = await Interaction.findOne({ user: userId, post: postId });
  
  if (!interaction) {
    return { liked: false, favorited: false };
  }

  return {
    liked: interaction.liked || false,
    favorited: interaction.favorited || false,
  };
}

/**
 * Get user interactions for multiple posts
 * THIS IS THE KEY FIX - Returns the actual interaction data
 */
export async function getUserInteractionsForPosts(userId, postIds) {
  if (!userId || !postIds || postIds.length === 0) {
    return new Map();
  }

  const interactions = await Interaction.find({
    user: userId,
    post: { $in: postIds },
  });

  const map = new Map();
  interactions.forEach(i => {
    map.set(i.post.toString(), {
      liked: i.liked || false,
      favorited: i.favorited || false
    });
  });

  return map;
}
