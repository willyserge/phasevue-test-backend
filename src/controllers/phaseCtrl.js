/* eslint-disable no-underscore-dangle */
import Phase from '../models/phase';
import Project from '../models/project';
import User from '../models/user';

const Phases = {

  async createPhase(req, res) {
    const { projectId } = req.params;
    const element = req.body.name;
    for (let i = 0; i < element.length; i++) {
      const newPhase = new Phase({ name: element[i], projectId });
      const phase = await newPhase.save();
      const project = await Project.findOneAndUpdate(
        { _id: projectId }, { $push: { phases: phase._id } }, { new: true }
      );
    }
    res.status(201).json('phases created successfully');
  }

};

export default Phases;
