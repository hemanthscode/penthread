import { useState } from 'react';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import MultiSelect from '../common/MultiSelect';
import RichTextEditor from '../common/RichTextEditor';
import Loader from '../common/Loader';

const PostForm = ({ formData, setFormData, errors, categories, tags, loading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedCategories) => {
    setFormData((prev) => ({ ...prev, categories: selectedCategories }));
  };

  const handleTagChange = (selectedTags) => {
    setFormData((prev) => ({ ...prev, tags: selectedTags }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  if (loading) {
    return <Loader />;
  }

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.name,
  }));

  return (
    <div className="space-y-6">
      <Input
        label="Post Title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Enter an engaging title..."
        required
        helperText={`${formData.title.length}/200 characters`}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={handleContentChange}
          error={errors.content}
          placeholder="Write your post content here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
        )}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Minimum 50 characters required
        </p>
      </div>

      <MultiSelect
        label="Categories"
        options={categoryOptions}
        selected={formData.categories}
        onChange={handleCategoryChange}
        placeholder="Select categories..."
      />

      <MultiSelect
        label="Tags"
        options={tagOptions}
        selected={formData.tags}
        onChange={handleTagChange}
        placeholder="Select tags..."
      />
    </div>
  );
};

export default PostForm;
