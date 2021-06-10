/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';

import Deliverable from '../models/deliverable';
import Phase from '../models/phase';

const Deliverables = {

  async getPhaseDeliverables(req, res) {
    const deliverables = await Phase.find(
      { _id: req.body.id }
    ).populate('deliverables').sort({ createdAt: -1 });
    res.status(200).json(deliverables);
  },

  async createDeliverable(req, res) {
    const newDeliverable = new Deliverable(req.body);
    const deliverable = await newDeliverable.save();

    await Phase.findOneAndUpdate(
      { _id: req.body.id }, { $push: { deliverables: deliverable._id } }, { new: true }
    );
    return res.status(201).json(deliverable);
  },
  async updateDeliverable(req, res) {
    const deliverable = await Deliverable.findByIdAndUpdate(req.body.id, req.body, {
      new: true
    });
    res.status(200).json(deliverable);
  },

  async deleteDeliverable(req, res) {
    const { deliverableId } = req.params;
    await Deliverable.findByIdAndRemove(deliverableId);
    res.status(200).json({ message: 'deliverable deleted successfully' });
  },

  async grantClientDeliverableAccess(req, res) {
    const { token } = req.params;
    const details = jwt.verify(token, process.env.JWT_SECRET); // decode client token
    // create http only jwt cookie if token is valid
    if (details) {
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 3 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json(details);
    }
    return res.status(400).json('bad request');
  }
};

export default Deliverables;
