/* eslint-disable no-underscore-dangle */
import Deliverable from '../models/deliverable';
import Image from '../models/image';

const Images = {

  async getDeliverableImages(req, res) {
    const images = await Deliverable.find({ _id: req.params.deliverableId }).populate('images').sort({ createdAt: -1 });
    res.status(200).json(images);
  },

  async createImages(req, res) {
    const newImage = new Image(req.body);
    const image = await newImage.save();
    const DeliverableImage = await Deliverable.findOneAndUpdate(
      { _id: req.body.id }, { $push: { images: image._id } }, { new: true }
    );
    return res.status(201).json(DeliverableImage);
  },

  async addImageAnnotations(req, res) {
    const image = await Image.findByIdAndUpdate(req.body.id, req.body, {
      new: true
    });
    res.status(200).json(image);
  },

  async deleteImage(req, res) {
    await Image.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: 'image deleted successfully' });
  }

};

export default Images;
