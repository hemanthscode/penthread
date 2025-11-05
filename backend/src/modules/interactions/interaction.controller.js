import * as interactionService from './interaction.service.js';

export async function likePost(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await interactionService.toggleLike(req.user._id, postId);
    res.json({ 
      success: true, 
      data: result,
      message: result.liked ? 'Post liked' : 'Like removed'
    });
  } catch (err) {
    next(err);
  }
}

export async function favoritePost(req, res, next) {
  try {
    const { postId } = req.params;
    const result = await interactionService.toggleFavorite(req.user._id, postId);
    res.json({ 
      success: true, 
      data: result,
      message: result.favorited ? 'Post saved to favorites' : 'Removed from favorites'
    });
  } catch (err) {
    next(err);
  }
}

export async function viewPost(req, res, next) {
  try {
    const { postId } = req.params;
    await interactionService.recordView(postId);
    res.status(200).json({ success: true, message: 'View recorded' });
  } catch (err) {
    next(err);
  }
}

export async function getLikedPosts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await interactionService.getUserLikedPosts(req.user._id, page, limit);
    res.json({ 
      success: true, 
      data: result.posts,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
}

export async function getFavoritedPosts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await interactionService.getUserFavoritedPosts(req.user._id, page, limit);
    res.json({ 
      success: true, 
      data: result.posts,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
}
