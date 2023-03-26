const express = require('express');
const bodyParser = require('body-parser');
const Project = require('../models/project');
const Host = require('../models/host');
const Pipeline = require('../models/pipeline');
const Inventory = require('../models/inventory');
const fs = require('fs/promises');
const authenticate = require('./authenticate');

const nodejs_template_vars_dir = '/home/teko/anneal/ci-template/nodejs-template/vars/';
const nodejs_template_inventory_dir = '/home/teko/anneal/ci-template/nodejs-template/inventory/';

const any_template_vars_dir = '/home/teko/anneal/ci-template/any-template/vars/';
const any_template_inventory_dir = '/home/teko/anneal/ci-template/any-template/inventory/';

var project_router = express.Router();

project_router.use(bodyParser.json());

project_router.route('/')
  .get(authenticate.verifyUser, (req, res, next) => {
    Project.find({})
      .populate('inventory')
      .then((projects) => { 
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(projects);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    if (!req.body.use_standard_ci && (!req.body.stages || !req.body.stages.length)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({"error": "stages is invalid"});
    } else {
      Project.create(req.body)
        .then((project) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(project);
            if (project.type === 'JS') {
              Promise.all([convertParam(project, nodejs_template_vars_dir), createInventoryFile(project, nodejs_template_inventory_dir)])
              .then((values) => {
                console.log('--------------------------- sync project success');
              })
              .catch((err) => {
                console.log('--------------------------- sync project error');
              })
            }
            if (project.type === 'Khác') {
              Promise.all([convertParam(project, any_template_vars_dir), createInventoryFile(project, any_template_inventory_dir)])
              .then((values) => {
                console.log('--------------------------- sync project success');
              })
              .catch((err) => {
                console.log('--------------------------- sync project error');
              })
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    }
  })

project_router.route('/:projectId')
  .get(authenticate.verifyUser, (req, res, next) => {
    Project.findById(req.params.projectId)
      .populate('inventory')
      .then((project) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(project);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    if (req.body.use_standard_ci) {
      req.body.stages = [];
    }
    if (!req.body.use_standard_ci && (!req.body.stages || !req.body.stages.length)){
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({"error": "stages is invalid"});
    } else {
      Project.findByIdAndUpdate(req.params.projectId, {
        $set: req.body
      }, { new: true })
        .then((project) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(project);
            // convertParam(project);
            if (project.type === 'JS') {
              Promise.all([convertParam(project, nodejs_template_vars_dir), createInventoryFile(project, nodejs_template_inventory_dir)])
              .then((values) => {
                console.log('--------------------------- sync project success');
              })
              .catch((err) => {
                console.log('--------------------------- sync project error');
              })
            }
            if (project.type === 'Khác') {
              Promise.all([convertParam(project, any_template_vars_dir), createInventoryFile(project, any_template_inventory_dir)])
              .then((values) => {
                console.log('--------------------------- sync project success');
              })
              .catch((err) => {
                console.log('--------------------------- sync project error');
              })
            }
        }, (err) => next(err))
        .catch((err) => next(err));
      }
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Project.findByIdAndRemove(req.params.projectId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
        removeProjectFile(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

project_router.route('/:projectId/pipelines')
  .get((req, res, next) => {
    Pipeline.find({ project: req.params.projectId})
      .select('-result -commits')
      .populate('project', 'name repo_url')
      .then((pipelines) => { 
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(pipelines);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

const two_spaces = '  ';
const four_spaces = two_spaces + two_spaces;
const six_spaces = two_spaces + four_spaces;
const eight_spaces = four_spaces + four_spaces;

const convertParam = async (project, vars_dir) => {
  try {
    // all varibales
    var ci_info = "";
    // add repo_url
    ci_info += "repo_url: " + project.repo_url;
    ci_info += '\n' + "local_dir: " + '~/' + project.name.replace(/\s+/g, '');
    if (!project.use_standard_ci && project.stages && project.stages.length > 0) {
            // custom stages
      let custom_ci_stages = "";
      custom_ci_stages += '\n' + 'custom_stages:'
      for (const stage of project.stages) {
        custom_ci_stages += '\n' + two_spaces + '- name: ' + "'" + stage.name + "'";
        custom_ci_stages += '\n' + four_spaces + 'jobs:';
        for (const job of stage.jobs) {
          custom_ci_stages += '\n' + six_spaces + '- name: ' + "'" + job.name + "'";
          custom_ci_stages += '\n' + eight_spaces + 'cmd: ' + "'" + job.command;
          var full_tags = "";
          if (job.tags && job.tags.length > 0) {
            for (const tag of job.tags) {
              full_tags == " --" + tag ;
            }
          }
          custom_ci_stages += full_tags + "'";
        }
      }
      ci_info += custom_ci_stages;
      console.log({ci_info});
    }
    const project_custom_var_dir = vars_dir + project._id + ".yaml";
    await fs.writeFile(project_custom_var_dir, ci_info);
  } catch (err) {
    console.log(err);
  }
}

const createInventoryFile = async (project, inventory_dir) => {
  try {
    const inventory = await Inventory.findById(project.inventory);
    const hosts = await Host.find({_id: { $in: inventory.hosts }});
    let inventoryFile = "";
    for (const host of hosts) {
      inventoryFile += host.name + " ansible_host=" + host.host + " ansible_ssh_user=" + host.user_name + " ansible_ssh_private_key_file=" + host.private_key_file + "\n";
    }
    const custom_inventory_dir = inventory_dir + project.inventory + ".txt";
    await fs.writeFile(custom_inventory_dir, inventoryFile);
  } catch (err) {
    console.log(err)
  }
}

const removeProjectFile = async (project) => {
  try {
    fs.unlinkSync(`${nodejs_template_vars_dir}${project._id}.yaml`);
    fs.unlinkSync(`${any_template_vars_dir}${project._id}.yaml`);
    fs.unlinkSync(`${nodejs_template_inventory_dir}${project.inventory}.txt`);
    fs.unlinkSync(`${nodejs_template_inventory_dir}${project.inventory}.txt`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = project_router;