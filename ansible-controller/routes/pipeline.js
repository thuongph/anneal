const express = require('express');
const bodyParser = require('body-parser');
const Pipeline = require('../models/pipeline');
const Project = require('../models/project');
const ansibleQueue = require('../processors/index');

var pipeline_router = express.Router();

pipeline_router.use(bodyParser.json());

pipeline_router.route('/')
  .get((req, res, next) => {
    Pipeline.find({})
      .select('-result -commits')
      .populate('project', 'name repo_url')
      .then((pipelines) => { 
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(pipelines);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    // check whether project is valid
    Project.findOne({repo_url: req.body.repository.html_url})
      .then((project) => {
          if (project != null) {
            const newPipeline = {project: project._id, commits: req.body.commits, head_commit: req.body.head_commit, sender: req.body.sender, status: 'pending'};
            // create new pipeline
            Pipeline.create(newPipeline)
              .then((pipeline) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(pipeline);
                  // add pipeline queue
                  ansibleQueue.add({pipeline: pipeline, project: project})
              }, (err) => next(err))
              .catch((err) => next(err));
          } else {
              err = new Error('Project ' + req.body.html_url + ' not found');
              err.status = 404;
              return next(err);
          }
      }, (err) => next(err))
      .catch((err) => next(err));
  })

pipeline_router.route('/:pipelineId')
  .get((req, res, next) => {
    Pipeline.findById(req.params.pipelineId)
      .populate('project', 'name repo_url')
      .then((pipeline) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(pipeline);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Pipeline.findByIdAndRemove(req.params.pipelineId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

module.exports = pipeline_router;