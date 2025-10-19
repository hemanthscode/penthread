import * as interactionService from './interaction.service.js';

export async function likePost(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await interactionService.toggleLike(req.user._id, postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function favoritePost(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await interactionService.toggleFavorite(req.user._id, postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function viewPost(req, res, next) {
  try {
    const { postId } = req.params;
    await interactionService.recordView(postId);
    res.status(200).json({ message: 'View recorded' });
  } catch (err) {
    next(err);
  }
}
