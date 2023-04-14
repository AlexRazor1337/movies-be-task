const validator = (schema) => (req, res, next) => {
  const { body, params, query } = req;

  const request = { body, params, query };
  // Remove body, params, quert from request if they are empty objects for validation
  Object.keys(request).forEach((key) => (Object.keys(request[key]).length === 0) && delete request[key]);

  const { error } = schema.validate(request);
  if (error) new Error(error.details[0].message)

  next();
}

module.exports = validator;
