import Joi from '@hapi/joi';
import createError from 'http-errors';

const Validate = {
  signup: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().min(10).required(),
      name: Joi.string().required(),
      password: Joi.string().min(3).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw createError(400, error.details[0].message);
    }

    return next();
  },

  signin: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().min(10).required(),
      password: Joi.required()

    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw createError(400, error.details[0].message);
    }

    return next();
  },
  createPost: (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      body: Joi.string().required(),
      picture: Joi.string().required()

    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw createError(400, error.details[0].message);
    }

    return next();
  }

};

export default Validate;
