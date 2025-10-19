export function formatPostSummary(post) {
  return {
    id: post._id,
    title: post.title,
    author: post.author.name,
    createdAt: post.createdAt,
    status: post.status,
  };
}

// Additional utilities can be added here later.
