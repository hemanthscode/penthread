// src/hooks/useForm.js
import { useState, useCallback } from 'react';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        // optionally re-validate field on change
        if (validate) {
          validate(values);
        }
      }
    },
    [errors, validate, values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, setValues, setErrors, handleChange, resetForm };
};
