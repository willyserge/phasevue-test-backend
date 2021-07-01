/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import { v4 as uuidv4 } from 'uuid';

import Phase from '../models/phase';
import Project from '../models/project';
import clientClientEmail from '../utils/newClientMail';
import User from '../models/user';
import Invite from '../models/invite';
import inviteMail from '../utils/inviteMail';
import { createAccessToken } from '../utils';
import WelcomeMail from '../utils/welcomeMail';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const Projects = {

  async getAllProjects(req, res) {
    const projects = await Project
      .find({ collaborators: req.user.id })
      .populate({
        path: 'phases', // populate phases
        populate: {
          path: 'deliverables' // in phases, populate deliverables
        }
      }).populate('collaborators')
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
    req.body.collaborators = req.user.id;
    req.body.admins = req.user.id;
    const newProject = new Project(req.body);
    newProject.createdBy = req.user.id;
    const project = await newProject.save();

    const { template } = req.body;

    for (let i = 0; i < template.length; i++) {
      const newPhase = new Phase({ name: template[i], projectId: project._id });
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
    const project = await Project.findByIdAndRemove(projectId);
    await Phase.deleteMany({ projectId: project._id });
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
  },

  // invite collaborator

  async inviteCollaborator(req, res) {
    const { projectId, projectName, email } = req.body;
    const id = uuidv4();
    const newInvite = new Invite({
      email, id, projectId, projectName
    });
    const invite = await newInvite.save();
    const CLIENT_URL = process.env.INVITE_CLIENT_URL;
    const url = `${CLIENT_URL}/project/invite/${id}`;
    inviteMail({
      email: invite.email,
      url,
      projectName: invite.projectName,
      inviter: req.user.name
    });
    return res.status(200).json({ success: true });
  },

  // verify collaborator invite
  async verifyInvite(req, res) {
    const { id } = req.params;
    const invite = await Invite.findOne({ id });
    if (!invite) return res.status(400).json({ error: 'invalid page' });
    const user = await User.findOne({ email: invite.email }).select('-password');

    if (!user) return res.status(200).json({ message: 'user does not have an account' });
    const accessToken = createAccessToken({ id: user._id, email: user.email, name: user.name });
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge
    });
    // if user already has an account, add him to the project
    await Project.updateOne(
      { _id: invite.projectId },
      {
        $addToSet: {
          verifiedCollaborators: [user._id],
          viewers: [user.email],
          collaborators: [user.email]
        }
      }
    );
    return res.status(200).json({ message: 'user has an account', invite });
  },

  // authenticate users without accounts thought invites

  async authenticateInvitedUser(req, res) {
    const { name, id } = req.body;
    const invite = await Invite.findOne({ id });
    if (!invite) return res.status(400).json({ error: 'invalid page' });
    const newUser = new User({ name, email: invite.email });
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

    await Project.updateOne(
      { _id: invite.projectId },
      {
        $addToSet: {
          verifiedCollaborators: [registeredUser._id],
          viewers: [registeredUser.email],
          collaborators: [registeredUser.email]
        }
      }
    );
    return res.status(201).json(invite);
  }
};

export default Projects;
