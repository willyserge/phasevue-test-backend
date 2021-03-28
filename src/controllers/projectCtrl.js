/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import slugify from 'slugify';
import Phase from '../models/phase';
import Project from '../models/project';
import User from '../models/user';

const Projects = {

  async getAllProjects(req, res) {
    const projects = await Project
      .find({ createdBy: req.user.id })
      .populate({
        path: 'phases', // populate phases
        populate: {
          path: 'deliverables' // in phases, populate deliverables
        }
      })
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  },

  async getOneProject(req, res) {
    const project = await Project
      .find({ _id: req.params.projectId })
      .populate({
        path: 'phases', // populate phases
        populate: {
          path: 'deliverables' // in phases, populate deliverables
        }
      })
      .sort({ createdAt: -1 });
    res.status(200).json(project);
  },

  async createProject(req, res) {
    req.body.slug = slugify(req.body.name);
    req.body.members = req.user.email;
    const newProject = new Project(req.body);
    newProject.createdBy = req.user.id;
    const project = await newProject.save();

    const { template } = req.body;

    for (let i = 0; i < template.length; i++) {
      const newPhase = new Phase({ name: template[i] });
      const phase = await newPhase.save();
      await Project.findOneAndUpdate(
        { _id: project._id }, { $push: { phases: phase._id } }, { new: true }
      );
    }

    return res.status(201).json(project);
  }
};

export default Projects;
