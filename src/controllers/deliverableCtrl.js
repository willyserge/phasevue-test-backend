/* eslint-disable no-underscore-dangle */
import Deliverable from '../models/deliverable';
import Phase from '../models/phase';
import Project from '../models/project';

const Deliverables = {

  async getAllProjects(req, res) {
    const projects = await Project.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  },

  async getOneProject(req, res) {
    const project = await Project.find({ _id: req.params.projectId }).populate('phases').sort({ createdAt: -1 });
    res.status(200).json(project);
  },

  async createDeliverable(req, res) {
    const newDeliverable = new Deliverable(req.body);
    const deliverable = await newDeliverable.save();
    const phase = await Phase.findOneAndUpdate({ _id: req.body.id }, { $push: { phases: deliverable._id } }, { new: true });
    return res.status(201).json({ phase });
  }
};

export default Deliverables;
