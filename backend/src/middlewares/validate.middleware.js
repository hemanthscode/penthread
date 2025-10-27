// Request body validation middleware using Joi schemas
export default function validate(schema) {
  return (req, res, next) => {
    const validationOptions = { abortEarly: false, allowUnknown: true, stripUnknown: true };
    const { error, value } = schema.validate(req.body, validationOptions);
    if (error) {
      return res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
    }
    req.body = value;
    next();
  };
}
