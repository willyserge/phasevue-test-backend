/* eslint-disable no-underscore-dangle */
import slugify from 'slugify';
import Project from '../models/project';
import User from '../models/user';

const Projects = {

  async getAllProjects(req, res) {
    const projects = await Project.find().sort({ createdAt: -1 });
    console.log(req.user)
    res.status(200).json(projects);
  },

  async createProject(req, res) {
    req.body.slug = slugify(req.body.project[0].name);
    const newProject = new Project(req.body);
    newProject.createdBy = req.user.id;
    const project = await newProject.save();
    return res.status(201).json({ project });
  }
};

export default Projects;
