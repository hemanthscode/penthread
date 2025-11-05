import * as postService from './post.service.js';

/**
 * PUBLIC: Get published posts only
 */
export async function getPublicPosts(req, res, next) {
  try {
    const filter = { status: 'published' };

    if (req.query.authorId) filter.author = req.query.authorId;
    if (req.query.categoryId) filter.categories = req.query.categoryId;
    if (req.query.tagId) filter.tags = req.query.tagId;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'createdAt',
      order: req.query.order || 'desc',
      userId: req.user?._id, // Pass userId if authenticated
    };

    console.log('🔍 Fetching posts for user:', options.userId); // DEBUG

    const posts = await postService.getPosts(filter, options);
    const total = await postService.countPosts(filter);
    const totalPages = Math.ceil(total / options.limit);

    // DEBUG: Log first post's interactions
    if (posts.length > 0) {
      console.log('📊 First post interactions:', posts[0].userInteractions);
    }

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalItems: total,
        itemsPerPage: options.limit,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get single post by ID
 */
export async function getPost(req, res, next) {
  try {
    const userId = req.user?._id; // Pass userId if authenticated
    console.log('🔍 Fetching post for user:', userId); // DEBUG
    
    const post = await postService.getPostById(req.params.postId, userId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    console.log('📊 Post interactions:', post.userInteractions); // DEBUG
    
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

/**
 * AUTHOR: Get my own posts (all statuses)
 */
export async function getMyPosts(req, res, next) {
  try {
    const filter = { author: req.user._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.categoryId) filter.categories = req.query.categoryId;
    if (req.query.tagId) filter.tags = req.query.tagId;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'createdAt',
      order: req.query.order || 'desc',
      userId: req.user._id,
    };

    const posts = await postService.getPosts(filter, options);
    const total = await postService.countPosts(filter);
    const totalPages = Math.ceil(total / options.limit);

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalItems: total,
        itemsPerPage: options.limit,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * ADMIN: Get all posts (all statuses, all authors)
 */
export async function getAllPostsAdmin(req, res, next) {
  try {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.authorId) filter.author = req.query.authorId;
    if (req.query.categoryId) filter.categories = req.query.categoryId;
    if (req.query.tagId) filter.tags = req.query.tagId;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'createdAt',
      order: req.query.order || 'desc',
      userId: req.user._id,
    };

    const posts = await postService.getPosts(filter, options);
    const total = await postService.countPosts(filter);
    const totalPages = Math.ceil(total / options.limit);

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalItems: total,
        itemsPerPage: options.limit,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create new post
 */
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

/**
 * Update post
 */
export async function updatePost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const updatedPost = await postService.updatePost(
      req.params.postId,
      req.body,
      req.user._id,
      isAdmin
    );
    res.json({ success: true, data: updatedPost });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete post
 */
export async function deletePost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    await postService.deletePost(req.params.postId, req.user._id, isAdmin);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * ADMIN: Approve post
 */
export async function approvePost(req, res, next) {
  try {
    const post = await postService.approvePost(req.params.postId);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

/**
 * ADMIN: Reject post
 */
export async function rejectPost(req, res, next) {
  try {
    const post = await postService.rejectPost(req.params.postId);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

/**
 * Publish post
 */
export async function publishPost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const post = await postService.publishPost(req.params.postId, req.user._id, isAdmin);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

/**
 * Unpublish post
 */
export async function unpublishPost(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const post = await postService.unpublishPost(req.params.postId, req.user._id, isAdmin);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}
