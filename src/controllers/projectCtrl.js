/* eslint-disable no-underscore-dangle */
import slugify from 'slugify';
import Project from '../models/project';
import User from '../models/user';

const Projects = {

  async getAllProjects(req, res) {
    const projects = await Project.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  },

  async getOneProject(req, res) {
    const project = await Project.find({ _id: req.params.projectId }).populate('phases').sort({ createdAt: -1 });
    res.status(200).json(project);
  },

  async createProject(req, res) {
    req.body.slug = slugify(req.body.name);
    const newProject = new Project(req.body);
    newProject.createdBy = req.user.id;
    const project = await newProject.save();
    return res.status(201).json({ project });
  }
};

export default Projects;
