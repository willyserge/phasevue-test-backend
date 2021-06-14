/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import slugify from 'slugify';
import jwt from 'jsonwebtoken';

import Phase from '../models/phase';
import Project from '../models/project';
import newCommentMail from '../utils/newCommentMail';
import clientClientEmail from '../utils/newClientMail';

const Projects = {

  async getAllProjects(req, res) {
    const projects = await Project
      .find({ collaborators: req.user.email })
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

  async addUserToProject(req, res) {
    const { token } = req.params;
    const details = jwt.verify(token, process.env.JWT_SECRET);
    if (details.inviteAs === 'viewer') {
      await Project.updateOne(
        { _id: details.projectId },
        { $addToSet: { collaborators: [details.email], viewers: [details.email] } }
      );
    }

    await Project.updateOne(
      { _id: details.projectId },
      { $addToSet: { collaborators: [details.email], admin: [details.email] } }
    );

    return res.status(200).json(details);
  },

  async createProject(req, res) {
    req.body.slug = slugify(req.body.name);
    req.body.collaborators = req.user.email;
    req.body.admins = req.user.email;
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
  },

  async updateProject(req, res) {
    const { projectId } = req.body;
    const project = await Project.findByIdAndUpdate(projectId, req.body);
    res.status(200).json(project);
  },

  async deleteProject(req, res) {
    const { projectId } = req.params;
    await Project.findByIdAndRemove(projectId);
    res.status(200).json({ message: 'project deleted successfully' });
  },

  async addClient(req, res) {
    const { projectId, email, projectName } = req.body;

    await Project.updateOne(
      { _id: projectId },
      { $addToSet: { clients: [email] } }
    );

    const newClientEmailData = {
      inviter: req.user.name,
      clientEmail: email,
      projectName
    };

    clientClientEmail(newClientEmailData);
    res.status(200).json('client added');
  },

  async getProjectClients(req, res) {
    const { projectId } = req.params;
    const clients = await Project.findById(projectId).select('clients');
    res.status(200).json(clients);
  }


};

export default Projects;
