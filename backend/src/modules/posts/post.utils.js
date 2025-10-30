export function formatPostSummary(post) {
  return {
    id: post._id,
    title: post.title,
    author: post.author?.name || 'Unknown',
    createdAt: post.createdAt,
    status: post.status,
  };
}

// Additional post-specific helpers can be added here later.
