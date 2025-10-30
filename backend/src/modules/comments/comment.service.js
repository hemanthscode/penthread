import Comment from './comment.model.js';

/**
 * Create new comment with pending status
 */
export async function createComment({ postId, authorId, content }) {
  const comment = new Comment({
    post: postId,
    author: authorId,
    content,
    status: 'pending',
  });
  await comment.save();
  return comment.populate('author', 'name role');
}

/**
 * Retrieve approved comments by post, newest first
 */
export async function getCommentsByPost(postId) {
  return Comment.find({ post: postId, status: 'approved' })
    .populate('author', 'name role')
    .sort({ createdAt: -1 });
}

/**
 * Moderate comment status by admin or post author only
 */
export async function moderateComment(commentId, action, userId, userRole) {
  const comment = await Comment.findById(commentId).populate({
    path: 'post',
    select: 'author',
  });

  if (!comment) throw new Error('Comment not found');

  const postAuthorId = comment.post?.author?.toString();

  const isAdmin = userRole === 'admin';
  const isAuthorOfPost = userRole === 'author' && postAuthorId === userId.toString();

  if (!isAdmin && !isAuthorOfPost) {
    throw new Error('Not authorized to moderate this comment');
  }

  switch (action) {
    case 'approve':
      comment.status = 'approved';
      break;
    case 'reject':
      comment.status = 'rejected';
      break;
    default:
      throw new Error('Invalid moderation action');
  }

  await comment.save();
  return comment.populate('author', 'name role');
}

/**
 * Delete comment with complex role checks
 */
export async function deleteComment(commentId, userId, userRole) {
  const comment = await Comment.findById(commentId).populate({
    path: 'post',
    select: 'author',
  });

  if (!comment) throw new Error('Comment not found');

  const postAuthorId = comment.post?.author?.toString();
  const isAdmin = userRole === 'admin';
  const isAuthorOfPost = userRole === 'author' && postAuthorId === userId.toString();
  const isCommentOwner = comment.author?.toString() === userId.toString();

  if (!isAdmin && !isAuthorOfPost && !isCommentOwner) {
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();
  return { message: 'Comment deleted successfully' };
}
