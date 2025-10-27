import Post from './post.model.js';

export async function createPost(postData) {
  const post = new Post(postData);
  await post.save();
  return post;
}

export async function getPostById(postId) {
  return Post.findById(postId)
    .populate('author', 'name email role')
    .populate('categories', 'name')
    .populate('tags', 'name');
}

export async function getPosts(filter = {}, options = {}) {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;
  const skip = (page - 1) * limit;

  return Post.find(filter)
    .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'name email role')
    .populate('categories', 'name')
    .populate('tags', 'name');
}

export async function updatePost(postId, updateData, userId, isAdmin = false) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to update this post');
  }

  Object.assign(post, updateData);
  await post.save();
  return post;
}

export async function deletePost(postId, userId, isAdmin = false) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this post');
  }

  await post.deleteOne();
  return;
}

export async function approvePost(postId) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  post.status = 'approved';
  await post.save();
  return post;
}

export async function rejectPost(postId) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');
  post.status = 'rejected';
  await post.save();
  return post;
}

export async function publishPost(postId, userId, isAdmin = false) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to publish this post');
  }

  post.status = 'published';
  await post.save();
  return post;
}

export async function unpublishPost(postId, userId, isAdmin = false) {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    throw new Error('Not authorized to unpublish this post');
  }

  post.status = 'unpublished';
  await post.save();
  return post;
}
