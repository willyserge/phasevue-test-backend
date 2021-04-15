import cloudinary from 'cloudinary';
import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';

import auth from '../middleware/auth';
import authAdmin from '../middleware/authAdmin';

dotenv.config();

const uploadRouter = express.Router();

// we will upload image on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

uploadRouter.post('/', auth, (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send({ message: 'No files were uploaded.' });

    const { file } = req.files;
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).send({ message: 'Size too large' });
    }

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath);
      return res.status(400).send({ message: 'File format is incorrect.' });
    }

    cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'test' }, async (err, result) => {
      if (err) throw err;

      removeTmp(file.tempFilePath);

      res.send({ public_id: result.public_id, url: result.secure_url });
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Delete image only admin can use
uploadRouter.post('/destroy', auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).send({ message: 'No images Selected' });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;

      res.send({ message: 'Deleted Image' });
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});


const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

export default uploadRouter;