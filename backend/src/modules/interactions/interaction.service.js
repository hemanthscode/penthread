import Interaction from './interaction.model.js';
import Post from '../posts/post.model.js';

/**
 * Toggle like status, update counts atomically
 */
export async function toggleLike(userId, postId) {
  let interaction = await Interaction.findOne({ user: userId, post: postId });

  if (!interaction) {
    interaction = new Interaction({ user: userId, post: postId, liked: true });
    await interaction.save();
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    return { liked: true };
  }

  const newLikedStatus = !interaction.liked;
  interaction.liked = newLikedStatus;
  await interaction.save();

  await Post.findByIdAndUpdate(postId, { $inc: { likesCount: newLikedStatus ? 1 : -1 } });

  return { liked: newLikedStatus };
}

/**
 * Toggle favorite status, update counts atomically
 */
export async function toggleFavorite(userId, postId) {
  let interaction = await Interaction.findOne({ user: userId, post: postId });

  if (!interaction) {
    interaction = new Interaction({ user: userId, post: postId, favorited: true });
    await interaction.save();
    await Post.findByIdAndUpdate(postId, { $inc: { favoritesCount: 1 } });
    return { favorited: true };
  }

  const newFavoritedStatus = !interaction.favorited;
  interaction.favorited = newFavoritedStatus;
  await interaction.save();

  await Post.findByIdAndUpdate(postId, { $inc: { favoritesCount: newFavoritedStatus ? 1 : -1 } });

  return { favorited: newFavoritedStatus };
}

/**
 * Record a view increment on a post
 */
export async function recordView(postId) {
  await Post.findByIdAndUpdate(postId, { $inc: { viewsCount: 1 } });
}

/**
 * Retrieve interaction status for a user and a single post
 */
export async function getUserInteractions(userId, postId) {
  const interaction = await Interaction.findOne({ user: userId, post: postId });
  return {
    liked: interaction?.liked || false,
    favorited: interaction?.favorited || false,
  };
}

/**
 * Retrieve user interactions for multiple posts for efficient lookup
 */
export async function getUserInteractionsForPosts(userId, postIds) {
  const interactions = await Interaction.find({
    user: userId,
    post: { $in: postIds },
  });

  const map = new Map();
  interactions.forEach(i => {
    map.set(i.post.toString(), { liked: i.liked, favorited: i.favorited });
  });

  return map;
}
