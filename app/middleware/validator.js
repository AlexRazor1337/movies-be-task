const joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const validator = (schema) => (req, res, next) => {
  const validationError = (error) => res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });

  const { body, params, query } = req;

  const request = { body, params, query };
  // Remove body, params, quert from request if they are empty objects for validation
  Object.keys(request).forEach((key) => (Object.keys(request[key]).length === 0) && delete request[key]);

  const { error } = schema.validate(request);
  if (error) return validationError(error);

  next();
}

module.exports = validator;
