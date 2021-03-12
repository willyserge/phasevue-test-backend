import 'regenerator-runtime/runtime';
import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import postsRouter from './routes/posts';
import cloudinaryRoutes from './routes/cloudinary';
import userRouter from './routes/user';
import projectsRouter from './routes/projects';


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/', postsRouter);
app.use('/api/', projectsRouter);
app.use('/api/', userRouter);
app.use('/api/cloudinary', cloudinaryRoutes);

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'welcome to the phase-view API'
  });
});

app.use((req, res, next) => {
  next(createError(404));
});
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status,
    error: {
      message: error.message
    }
  });
});

export default app;
