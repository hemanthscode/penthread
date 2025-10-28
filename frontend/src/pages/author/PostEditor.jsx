import React from 'react';
import PostEditor from '../../components/posts/PostEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost, fetchPostById } from '../../services/postService';
import { useEffect, useState } from 'react';
import Loader from '../../components/common/Loader';

const PostEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (id) {
      fetchPostById(id).then((res) => {
        setPost(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  const onSave = async (data) => {
    if (id) {
      await updatePost(id, data);
    } else {
      await createPost(data);
    }
    navigate('/author/posts');
  };

  if (loading) return <Loader />;

  return <PostEditor initialData={post || undefined} onSave={onSave} />;
};

export default PostEditorPage;
