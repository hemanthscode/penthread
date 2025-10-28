import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks';
import { postSchema } from '../../utils/formValidation';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import Input from '../common/Input';
import Button from '../common/Button';
import CategorySelector from '../categories/CategorySelector';
import TagSelector from '../tags/TagSelector';

const PostEditor = ({ initialData = {}, onSave }) => {
  const { categories } = useCategories();
  const { tags } = useTags();

  const { values, errors, handleChange, setValues, setErrors, resetForm } = useForm(
    {
      title: '',
      content: '',
      categories: [],
      tags: [],
      ...initialData,
    },
    (values) => {
      try {
        postSchema.validateSync(values, { abortEarly: false });
        setErrors({});
      } catch (err) {
        const validationErrors = {};
        err.inner.forEach(({ path, message }) => {
          validationErrors[path] = message;
        });
        setErrors(validationErrors);
      }
    }
  );

  useEffect(() => {
    setValues({ ...initialData });
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      postSchema.validateSync(values, { abortEarly: false });
      onSave(values);
    } catch (err) {
      // validation errors handled by useForm's validation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded shadow-sm bg-white">
      <Input
        label="Title"
        name="title"
        value={values.title}
        onChange={handleChange}
        error={errors.title}
        required
      />
      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          name="content"
          value={values.content}
          onChange={handleChange}
          className={`border rounded p-3 w-full min-h-[150px] resize-y ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
      </div>
      <CategorySelector
        categories={categories}
        selected={values.categories}
        onChange={(newCategories) => setValues({ ...values, categories: newCategories })}
      />
      <TagSelector
        tags={tags}
        selected={values.tags}
        onChange={(newTags) => setValues({ ...values, tags: newTags })}
      />
      <Button type="submit" variant="primary" disabled={Object.keys(errors).length > 0}>
        Save Post
      </Button>
    </form>
  );
};

export default PostEditor;
