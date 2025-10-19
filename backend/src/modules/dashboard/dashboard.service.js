import Post from '../posts/post.model.js';
import User from '../users/user.model.js';
import Comment from '../comments/comment.model.js';

export async function getAdminSummary() {
  const totalUsers = await User.countDocuments();
  const totalPosts = await Post.countDocuments();
  const totalComments = await Comment.countDocuments();
  return { totalUsers, totalPosts, totalComments };
}

export async function getAdminStats() {
  const postsPerStatus = await Post.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const usersPerRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);
  return { postsPerStatus, usersPerRole };
}

export async function getAuthorSummary(userId) {
  const totalPosts = await Post.countDocuments({ author: userId });
  const publishedPosts = await Post.countDocuments({ author: userId, status: 'published' });
  const totalComments = await Comment.countDocuments({ 'post.author': userId }); // requires populate or alternative approach

  return { totalPosts, publishedPosts, totalComments };
}

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

export async function getUserSummary(userId) {
  // For user, basic stats such as favorites count and comments count
  // Assuming favorites are tracked in interactions

  // As an example, returning placeholder data
  return {
    favoritePostsCount: 0,
    commentsMade: 0,
  };
}
