import Comment from './comment.model.js';

export async function createComment({ postId, authorId, content }) {
  const comment = new Comment({
    post: postId,
    author: authorId,
    content,
    status: 'pending',
  });
  await comment.save();
  return comment;
}

export async function getCommentsByPost(postId) {
  return Comment.find({ post: postId, status: 'approved' })
    .populate('author', 'name role')
    .sort({ createdAt: -1 });
}

export async function moderateComment(commentId, action, userId, userRole) {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  if (userRole === 'author' && comment.post.author.toString() !== userId.toString()) {
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
  return comment;
}

export async function deleteComment(commentId, userId, userRole) {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  if (userRole !== 'admin' && !(userRole === 'author' && comment.post.author.toString() === userId.toString())) {
    throw new Error('Not authorized to delete this comment');
  }

  await comment.remove();
  return;
}
