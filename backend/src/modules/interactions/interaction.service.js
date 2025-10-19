import Interaction from './interaction.model.js';
import Post from '../posts/post.model.js';

export async function toggleLike(userId, postId) {
  let interaction = await Interaction.findOne({ user: userId, post: postId });
  if (!interaction) {
    interaction = new Interaction({ user: userId, post: postId, liked: true });
    await interaction.save();
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    return { liked: true };
  }

  // Toggle like
  const newLikedStatus = !interaction.liked;
  interaction.liked = newLikedStatus;
  await interaction.save();

  await Post.findByIdAndUpdate(postId, { $inc: { likesCount: newLikedStatus ? 1 : -1 } });

  return { liked: newLikedStatus };
}

export async function toggleFavorite(userId, postId) {
  let interaction = await Interaction.findOne({ user: userId, post: postId });
  if (!interaction) {
    interaction = new Interaction({ user: userId, post: postId, favorited: true });
    await interaction.save();
    await Post.findByIdAndUpdate(postId, { $inc: { favoritesCount: 1 } });
    return { favorited: true };
  }

  // Toggle favorite
  const newFavoritedStatus = !interaction.favorited;
  interaction.favorited = newFavoritedStatus;
  await interaction.save();

  await Post.findByIdAndUpdate(postId, { $inc: { favoritesCount: newFavoritedStatus ? 1 : -1 } });

  return { favorited: newFavoritedStatus };
}

export async function recordView(postId) {
  await Post.findByIdAndUpdate(postId, { $inc: { viewsCount: 1 } });
  return;
}
