// src/modules/posts/post.service.js
import Post from './post.model.js';
import Comment from '../comments/comment.model.js';
import * as interactionService from '../interactions/interaction.service.js';

function assertValidId(postId) {
  if (!postId) throw new Error('Invalid post id');
}

/**
 * Create new post defaulting status to 'pending'
 */
export async function createPost(postData) {
  const post = new Post(postData);
  await post.save();
  // Populate after save for consistent output
  return getPostById(post._id);
}

/**
 * Get single post with populated relations and user interaction status
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
    status: 'approved' 
  });
  post._doc.commentsCount = commentsCount;

  if (userId) {
    const interactions = await interactionService.getUserInteractions(userId, postId);
    post._doc.userInteractions = interactions;
  }

  return post;
}

/**
 * Paginated post fetching with filtering and sorting support
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

  // Get all post IDs for bulk comment counting
  const postIds = posts.map(p => p._id);

  // Bulk fetch approved comments count for all posts
  const commentCounts = await Comment.aggregate([
    {
      $match: {
        post: { $in: postIds },
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$post',
        count: { $sum: 1 }
      }
    }
  ]);

  // Create a map for quick lookup
  const commentCountMap = new Map(
    commentCounts.map(item => [item._id.toString(), item.count])
  );

  // Append interaction status and comments count per post
  if (userId) {
    const interactionsMap = await interactionService.getUserInteractionsForPosts(userId, postIds);

    posts.forEach(post => {
      post._doc.userInteractions = interactionsMap.get(post._id.toString()) || { 
        liked: false, 
        favorited: false 
      };
      post._doc.commentsCount = commentCountMap.get(post._id.toString()) || 0;
    });
  } else {
    // Add comments count even when no userId
    posts.forEach(post => {
      post._doc.commentsCount = commentCountMap.get(post._id.toString()) || 0;
    });
  }

  return posts;
}

/**
 * Update post with author/admin authorization
 */
export async function updatePost(postId, updateData, userId, isAdmin = false) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to update this post');
  }

  Object.assign(post, updateData);
  await post.save();

  return getPostById(postId, userId);
}

/**
 * Delete post with authorization
 */
export async function deletePost(postId, userId, isAdmin = false) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this post');
  }

  await post.deleteOne();
}

/**
 * Change post status utility methods
 */
async function changeStatus(postId, newStatus) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  post.status = newStatus;
  await post.save();
  return post;
}

export const approvePost = (postId) => changeStatus(postId, 'approved');
export const rejectPost = (postId) => changeStatus(postId, 'rejected');

export async function publishPost(postId, userId, isAdmin = false) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  if (!isAdmin && post.author.toString() !== userId.toString()) throw new Error('Not authorized');

  post.status = 'published';
  await post.save();
  return post;
}

export async function unpublishPost(postId, userId, isAdmin = false) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  if (!isAdmin && post.author.toString() !== userId.toString()) throw new Error('Not authorized');

  post.status = 'unpublished';
  await post.save();
  return post;
}
