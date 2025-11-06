/**
 * Dashboard Service
 * 
 * Provides analytics and statistics for different user roles.
 * 
 * @module modules/dashboard/service
 */

import Post from '../posts/post.model.js';
import User from '../auth/auth.model.js';
import Comment from '../comments/comment.model.js';
import Interaction from '../interactions/interaction.model.js';
import { POST_STATUS, COMMENT_STATUS } from '../../utils/constants.js';

/**
 * Gets admin dashboard summary
 */
export async function getAdminSummary() {
  const [totalUsers, totalPosts, totalComments, pendingPosts, pendingComments] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Comment.countDocuments(),
    Post.countDocuments({ status: POST_STATUS.PENDING }),
    Comment.countDocuments({ status: COMMENT_STATUS.PENDING }),
  ]);

  return {
    totalUsers,
    totalPosts,
    totalComments,
    pendingPosts,
    pendingComments,
  };
}

/**
 * Gets admin statistics with breakdowns
 */
export async function getAdminStats() {
  // Posts by status
  const postsByStatus = await Post.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);

  // Users by role
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        role: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);

  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentRegistrations = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Top authors by post count
  const topAuthors = await Post.aggregate([
    { $match: { status: POST_STATUS.PUBLISHED } },
    {
      $group: {
        _id: '$author',
        postCount: { $sum: 1 },
      },
    },
    { $sort: { postCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'authorDetails',
      },
    },
    { $unwind: '$authorDetails' },
    {
      $project: {
        author: {
          id: '$authorDetails._id',
          name: '$authorDetails.name',
          email: '$authorDetails.email',
        },
        postCount: 1,
        _id: 0,
      },
    },
  ]);

  return {
    postsByStatus,
    usersByRole,
    recentRegistrations,
    topAuthors,
  };
}

/**
 * Gets author dashboard summary
 */
export async function getAuthorSummary(userId) {
  const [totalPosts, publishedPosts, draftPosts, pendingPosts] = await Promise.all([
    Post.countDocuments({ author: userId }),
    Post.countDocuments({ author: userId, status: POST_STATUS.PUBLISHED }),
    Post.countDocuments({ author: userId, status: POST_STATUS.DRAFT }),
    Post.countDocuments({ author: userId, status: POST_STATUS.PENDING }),
  ]);

  // Get total views, likes, and comments on author's posts
  const authorPosts = await Post.find({ author: userId }).select('_id');
  const postIds = authorPosts.map(p => p._id);

  const [totalViews, totalLikes, totalComments] = await Promise.all([
    Post.aggregate([
      { $match: { author: userId } },
      { $group: { _id: null, total: { $sum: '$viewsCount' } } },
    ]).then(result => result[0]?.total || 0),
    
    Interaction.countDocuments({ post: { $in: postIds }, liked: true }),
    
    Comment.countDocuments({ post: { $in: postIds }, status: COMMENT_STATUS.APPROVED }),
  ]);

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    pendingPosts,
    totalViews,
    totalLikes,
    totalComments,
  };
}

/**
 * Gets author statistics with trends
 */
export async function getAuthorStats(userId) {
  // Posts by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const postsByMonth = await Post.aggregate([
    {
      $match: {
        author: userId,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' },
              ],
            },
          ],
        },
        count: 1,
        _id: 0,
      },
    },
  ]);

  // Top performing posts
  const topPosts = await Post.find({ author: userId, status: POST_STATUS.PUBLISHED })
    .sort({ viewsCount: -1 })
    .limit(5)
    .select('title viewsCount likesCount commentsCount createdAt');

  // Recent comments on author's posts
  const authorPosts = await Post.find({ author: userId }).select('_id');
  const postIds = authorPosts.map(p => p._id);

  const recentComments = await Comment.find({
    post: { $in: postIds },
    status: COMMENT_STATUS.APPROVED,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('author', 'name avatar')
    .populate('post', 'title');

  return {
    postsByMonth,
    topPosts,
    recentComments,
  };
}

/**
 * Gets user dashboard summary
 */
export async function getUserSummary(userId) {
  const [favoritedPostsCount, likedPostsCount, commentsMade] = await Promise.all([
    Interaction.countDocuments({ user: userId, favorited: true }),
    Interaction.countDocuments({ user: userId, liked: true }),
    Comment.countDocuments({ author: userId, status: COMMENT_STATUS.APPROVED }),
  ]);

  return {
    favoritedPostsCount,
    likedPostsCount,
    commentsMade,
  };
}

/**
 * Gets user activity stats
 */
export async function getUserStats(userId) {
  // Recent interactions
  const recentInteractions = await Interaction.find({
    user: userId,
    $or: [{ liked: true }, { favorited: true }],
  })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate({
      path: 'post',
      select: 'title author',
      populate: { path: 'author', select: 'name' },
    });

  // Recent comments
  const recentComments = await Comment.find({
    author: userId,
    status: COMMENT_STATUS.APPROVED,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('post', 'title');

  return {
    recentInteractions: recentInteractions.map(i => ({
      post: i.post,
      liked: i.liked,
      favorited: i.favorited,
      updatedAt: i.updatedAt,
    })),
    recentComments,
  };
}

export default {
  getAdminSummary,
  getAdminStats,
  getAuthorSummary,
  getAuthorStats,
  getUserSummary,
  getUserStats,
};
