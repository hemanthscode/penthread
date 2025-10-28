import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { fetchPostById } from '../../services/postService';
import LikeButton from '../../components/interactions/LikeButton';
import FavoriteButton from '../../components/interactions/FavoriteButton';
import ViewCounter from '../../components/interactions/ViewCounter';
import CommentThread from '../../components/comments/CommentThread';
import CommentForm from '../../components/comments/CommentForm';
import * as commentService from '../../services/commentService';
import { useComments } from '../../hooks/useComments';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { comments, loading: commentsLoading, fetchComments } = useComments(id);

  useEffect(() => {
    fetchPostById(id).then((res) => setPost(res.data));
    // Record view count async, no need to wait
    import('../../services/interactionService').then(mod => mod.recordView(id));
  }, [id]);

  const addComment = async (content) => {
    await commentService.addComment(id, { content });
    fetchComments();
  };

  if (!post) return <Loader />;

  return (
    <article>
      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
      <p className="mb-4 text-gray-600 text-sm">
        By {post.author?.name} | {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="prose max-w-none mb-6">{post.content}</div>
      <div className="flex items-center space-x-6 mb-6">
        <LikeButton postId={id} likesCount={post.likesCount} />
        <FavoriteButton postId={id} favoritesCount={post.favoritesCount} />
        <ViewCounter postId={id} viewsCount={post.viewsCount} />
      </div>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentForm onSubmit={addComment} />
        {commentsLoading ? <Loader /> : <CommentThread comments={comments} />}
      </section>
    </article>
  );
};

export default PostDetails;
