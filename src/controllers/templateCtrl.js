/* eslint-disable no-underscore-dangle */
import Template from '../models/template';

const Templates = {

  async getTemplates(req, res) {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  },

  async createTemplate(req, res) {
    const newTemplate = new Template(req.body);
    const template = await newTemplate.save();

    return res.status(201).json(template);
  }
};

export default Templates;
