import Post from '../posts/post.model.js';
import User from '../users/user.model.js';
import Comment from '../comments/comment.model.js';
import Interaction from '../interactions/interaction.model.js';

/**
 * Admin summary: global counts of users, posts, comments
 */
export async function getAdminSummary() {
  const totalUsers = await User.countDocuments();
  const totalPosts = await Post.countDocuments();
  const totalComments = await Comment.countDocuments();
  return { totalUsers, totalPosts, totalComments };
}

/**
 * Admin stats: grouped posts by status and users by role
 */
export async function getAdminStats() {
  const postsPerStatus = await Post.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const usersPerRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);
  return { postsPerStatus, usersPerRole };
}

/**
 * Author summary: post counts & comments on their posts
 */
export async function getAuthorSummary(userId) {
  const totalPosts = await Post.countDocuments({ author: userId });
  const publishedPosts = await Post.countDocuments({ author: userId, status: 'published' });
  const totalComments = await Comment.countDocuments({ 'post.author': userId });

  const totalLikes = await Interaction.aggregate([
    { $match: { liked: true } },
    {
      $lookup: {
        from: 'posts',
        localField: 'post',
        foreignField: '_id',
        as: 'postDetails',
      },
    },
    { $unwind: '$postDetails' },
    { $match: { 'postDetails.author': userId } },
    { $count: 'likesCount' },
  ]);

  return {
    totalPosts,
    publishedPosts,
    totalComments,
    totalLikes: totalLikes[0]?.likesCount || 0,
  };
}

/**
 * Author stats: daily posts counts to show trends
 */
export async function getAuthorStats(userId) {
  const postsByDate = await Post.aggregate([
    { $match: { author: userId } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return { postsByDate };
}

/**
 * Basic user summary with enriched favorites and comments count
 */
export async function getUserSummary(userId) {
  const favoritePostsCount = await Interaction.countDocuments({ user: userId, favorited: true });
  const commentsMade = await Comment.countDocuments({ author: userId });
  return {
    favoritePostsCount,
    commentsMade,
  };
}
