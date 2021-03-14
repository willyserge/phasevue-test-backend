/* eslint-disable no-underscore-dangle */
import Phase from '../models/phase';
import Project from '../models/project';
import User from '../models/user';

const Phases = {

  async getAllPhases(req, res) {
    const phases = await Phase.find().sort({ createdOn: 'asc' });
    res.status(200).json(phases);
  },
  createPhase(req, res) {
    req.body.name.forEach(async (element) => {
      const newPhase = new Phase({ name: element });
      const phase = await newPhase.save();
      const project = await Project.findOneAndUpdate({ _id: req.params.projectId }, { $push: { phases: phase._id } }, { new: true });
      console.log(project)
    });
    return res.status(201).json('project created');
    // const newTemplate = new Template(req.body);

    // const template = await newTemplate.save();
    // return res.status(201).json(template);
  }

};

export default Phases;
