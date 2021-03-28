/* eslint-disable no-underscore-dangle */
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
  }

};

export default Deliverables;
