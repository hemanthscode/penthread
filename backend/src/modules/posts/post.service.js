import Post from './post.model.js';
import Comment from '../comments/comment.model.js';
import Interaction from '../interactions/interaction.model.js';
import * as interactionService from '../interactions/interaction.service.js';

function assertValidId(postId) {
  if (!postId) throw new Error('Invalid post id');
}

/**
 * Create new post
 */
export async function createPost(postData) {
  const post = new Post(postData);
  await post.save();
  return getPostById(post._id, postData.author);
}

/**
 * Get single post with all details
 */
export async function getPostById(postId, userId = null) {
  assertValidId(postId);
  
  const post = await Post.findById(postId)
    .populate('author', 'name email role')
    .populate('categories', 'name')
    .populate('tags', 'name');

  if (!post) return null;

  // Add comments count
  const commentsCount = await Comment.countDocuments({
    post: postId,
    status: 'approved',
  });
  post._doc.commentsCount = commentsCount;

  // Add user interactions if userId provided
  if (userId) {
    const interactions = await interactionService.getUserInteractions(userId, postId);
    post._doc.userInteractions = interactions;
  } else {
    // Default interactions for guests
    post._doc.userInteractions = { liked: false, favorited: false };
  }

  return post;
}

/**
 * Get posts with filtering, sorting, and pagination
 */
export async function getPosts(filter = {}, options = {}) {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', userId = null } = options;
  const skip = (page - 1) * limit;

  const query = Post.find(filter)
    .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name email role')
    .populate('categories', 'name')
    .populate('tags', 'name');

  const posts = await query.exec();
  
  if (posts.length === 0) {
    return [];
  }

  const postIds = posts.map((p) => p._id);

  // Bulk fetch comment counts
  const commentCounts = await Comment.aggregate([
    {
      $match: {
        post: { $in: postIds },
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$post',
        count: { $sum: 1 },
      },
    },
  ]);

  const commentCountMap = new Map(
    commentCounts.map((item) => [item._id.toString(), item.count])
  );

  // Add interactions and comment counts
  if (userId) {
    const interactionsMap = await interactionService.getUserInteractionsForPosts(userId, postIds);

    posts.forEach((post) => {
      const postIdStr = post._id.toString();
      post._doc.userInteractions = interactionsMap.get(postIdStr) || {
        liked: false,
        favorited: false,
      };
      post._doc.commentsCount = commentCountMap.get(postIdStr) || 0;
    });
  } else {
    // Add default interactions for guests
    posts.forEach((post) => {
      post._doc.userInteractions = { liked: false, favorited: false };
      post._doc.commentsCount = commentCountMap.get(post._id.toString()) || 0;
    });
  }

  return posts;
}

/**
 * Count posts matching filter
 */
export async function countPosts(filter = {}) {
  return Post.countDocuments(filter);
}

/**
 * Update post
 */
export async function updatePost(postId, updateData, userId, isAdmin = false) {
  assertValidId(postId);
  
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to update this post');
  }

  // Don't allow changing author
  delete updateData.author;

  Object.assign(post, updateData);
  await post.save();

  return getPostById(postId, userId);
}

/**
 * Delete post and related data
 */
export async function deletePost(postId, userId, isAdmin = false) {
  assertValidId(postId);
  
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this post');
  }

  // Delete related data in parallel
  await Promise.all([
    post.deleteOne(),
    Comment.deleteMany({ post: postId }),
    Interaction.deleteMany({ post: postId }),
  ]);
}

/**
 * Change post status
 */
async function changeStatus(postId, newStatus) {
  assertValidId(postId);
  
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  
  post.status = newStatus;
  await post.save();
  
  return post;
}

/**
 * Admin: Approve post
 */
export const approvePost = (postId) => changeStatus(postId, 'approved');

/**
 * Admin: Reject post
 */
export const rejectPost = (postId) => changeStatus(postId, 'rejected');

/**
 * Publish post (author or admin)
 */
export async function publishPost(postId, userId, isAdmin = false) {
  assertValidId(postId);
  
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  
  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized');
  }

  // Only approved or draft posts can be published
  if (!['draft', 'approved', 'unpublished'].includes(post.status)) {
    throw new Error(`Cannot publish post with status: ${post.status}`);
  }

  post.status = 'published';
  await post.save();
  
  return post;
}

/**
 * Unpublish post (author or admin)
 */
export async function unpublishPost(postId, userId, isAdmin = false) {
  assertValidId(postId);
  
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  
  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized');
  }

  // Only published posts can be unpublished
  if (post.status !== 'published') {
    throw new Error('Only published posts can be unpublished');
  }

  post.status = 'unpublished';
  await post.save();
  
  return post;
}

/**
 * Get post statistics
 */
export async function getPostStats(postId) {
  assertValidId(postId);
  
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const [commentsCount, likesCount, favoritesCount] = await Promise.all([
    Comment.countDocuments({ post: postId, status: 'approved' }),
    Interaction.countDocuments({ post: postId, liked: true }),
    Interaction.countDocuments({ post: postId, favorited: true }),
  ]);

  return {
    viewsCount: post.viewsCount,
    likesCount,
    favoritesCount,
    commentsCount,
  };
}
