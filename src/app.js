import 'regenerator-runtime/runtime';
import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import cloudinaryRoutes from './routes/cloudinary';
import userRouter from './routes/user';
import projectsRouter from './routes/projects';
import phasesRouter from './routes/phase';
import deliverableRouter from './routes/deliverable';
import commentRouter from './routes/comment';
import templatesRouter from './routes/template';


const app = express();

app.use(express.json());

const whitelist = [process.env.CLIENT_URL, process.env.CLIENT_URL_TWO, process.env.CLIENT_URL_THREE];

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['sessionId', 'Content-Type'],
  exposedHeaders: ['sessionId'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/', projectsRouter);
app.use('/api/template', templatesRouter);
app.use('/api/', phasesRouter);
app.use('/api/', deliverableRouter);
app.use('/api/', commentRouter);
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
