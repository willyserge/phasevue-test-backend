import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
  const accessToken = req.cookies.jwt;
  if (accessToken) {
    const token = accessToken;
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        return next();
      } catch (e) {
        return next(createError(403, 'invalid token'));
      }
    }
  }
  return next(createError(403, 'authorization token must be provided'));
};

export default auth;