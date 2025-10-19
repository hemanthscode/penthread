import * as commentService from './comment.service.js';

export async function createComment(req, res, next) {
  try {
    const { postId } = req.params;
    const comment = await commentService.createComment({ 
      postId, 
      authorId: req.user._id, 
      content: req.body.content 
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function getComments(req, res, next) {
  try {
    const { postId } = req.params;
    const comments = await commentService.getCommentsByPost(postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

export async function moderateComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const action = req.body.action; // 'approve' or 'reject'
    const userId = req.user._id;
    const userRole = req.user.role;

    const comment = await commentService.moderateComment(commentId, action, userId, userRole);
    res.json(comment);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId, req.user._id, req.user.role);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
}
