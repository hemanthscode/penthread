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
  const comment = await Comment.findById(commentId).populate({
    path: 'post',
    select: 'author'
  });

  if (!comment) throw new Error('Comment not found');

  const postAuthorId = comment.post?.author?.toString();

  // Only admins or the author of the post can moderate
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
  return comment;
}


export async function deleteComment(commentId, userId, userRole) {
  const comment = await Comment.findById(commentId).populate({
    path: 'post',
    select: 'author'
  });

  if (!comment) throw new Error('Comment not found');

  const postAuthorId = comment.post?.author?.toString();
  const isAdmin = userRole === 'admin';
  const isAuthorOfPost = userRole === 'author' && postAuthorId === userId.toString();
  const isCommentOwner = comment.author?.toString() === userId.toString();

  // Admins can delete any, authors can delete comments on their own posts, users can delete their own
  if (!isAdmin && !isAuthorOfPost && !isCommentOwner) {
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne(); // ✅ modern Mongoose method
  return { message: 'Comment deleted successfully' };
}
