import * as postService from './post.service.js';

export async function createPost(req, res, next) {
  try {
    const post = await postService.createPost({
      ...req.body,
      author: req.user._id,
      status: 'pending',
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await postService.getPostById(req.params.postId, req.user?._id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function getPosts(req, res, next) {
  try {
    const filter = { status: 'published' };

    if (req.query.authorId) filter.author = req.query.authorId;
    if (req.query.categoryId) filter.categories = req.query.categoryId;
    if (req.query.tagId) filter.tags = req.query.tagId;

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'createdAt',
      order: req.query.order || 'desc',
      userId: req.user?._id,
    };

    const posts = await postService.getPosts(filter, options);
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const updatedPost = await postService.updatePost(
      req.params.postId,
      req.body,
      req.user._id,
      isAdmin,
    );
    res.json({ success: true, data: updatedPost });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    await postService.deletePost(req.params.postId, req.user._id, isAdmin);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function approvePost(req, res, next) {
  try {
    const post = await postService.approvePost(req.params.postId);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function rejectPost(req, res, next) {
  try {
    const post = await postService.rejectPost(req.params.postId);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function publishPost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const post = await postService.publishPost(req.params.postId, req.user._id, isAdmin);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function unpublishPost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const post = await postService.unpublishPost(req.params.postId, req.user._id, isAdmin);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}
