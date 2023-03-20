const express = require('express');
const bodyParser = require('body-parser');
const Project = require('../models/project');
const fs = require('fs/promises');

var project_router = express.Router();

project_router.use(bodyParser.json());

project_router.route('/')
  .get((req, res, next) => {
    console.log('------------------------ get projects')
    Project.find({})
      .then((projects) => { 
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(projects);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    console.log('------------------------ create a projects')
    console.log(req.body);
    if (req.body.ci_circle.use_standard_ci) {
      req.body.ci_circle.stages = [];
      Project.create(req.body)
        .then((project) => {
            console.log('------------------------', project);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(project);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    if (!req.body.ci_circle.use_standard_ci){
      if (!req.body.ci_circle.stages || !req.body.ci_circle.stages.length) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({"error": "stages is invalid"});
      } else {
        Project.create(req.body)
          .then((project) => {
              console.log('------------------------', project);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(project);
              convertParam(project);
          }, (err) => next(err))
          .catch((err) => next(err));
      }
    }
    
  })

project_router.route('/:projectId')
  .get((req, res, next) => {
    console.log('------------------------ get project by id')
    console.log(req.body);
    Project.findById(req.params.projectId)
        .then((project) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(project);
        }, (err) => next(err))
        .catch((err) => next(err));
  })
  .put((req, res, next) => {
    if (req.body.ci_circle.use_standard_ci) {
      req.body.ci_circle.stages = [];
    }
    if (!req.body.ci_circle.use_standard_ci && (!req.body.ci_circle.stages || !req.body.ci_circle.stages.length)){
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({"error": "stages is invalid"});
    }
    Project.findByIdAndUpdate(req.params.projectId, {
        $set: req.body
    }, { new: true })
        .then((project) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(project);
        }, (err) => next(err))
        .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Project.findByIdAndRemove(req.params.projectId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

const nodejs_template_dir = '/home/teko/anneal/ci-template/nodejs-template/vars/';
const ndoejs_local_dir = '/home/vagrant/';
const two_spaces = '  ';
const four_spaces = two_spaces + two_spaces;
const six_spaces = two_spaces + four_spaces;
const eight_spaces = four_spaces + four_spaces;

const convertParam = async (project) => {
  try {
    // all varibales
    var ci_info = "";
    // add repo_url
    ci_info += "repo_url: " + project.repo_url;
    ci_info += '\n' + "local_dir: " + ndoejs_local_dir + project.name;
    if (!project.ci_circle.use_standard_ci) {
            // custom stages
      let custom_ci_stages = "";
      custom_ci_stages += '\n' + 'custom_stages:'
      for (stage of project.ci_circle.stages) {
        custom_ci_stages += '\n' + two_spaces + '- name: ' + "'" + stage.name + "'";
        custom_ci_stages += '\n' + four_spaces + 'jobs:';
        for (job of stage.jobs) {
          custom_ci_stages += '\n' + six_spaces + '- name: ' + "'" + job.name + "'";
          custom_ci_stages += '\n' + eight_spaces + 'cmd: ' + "'" + job.command;
          var full_tags = "";
          if (job.tags && job.tags.length > 0) {
            for (tag of job.tags) {
              full_tags == " --" + tag ;
            }
          }
          custom_ci_stages += full_tags + "'";
        }
      }
      ci_info += custom_ci_stages;
      console.log({ci_info});
    }
    const project_custom_var_dir = nodejs_template_dir + project._id + ".yaml";
    await fs.writeFile(project_custom_var_dir, ci_info);
  } catch (err) {
    console.log(err);
  }
}

module.exports = project_router;