import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const maxAge = 3 * 24 * 60 * 60 * 1000;

export const createAccessToken = (info) => {
  const token = jwt.sign(
    info,
    process.env.JWT_SECRET,
    { expiresIn: maxAge }
  );
  return token;
};

export const createInviationToken = (info) => {
  const token = jwt.sign(
    info,
    process.env.JWT_SECRET,
    { expiresIn: maxAge }
  );
  return token;
};

