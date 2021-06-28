/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';

import Deliverable from '../models/deliverable';
import DeliverableInvite from '../models/deliverableInvite';
import Phase from '../models/phase';
import User from '../models/user';
import { createAccessToken } from '../utils';
import WelcomeMail from '../utils/welcomeMail';

const maxAge = 3 * 24 * 60 * 60 * 1000;

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
  },

  // verify deliverable review request

  async verifyReviewRequest(req, res) {
    
    const { id } = req.params;
    const { email } = req.query;
    const deliverableInvite = await DeliverableInvite.findOne({ id, clientEmails: email });
    if (!deliverableInvite) return res.status(400).json({ error: 'invalid page' });
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(200).json({ message: 'user does not have an account' });
    const accessToken = createAccessToken({ id: user._id, email: user.email, name: user.name });
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    return res.status(200).json({ message: 'user has an account', deliverableInvite });
  },

  // create reviewer user account upon verification

  async authenticateReviewer(req, res) {

    const { name, id, email } = req.body;

    const deliverableInvite = await DeliverableInvite.findOne({ id, clientEmails: email });

    if (!deliverableInvite) return res.status(400).json({ error: 'invalid page' });
    const newUser = new User({ name, email });
    const registeredUser = await newUser.save();
    WelcomeMail(registeredUser.email, registeredUser.name);
    const accessToken = createAccessToken({
      id: registeredUser._id, email: registeredUser.email, name: registeredUser.name
    });

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });

    return res.status(201).json(deliverableInvite);
  }
};

export default Deliverables;
